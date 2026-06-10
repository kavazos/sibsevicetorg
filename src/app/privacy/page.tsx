import Link from "next/link";

export const metadata = {
  title: "Политика конфиденциальности — Сибсервисторг",
  description: "Политика конфиденциальности компании Сибсервисторг. Как мы обрабатываем и защищаем персональные данные.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream text-ink px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-xs tracking-[0.2em] uppercase text-ink-faint font-medium block mb-4">
            Документы
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight mb-4">
            Политика конфиденциальности
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Мы ценим вашу приватность. В этом документе описано, какие данные мы собираем, как храним и кому можем передавать информацию.
          </p>
        </div>

        <div className="space-y-6 rounded-sm border border-[#DEDAD5] bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold mb-2">Сбор данных</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Мы собираем только необходимые данные для обработки заявки и связи с клиентом: имя, телефон, почту и сообщение.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Использование информации</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Данные используются исключительно для обратной связи, подготовки коммерческого предложения и согласования сотрудничества.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Защита данных</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Мы применяем технические и организационные меры, чтобы защитить информацию от несанкционированного доступа.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-ink px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
          >
            Вернуться на сайт
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-sm bg-ink text-cream px-5 py-3 text-sm font-medium uppercase tracking-wide hover:bg-[#111] transition-colors"
          >
            Написать нам
          </Link>
        </div>
      </div>
    </main>
  );
}
