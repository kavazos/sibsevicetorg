import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/user-session=([^;]+)/);
    if (!match) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const token = decodeURIComponent(match[1]);
    const userId = verifySessionToken(token);
    if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { name } = body;

    const updated = await prisma.user.update({ where: { id: userId }, data: { name } , select: { id: true, email: true, name: true}});
    return NextResponse.json({ user: updated });
  } catch (e) {
    console.error('Update profile error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
