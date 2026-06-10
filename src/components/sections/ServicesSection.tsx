import Link from "next/link";

const services = [
  {
    num: "1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="6" rx="2" />
        <rect x="3" y="14" width="18" height="6" rx="2" />
      </svg>
    ),
    title: "Размещение информации",
    subtitle: "Хостинг · VDS · VPS",
    desc: "Мощности под сайты, корпоративную почту и веб-приложения. Поддержка LAMP/LEMP, Docker, Node и Python.",
    bullets: ["Аренда выделенных и виртуальных серверов", "Размещение 1С, CRM и почтовых сервисов", "Бесплатный SSL и DDoS-фильтр"],
  },
  {
    num: "2",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </svg>
    ),
    title: "Обработка и структурирование данных",
    subtitle: "Парсинг · ETL · Очистка",
    desc: "Сбор и нормализация данных из любых источников, подготовка чистых датасетов для аналитики и CRM.",
    bullets: ["Парсинг сайтов и API", "Очистка, дедупликация, валидация", "Выгрузка в БД, Excel, BI-системы"],
  },
  {
    num: "3",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12v5H6z" />
        <path d="M6 16h12v5H6z" />
        <path d="M6 10h12v4H6z" />
      </svg>
    ),
    title: "Облачное хранение",
    subtitle: "Бэкапы · Архивы",
    desc: "Безопасное резервное копирование и долговременное хранение документации. Шифруем и сохраняем резервные копии по регламенту.",
    bullets: ["Ежедневные инкрементальные бэкапы", "Шифрование AES-256", "Тестовое восстановление по запросу"],
  },
  {
    num: "4",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 L20 8 L20 16 L12 21 L4 16 L4 8 Z" />
      </svg>
    ),
    title: "Администрирование",
    subtitle: "Серверы · СУБД · DevOps",
    desc: "Сопровождение серверов и баз данных: настройка, мониторинг, оптимизация и реакция на инциденты.",
    bullets: ["Linux/Windows Server", "PostgreSQL, MySQL, MSSQL", "Мониторинг 24/7, регламентные работы"],
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-6 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500 font-medium block mb-4">
              Наши услуги
            </span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.8rem)] leading-tight text-slate-950">
              Понятная инфраструктура без лишних слов
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            Мы упаковали свои компетенции в четыре направления, понятные владельцу бизнеса и техническому директору одновременно.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.num}
              href="#contact"
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_32px_90px_-70px_rgba(28,110,255,0.18)] transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs tracking-[0.24em] uppercase text-slate-400 font-semibold">{service.num}</span>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-950">{service.title}</h3>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-accent font-semibold">{service.subtitle}</p>
                </div>
                <div className="text-slate-400">{service.icon}</div>
              </div>

              <p className="text-sm leading-7 text-slate-600 mb-8">{service.desc}</p>

              <div className="space-y-3 mb-8">
                {service.bullets.map((bullet) => (
                  <div key={bullet} className="rounded-2xl bg-[#F3F8FF] px-4 py-3 text-sm text-slate-600">
                    {bullet}
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                <span>Запросить расчёт</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
