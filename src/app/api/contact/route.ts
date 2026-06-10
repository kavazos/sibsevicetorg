import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import dns from "dns";
import net from "net";
import crypto from "crypto";

interface ContactBody {
  name: string;
  phone: string;
  email: string;
  message: string;
}

async function smtpVerify(email: string): Promise<boolean> {
  try {
    const parts = email.split("@");
    if (parts.length !== 2) return false;
    const domain = parts[1];

    const mx = await dns.promises.resolveMx(domain);
    if (!mx || mx.length === 0) return false;
    mx.sort((a, b) => a.priority - b.priority);

    const mxHost = mx[0].exchange;

    return await new Promise<boolean>((resolve) => {
      const socket = net.createConnection(25, mxHost);
      let stage = 0;
      let dataBuf = "";
      const emailSafe = email.replace(/[^\x00-\x7F]/g, "");

      const sendCmd = (cmd: string) => {
        try {
          socket.write(cmd + "\r\n");
        } catch {
          // ignore
        }
      };

      const cleanup = (res: boolean) => {
        try {
          socket.end();
        } catch {}
        resolve(res);
      };

      socket.setEncoding("utf8");
      socket.setTimeout(8000);

      socket.on("data", (chunk) => {
        dataBuf += chunk;
        const lines = dataBuf.split(/\r?\n/).filter(Boolean);
        const last = lines[lines.length - 1] || "";
        const code = Number(last.slice(0, 3));

        if (stage === 0 && code === 220) {
          sendCmd(`HELO ${process.env.SMTP_FROM?.split("@")[1] || "localhost"}`);
          stage = 1;
        } else if (stage === 1 && code >= 250) {
          sendCmd(`MAIL FROM:<${process.env.SMTP_FROM || "verify@localhost"}>`);
          stage = 2;
        } else if (stage === 2 && code >= 250) {
          sendCmd(`RCPT TO:<${emailSafe}>`);
          stage = 3;
        } else if (stage === 3) {
          if (code >= 250 && code < 400) {
            cleanup(true);
          } else {
            cleanup(false);
          }
        }
      });

      socket.on("error", () => cleanup(false));
      socket.on("timeout", () => cleanup(false));
      socket.on("end", () => cleanup(false));
    });
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactBody;
    const { name, phone, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Имя, email и сообщение обязательны" }, { status: 400 });
    }

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Некорректный формат email" }, { status: 400 });
    }

    // Create a confirmation token for double opt-in
    const token = crypto.randomBytes(24).toString("hex");
    const confirmationSentAt = new Date();

    // Попытка привязать заявку к пользователю, если в cookie есть валидная сессия
    let userId: string | null = null;
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/user-session=([^;]+)/);
    if (match) {
      const token = decodeURIComponent(match[1]);
      const { verifySessionToken } = await import("@/lib/auth");
      userId = verifySessionToken(token) || null;
    }

    const contact = await prisma.contactSubmission.create({
      data: {
        name,
        phone,
        email,
        message,
        confirmationToken: token,
        confirmationSentAt,
        isDeliverable: false,
        status: "NEW",
        userId: userId || null,
      },
    });

    const response = NextResponse.json({ success: true, id: contact.id });

    void (async () => {
      try {
        const exists = await smtpVerify(email);
        await prisma.contactSubmission.update({
          where: { id: contact.id },
          data: { isDeliverable: exists },
        });

        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: process.env.SMTP_USER
            ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
            : undefined,
        });

        const site = process.env.SITE_URL || `http://${request.headers.get("host") || "localhost:3000"}`;
        const confirmUrl = `${site.replace(/\/$/, "")}/api/contact/confirm?token=${token}`;

        const userMailHtml = `
          <p>Здравствуйте, ${name}.</p>
          <p>Ваша заявка успешно принята и зарегистрирована в нашей системе.</p>
          <p>Наш менеджер свяжется с вами в течение рабочего дня.</p>
          <p>Если нужно подтвердить адрес электронной почты, перейдите по ссылке ниже:</p>
          <p><a href="${confirmUrl}">Подтвердить email</a></p>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: `Ваша заявка принята — ${process.env.SITE_NAME || "Сибсервисторг"}`,
          html: userMailHtml,
        });

        const mailText = `Новая заявка\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone || "-"}\n\nСообщение:\n${message}\n\nПодтверждено: ${exists ? "да" : "нет"}`;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_FROM,
          subject: `Новая заявка от ${name}`,
          text: mailText,
        });
      } catch (mailErr) {
        console.error("Failed to send emails:", mailErr);
      }
    })();

    return response;
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
