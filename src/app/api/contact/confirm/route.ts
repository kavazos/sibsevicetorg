import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Token отсутствует" }, { status: 400 });

    const submission = await prisma.contactSubmission.findUnique({ where: { confirmationToken: token } });
    if (!submission) return NextResponse.json({ error: "Токен не найден" }, { status: 404 });

    await prisma.contactSubmission.update({ where: { id: submission.id }, data: { confirmed: true, confirmedAt: new Date(), confirmationToken: null } });

    // Optionally redirect to a thank-you page
    const site = process.env.SITE_URL || "http://localhost:3000";
    return NextResponse.redirect(site + "/?confirmed=1");
  } catch (err) {
    console.error("Confirm error:", err);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
