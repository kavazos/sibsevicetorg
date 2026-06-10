import AdminSubmissionsTable from "@/components/admin/AdminSubmissionsTable";
import { LogoutButton } from "@/components/admin/LogoutButton";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ContactSubmission } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Проверяем наличие session cookie
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin-session");

  // Если нет сессии, перенаправляем на страницу входа
  if (!sessionToken) {
    console.log("[ADMIN PAGE] No session found, redirecting to login");
    redirect("/admin/login");
  }

  let submissions: ContactSubmission[] = [];
  let dbError = false;
  try {
    submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[ADMIN PAGE] Error fetching submissions:", err);
    dbError = true;
    submissions = [];
  }

  // Устанавливаем статус "NEW" для старых заявок без статуса
  const submissionsWithStatus = submissions.map((sub) => ({
    ...sub,
    status: sub.status || "NEW",
  }));

  return (
    <main className="min-h-screen bg-[#F8FAFF] px-6 py-20 text-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <span className="text-xs tracking-[0.24em] uppercase text-slate-500 font-semibold block mb-4">
              Админ-панель
            </span>
            <h1 className="font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-tight text-slate-950 mb-4">
              Заявки от клиентов
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              Здесь отображаются все обращения, отправленные через форму контактов. Вы можете удалить устаревшие или тестовые записи.
            </p>
            {dbError && (
              <div className="mt-6 rounded-[1.75rem] border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-yellow-700">
                Внимание: не удалось подключиться к базе данных. Показаны временные данные.
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <LogoutButton />
          </div>
        </div>

        <AdminSubmissionsTable submissions={submissionsWithStatus} />
      </div>
    </main>
  );
}


