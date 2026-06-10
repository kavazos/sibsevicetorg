import prisma from '@/lib/prisma';
import Link from 'next/link';

type Props = {
  userId: string;
  page: number;
  limit: number;
  where: any;
};

export default async function PaginatedList({ userId, page, limit, where }: Props) {
  const skip = (page - 1) * limit;
  const submissions = await prisma.contactSubmission.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit });
  const total = await prisma.contactSubmission.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const statusLabel = (s: string) => {
    switch (s) {
      case 'NEW': return 'Новая';
      case 'IN_PROGRESS': return 'В работе';
      case 'PROCESSED': return 'Обработана';
      default: return s;
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

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {submissions.map((s) => (
          <li key={s.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)]">
            <Link href={`/account/submissions/${s.id}`} className="block">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-950">{s.name || 'Заявка'}</div>
                  <div className="mt-2 text-sm text-slate-600">{s.email} • {s.phone}</div>
                </div>
                <div className="text-sm text-slate-500">{new Date(s.createdAt).toLocaleString('ru-RU')}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(s.status)}`}>{statusLabel(s.status)}</span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">Просмотр заявки</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-600">Страница {page} из {totalPages}</div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/account?page=${Math.max(1, page-1)}`} className={`rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}>Назад</Link>
          <Link href={`/account?page=${Math.min(totalPages, page+1)}`} className={`rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 ${page === totalPages ? 'opacity-50 pointer-events-none' : ''}`}>Далее</Link>
        </div>
      </div>
    </div>
  )
}

