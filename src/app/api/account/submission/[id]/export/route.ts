import prisma from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(/user-session=([^;]+)/);
    if (!match) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    const token = decodeURIComponent(match[1]);
    const userId = verifySessionToken(token);
    if (!userId) return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });

    const id = params.id;
    const s = await prisma.contactSubmission.findUnique({ where: { id } });
    if (!s || s.userId !== userId) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    const payload = { id: s.id, name: s.name, email: s.email, phone: s.phone, message: s.message, status: s.status, createdAt: s.createdAt };
    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="submission-${id}.json"`
      }
    });
  } catch (e) {
    console.error('Export error', e);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
