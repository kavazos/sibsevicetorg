import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import dynamic from 'next/dynamic';

const ProfileForm = dynamic(() => import('@/components/account/ProfileForm'), { ssr: false });

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('user-session')?.value;
  const userId = verifySessionToken(token || undefined);
  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Войдите в аккаунт</h2>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <main className="min-h-screen bg-slate px-6 py-16">
      <div className="max-w-3xl mx-auto bg-slate p-6 rounded-md">
        <h1 className="text-2xl font-semibold mb-4">Профиль</h1>
        <ProfileForm user={{ id: user?.id as string, name: user?.name as string | undefined, email: user?.email as string }} />
      </div>
    </main>
  )
}

