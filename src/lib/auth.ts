import { createHmac, randomBytes } from "crypto";
import bcrypt from "bcryptjs";

const SESSION_SECRET = process.env.SESSION_SECRET || "dev_secret";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(userId: string) {
  const timestamp = Date.now();
  const random = randomBytes(8).toString("hex");
  const base = `${userId}:${timestamp}:${random}`;
  const sig = createHmac("sha256", SESSION_SECRET).update(base).digest("hex");
  return `${base}:${sig}`;
}

export function verifySessionToken(token: string | null | undefined) {
  if (!token) return null;
  try {
    const parts = token.split(":");
    if (parts.length < 4) return null;
    const sig = parts.pop() as string;
    const base = parts.join(":");
    const expected = createHmac("sha256", SESSION_SECRET).update(base).digest("hex");
    if (expected !== sig) return null;
    const userId = parts[0];
    return userId;
  } catch {
    return null;
  }
}

export function getCookieOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    path: "/",
    maxAge: maxAgeSeconds,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function cookieHeaderOptions(maxAgeSeconds = 60 * 60 * 24 * 7) {
  return `HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}
