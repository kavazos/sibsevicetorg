import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-prod";

// Генерируем сессионный токен
function generateSessionToken(username: string): string {
  const timestamp = Date.now();
  const data = `${username}-${timestamp}-${SESSION_SECRET}`;
  return createHash("sha256").update(data).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Проверяем учетные данные
    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }

    // Генерируем токен сессии
    const sessionToken = generateSessionToken(username);

    // Создаем ответ
    const response = NextResponse.json(
      { success: true, message: "Успешный вход" },
      { status: 200 }
    );

    // Устанавливаем cookie с токеном
    response.cookies.set("admin-session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 часа
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
