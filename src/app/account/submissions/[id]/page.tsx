import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import Link from 'next/link';

const statusLabels = {
  NEW: 'Новая',
  IN_PROGRESS: 'В процессе',
  PROCESSED: 'Обработано',
} as const;

type Props = { params: { id: string } };

export default async function SubmissionPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get('user-session')?.value;
  const userId = verifySessionToken(token || undefined);

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)] text-center">
          <h2 className="text-2xl font-semibold text-slate-950 mb-4">Войдите в аккаунт</h2>
          <p className="text-sm text-slate-600 mb-6">Чтобы просмотреть детали заявки, выполните вход.</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Войти
          </Link>
        </div>
      </main>
    );
  }

  const s = await prisma.contactSubmission.findUnique({ where: { id: params.id } });
  if (!s || s.userId !== userId) {
    return (
      <main className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)] text-center">
          <h2 className="text-2xl font-semibold text-slate-950 mb-4">Заявка не найдена</h2>
          <p className="text-sm text-slate-600 mb-6">Проверьте ссылку или вернитесь в личный кабинет.</p>
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 transition-colors"
          >
            Вернуться в аккаунт
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFF] px-6 py-16">
      <div className="max-w-3xl mx-auto rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)]">
        <div className="mb-8">
          <span className="text-xs tracking-[0.24em] uppercase text-slate-500 font-semibold">Детали заявки</span>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Просмотр заявки</h1>
          <p className="mt-3 text-sm text-slate-600">Информация о заявке, статус и сообщение клиента.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm text-slate-500">Имя</div>
            <div className="mt-2 text-base font-semibold text-slate-950">{s.name}</div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm text-slate-500">Почта</div>
            <div className="mt-2 text-base font-semibold text-slate-950">{s.email}</div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm text-slate-500">Телефон</div>
            <div className="mt-2 text-base font-semibold text-slate-950">{s.phone || '—'}</div>
          </div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <div className="text-sm text-slate-500">Дата создания</div>
            <div className="mt-2 text-base font-semibold text-slate-950">{new Date(s.createdAt).toLocaleString('ru-RU')}</div>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <div>
            <div className="text-sm text-slate-500">Статус</div>
            <div className="mt-2 inline-flex items-center justify-start w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
              {statusLabels[s.status as keyof typeof statusLabels] || s.status}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-sm text-slate-500 mb-3">Сообщение</div>
          <div className="rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] p-6 text-left text-slate-900 whitespace-pre-wrap">{s.message || 'Сообщение отсутствует.'}</div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/account"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-50 transition-colors"
          >
            Назад
          </Link>
          <a
            href={`/api/account/submission/${s.id}/export`}
            target="_blank"
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Скачать JSON
          </a>
        </div>
      </div>
    </main>
  );
}

