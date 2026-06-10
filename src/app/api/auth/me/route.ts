import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/user-session=([^;]+)/);
    if (!match) return NextResponse.json({ user: null });
    const token = decodeURIComponent(match[1]);
    const userId = verifySessionToken(token);
    if (!userId) return NextResponse.json({ user: null });
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
    return NextResponse.json({ user });
  } catch (e) {
    console.error('Me route error', e);
    return NextResponse.json({ user: null });
  }
}
