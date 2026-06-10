import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth";
import Link from "next/link";
import PaginatedList from '@/components/account/PaginatedList';
import dynamic from "next/dynamic";

const ProfileForm = dynamic(() => import('@/components/account/ProfileForm'), { ssr: false });

export default async function AccountPage({ searchParams }: { searchParams?: { page?: string; status?: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("user-session")?.value;
  const userId = verifySessionToken(token || undefined);

  const page = Math.max(1, parseInt((searchParams?.page as string) || '1', 10) || 1);
  const limit = 10;
  const statusFilter = (searchParams?.status as string) || '';

  const where: any = userId ? { userId } : {};
  if (statusFilter) where.status = statusFilter;

  const total = userId ? await prisma.contactSubmission.count({ where }) : 0;
  const allSubs = userId ? await prisma.contactSubmission.findMany({ where: { userId } }) : [];
  const counts = allSubs.reduce((acc, s) => {
    acc[s.status] = (acc[s.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusLabel = (s: string) => {
    switch (s) {
      case 'NEW': return 'Новая';
      case 'IN_PROGRESS': return 'В работе';
      case 'PROCESSED': return 'Обработана';
      default: return s.toLowerCase();
    }
  }

  const statusClass = (s: string) => {
    switch (s) {
      case 'NEW': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PROCESSED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-950 px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-slate-200 bg-white p-12 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)]">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.28em] text-accent">Личный кабинет</div>
            <h1 className="mt-4 text-[clamp(2.5rem,5vw,3.5rem)] font-display leading-tight text-slate-950">Войдите в свой аккаунт</h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-600">Здесь вы сможете видеть все свои заявки, отслеживать статус и управлять профилем.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/login" className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(28,110,255,0.45)] transition-colors duration-200 hover:bg-accent-dark">Войти</Link>
              <Link href="/auth/register" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:border-slate-300">Регистрация</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-accent">Личный кабинет</div>
              <h1 className="mt-3 text-3xl font-display leading-tight text-slate-950">Добро пожаловать, {user?.name || user?.email}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Просматривайте заявки и управляйте настройками без лишнего прокручивания.</p>
            </div>
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-300">На главную</Link>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.55fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)]">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.24em] text-accent">Мои заявки</div>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-950">Все обращения</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/account" className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === '' ? 'bg-accent text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Все</Link>
                  <Link href={`/account?status=NEW`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === 'NEW' ? 'bg-accent text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Новые</Link>
                  <Link href={`/account?status=IN_PROGRESS`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === 'IN_PROGRESS' ? 'bg-accent text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>В работе</Link>
                  <Link href={`/account?status=PROCESSED`} className={`rounded-full px-4 py-2 text-sm font-medium transition ${statusFilter === 'PROCESSED' ? 'bg-accent text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}>Обработанные</Link>
                </div>
              </div>

              <div className="mt-8">
                <PaginatedList userId={userId as string} page={page} limit={limit} where={where} statusLabel={statusLabel} statusClass={statusClass} />
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)]">
                <div className="text-sm uppercase tracking-[0.24em] text-accent">Статистика</div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Всего</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">{total}</div>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Новые</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">{counts['NEW'] || 0}</div>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">В работе</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">{counts['IN_PROGRESS'] || 0}</div>
                  </div>
                  <div className="rounded-[1.5rem] bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Обработано</div>
                    <div className="mt-3 text-2xl font-semibold text-slate-950">{counts['PROCESSED'] || 0}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)]">
              <div className="text-sm uppercase tracking-[0.24em] text-accent">Настройки</div>
              <div className="mt-6">
                <ProfileForm user={{ id: user?.id as string, name: user?.name as string | undefined, email: user?.email as string }} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_-44px_rgba(15,23,42,0.16)]">
              <div className="text-sm uppercase tracking-[0.24em] text-accent">Инструкции</div>
              <h3 className="mt-3 text-xl font-semibold text-slate-950">Что дальше?</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">Вы можете вернуться к общей информации на главной странице или создать новое обращение через форму контактов.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Статус обновляется автоматически при обработке заявки.</div>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Нажмите на заявку, чтобы открыть подробности и скачать JSON.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

