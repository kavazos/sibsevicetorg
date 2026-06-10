import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword, createSessionToken, cookieHeaderOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email и пароль обязательны" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Неверные учётные данные" }, { status: 401 });
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Неверные учётные данные" }, { status: 401 });
    }

    const token = createSessionToken(user.id);
    const res = NextResponse.json({ success: true, id: user.id });
    res.headers.set("Set-Cookie", `user-session=${token}; ${cookieHeaderOptions()}`);
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
