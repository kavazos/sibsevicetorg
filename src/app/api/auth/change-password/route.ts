import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySessionToken, comparePassword, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/user-session=([^;]+)/);
    if (!match) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const token = decodeURIComponent(match[1]);
    const userId = verifySessionToken(token);
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { currentPassword, newPassword } = await request.json();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const ok = await comparePassword(currentPassword, user.passwordHash);
    if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });

    const newHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Change password error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
