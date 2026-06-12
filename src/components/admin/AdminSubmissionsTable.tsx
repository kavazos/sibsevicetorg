"use client";

import { useMemo, useState } from "react";
import type { ContactSubmission, SubmissionStatus } from "@prisma/client";
import { trpc } from "@/lib/trpc";

interface AdminSubmissionsTableProps {
  submissions: ContactSubmission[];
}

type AdminStatusFilter = SubmissionStatus | "all";

const statusOptions: { value: AdminStatusFilter; label: string }[] = [
  { value: "all", label: "Все статусы" },
  { value: "NEW", label: "Новая" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "PROCESSED", label: "Обработано" },
];

const statusLabels: Record<SubmissionStatus, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  PROCESSED: "Обработано",
};

const formatCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

export default function AdminSubmissionsTable({ submissions }: AdminSubmissionsTableProps) {
  const [items, setItems] = useState(submissions);
  const [statusFilter, setStatusFilter] = useState<AdminStatusFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    console.log("[Filter Debug] Items:", items.length, "Status:", statusFilter, "Search:", searchTerm, "DateFrom:", dateFrom, "TimeFrom:", timeFrom);
    
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const result = items.filter((submission) => {
      const submissionStatus: SubmissionStatus = submission.status ?? "NEW";
      const createdAt = new Date(submission.createdAt);

      // Фильтр по статусу
      if (statusFilter !== "all" && submissionStatus !== statusFilter) {
        console.log("[Filter] Excluded by status:", submission.name, submissionStatus, "!==", statusFilter);
        return false;
      }

      // Фильтр по дате и времени
      if (dateFrom) {
        const fromDate = new Date(`${dateFrom}T00:00:00`);
        if (timeFrom) {
          const [hours, minutes] = timeFrom.split(":");
          fromDate.setHours(Number(hours) || 0);
          fromDate.setMinutes(Number(minutes) || 0);
          fromDate.setSeconds(0);
        }

        console.log("[Filter] Date check:", submission.name, "createdAt:", createdAt, "fromDate:", fromDate, "createdAt < fromDate:", createdAt < fromDate);
        
        if (createdAt < fromDate) {
          return false;
        }
      }

      // Фильтр по поиску
      if (normalizedSearch) {
        const searchText = [
          submission.name,
          submission.email,
          submission.phone || "",
          submission.message,
        ]
          .join(" ")
          .toLowerCase();
        
        const matches = searchText.includes(normalizedSearch);
        console.log("[Filter] Search check:", submission.name, "matches:", matches);
        return matches;
      }

      return true;
    });
    
    console.log("[Filter Result] Filtered items:", result.length);
    return result;
  }, [items, statusFilter, searchTerm, dateFrom, timeFrom]);

  const stats = useMemo(() => {
    const total = items.length;
    const statusCounts = {
      new: 0,
      in_progress: 0,
      processed: 0,
    };
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    let weekCount = 0;
    let monthCount = 0;

    items.forEach((submission) => {
      const rawStatus = (submission.status ?? "NEW").toString();
      // Нормализуем UPPERCASE enum в ключи lower_case, используемые в UI
      const statusKey =
        rawStatus === "NEW"
          ? "new"
          : rawStatus === "IN_PROGRESS"
          ? "in_progress"
          : rawStatus === "PROCESSED"
          ? "processed"
          : "new";

      statusCounts[statusKey as keyof typeof statusCounts]++;

      const createdAt = new Date(submission.createdAt);
      if (createdAt >= weekAgo) weekCount++;
      if (createdAt >= monthAgo) monthCount++;
    });

    return { total, weekCount, monthCount, statusCounts };
  }, [items]);

  const deleteMutation = trpc.admin.deleteSubmission.useMutation();
  const updateStatusMutation = trpc.admin.updateSubmissionStatus.useMutation();

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить эту заявку?")) return;

    setLoadingId(id);
    setStatusMessage(null);

    try {
      await deleteMutation.mutateAsync({ id });
      setItems((current) => current.filter((item) => item.id !== id));
      setStatusMessage("Заявка успешно удалена.");
    } catch {
      setStatusMessage("Ошибка сервера. Повторите позже.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: SubmissionStatus) => {
    setLoadingId(id);
    setStatusMessage(null);

    try {
      await updateStatusMutation.mutateAsync({ id, status });

      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, status } : item))
      );
      setStatusMessage(`Статус заявки обновлён на «${statusLabels[status]}».`);
    } catch (error) {
      console.error("Status update error:", error);
      setStatusMessage("Ошибка сервера. Повторите позже.");
    } finally {
      setLoadingId(null);
    }
  };

  const downloadCsv = () => {
    const rows = [
      [
        "Имя",
        "Email",
        "Телефон",
        "Сообщение",
        "Дата",
        "Статус",
      ],
      ...filteredItems.map((item) => [
        item.name,
        item.email,
        item.phone || "",
        item.message,
        new Date(item.createdAt).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" }),
        statusLabels[item.status ?? "NEW"],
      ]),
    ];

    const csv = "\uFEFF" + rows.map((row) => row.map(formatCsvValue).join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "submissions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)] overflow-hidden">
      <div className="border-b border-slate-200 bg-[#F3F8FF] px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <div className="text-3xl font-semibold text-slate-950">{stats.total}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mt-1">Всего заявок</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-slate-950">{stats.weekCount}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mt-1">За неделю</div>
            </div>
            <div>
              <div className="text-3xl font-semibold text-slate-950">{stats.monthCount}</div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500 mt-1">За месяц</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                Новые: {stats.statusCounts.new}
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                В работе: {stats.statusCounts.in_progress}
              </span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                Обработано: {stats.statusCounts.processed}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={downloadCsv}
            className="self-start rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition-colors"
          >
            Экспорт CSV
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200 px-6 py-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Поиск по имени, email или телефону"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-accent transition-colors"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminStatusFilter)}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 pr-10 text-sm text-slate-950 appearance-none bg-no-repeat bg-[length:1rem] focus:outline-none focus:border-accent transition-colors"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23343A52%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center' }}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-accent transition-colors"
          />
          <input
            type="time"
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F8FAFF] text-slate-500 uppercase text-xs tracking-[0.16em]">
            <tr>
              <th className="px-4 py-4">Имя</th>
              <th className="px-4 py-4">Email</th>
              <th className="px-4 py-4">Телефон</th>
              <th className="px-4 py-4">Статус</th>
              <th className="px-4 py-4">Дата</th>
              <th className="px-4 py-4">Действие</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-ink-muted">
                  Заявок не найдено.
                </td>
              </tr>
            ) : (
              filteredItems.map((submission) => {
                const submissionStatus: SubmissionStatus = submission.status ?? "NEW";

                return (
                  <tr key={submission.id} className="border-t border-[#F0EEE9]">
                    <td className="px-4 py-4 align-top text-slate-950 font-medium">{submission.name}</td>
                    <td className="px-4 py-4 align-top text-slate-500">{submission.email}</td>
                    <td className="px-4 py-4 align-top text-slate-500">{submission.phone || "—"}</td>
                    <td className="px-4 py-4 align-top">
                      <select
                        value={submissionStatus}
                        onChange={(e) => handleUpdateStatus(submission.id, e.target.value as SubmissionStatus)}
                        disabled={loadingId === submission.id}
                        className="rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-3 py-2 pr-10 text-sm text-slate-950 appearance-none bg-no-repeat bg-[length:1rem] focus:outline-none focus:border-accent transition-colors"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke=%27%23343A52%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M6 9l6 6 6-6%27/%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center' }}
                      >
                        {statusOptions
                          .filter((option) => option.value !== "all")
                          .map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-500">
                      {new Date(submission.createdAt).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-4 align-top space-y-2">
                      <button
                        type="button"
                        disabled={loadingId === submission.id}
                        onClick={() => handleDelete(submission.id)}
                        className="w-full rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60"
                      >
                        {loadingId === submission.id ? "Сохранение..." : "Удалить"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {statusMessage && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
          {statusMessage}
        </div>
      )}
    </div>
  );
}
