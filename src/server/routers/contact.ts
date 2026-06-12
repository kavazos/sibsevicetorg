import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import dns from "dns";
import net from "net";
import crypto from "crypto";
import { contactSubmitSchema, contactConfirmSchema } from "../schemas";

async function smtpVerify(email: string): Promise<boolean> {
  try {
    const parts = email.split("@");
    if (parts.length !== 2) return false;
    const domain = parts[1];

    const mx = await dns.promises.resolveMx(domain as string);
    if (!mx || mx.length === 0) return false;
    mx.sort((a: any, b: any) => a.priority - b.priority);

    const mxHost = mx[0].exchange;

    return await new Promise<boolean>((resolve) => {
      const socket = net.createConnection(25, mxHost);
      let stage = 0;
      let dataBuf = "";
      const emailSafe = email.replace(/[^\x00-\x7F]/g, "");

      const sendCmd = (cmd: string) => {
        try { socket.write(cmd + "\r\n"); } catch {}
      };

      const cleanup = (res: boolean) => { try { socket.end(); } catch {} ; resolve(res); };

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
          if (code >= 250 && code < 400) cleanup(true); else cleanup(false);
        }
      });

      socket.on("error", () => cleanup(false));
      socket.on("timeout", () => cleanup(false));
      socket.on("end", () => cleanup(false));
    });
  } catch { return false; }
}

export const contactRouter = router({
  submit: publicProcedure.input(contactSubmitSchema).mutation(async ({ input, ctx }) => {
    try {
      const { name, phone, email, message } = input;

      const token = crypto.randomBytes(24).toString("hex");
      const confirmationSentAt = new Date();

      let userId: string | null = null;
      const cookieHeader = ctx.req.headers.cookie || "";
      const match = cookieHeader.match(/user-session=([^;]+)/);
      if (match) {
        const tok = decodeURIComponent(match[1]);
        const { verifySessionToken } = await import("@/lib/auth");
        userId = verifySessionToken(tok) || null;
      }

      const contact = await prisma.contactSubmission.create({ data: { name, phone, email, message, confirmationToken: token, confirmationSentAt, isDeliverable: false, status: "NEW", userId: userId || null } });

      void (async () => {
        try {
          const exists = await smtpVerify(email);
          await prisma.contactSubmission.update({ where: { id: contact.id }, data: { isDeliverable: exists } });

          const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587, secure: process.env.SMTP_SECURE === "true", auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined });
          const site = process.env.SITE_URL || `http://${ctx.req.headers.host || "localhost:3000"}`;
          const confirmUrl = `${site.replace(/\/$/, "")}/?confirmed_token=${token}`;

          const userMailHtml = `
            <p>Здравствуйте, ${name}.</p>
            <p>Ваша заявка успешно принята и зарегистрирована в нашей системе.</p>
            <p>Наш менеджер свяжется с вами в течение рабочего дня.</p>
            <p>Если нужно подтвердить адрес электронной почты, перейдите по ссылке ниже:</p>
            <p><a href="${confirmUrl}">Подтвердить email</a></p>
          `;

          await transporter.sendMail({ from: process.env.SMTP_FROM, to: email, subject: `Ваша заявка принята — ${process.env.SITE_NAME || "Сибсервисторг"}`, html: userMailHtml });

          const mailText = `Новая заявка\n\nИмя: ${name}\nEmail: ${email}\nТелефон: ${phone || "-"}\n\nСообщение:\n${message}\n\nПодтверждено: ${exists ? "да" : "нет"}`;
          await transporter.sendMail({ from: process.env.SMTP_FROM, to: process.env.CONTACT_EMAIL || process.env.SMTP_FROM, subject: `Новая заявка от ${name}`, text: mailText });
        } catch (mailErr) { console.error("Failed to send emails:", mailErr); }
      })();

      return { success: true, id: contact.id };
    } catch (err) { console.error("Contact submit error:", err); throw new Error("Внутренняя ошибка сервера"); }
  }),

  confirm: publicProcedure.input(contactConfirmSchema).mutation(async ({ input, ctx }) => {
    try {
      const { token } = input;
      const submission = await prisma.contactSubmission.findUnique({ where: { confirmationToken: token } });
      if (!submission) throw new Error("Токен не найден");
      await prisma.contactSubmission.update({ where: { id: submission.id }, data: { confirmed: true, confirmedAt: new Date(), confirmationToken: null } });
      return { success: true };
    } catch (err) { console.error("Contact confirm error:", err); throw new Error("Confirm error"); }
  }),
});

export type ContactRouter = typeof contactRouter;
