const advantages = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Локальный подход",
    desc: "Серверы и инженеры расположены в Омске – низкий пинг, быстрая реакция и личный контроль проекта.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Опыт и стабильность",
    desc: "Работаем с 2006 года. Проверенные решения, гарантии и ответственность по договору.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: "Персональный менеджмент",
    desc: "Прямой контакт с руководителем и инженером без колл-центра и внутренних заявок.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Безопасность данных",
    desc: "Конфиденциальность по умолчанию, NDA и защита персональных данных согласно ФЗ-152.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-2xl">
            <span className="text-xs tracking-[0.2em] uppercase text-slate-500 font-medium mb-4 inline-block">
              Почему мы
            </span>
            <h2 className="font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-tight text-slate-950 mb-6">
              Малая команда Большой опыт
            </h2>
            <p className="text-lg leading-8 text-slate-600 mb-10">
              Мы – компактная команда, которая лично отвечает за инфраструктуру клиента.
              Не колл-центр, а инженеры, которые знают вашу систему по имени.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {advantages.map((item, index) => (
                <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-52px_rgba(15,23,42,0.16)]">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950 mb-2">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_38px_110px_-72px_rgba(28,110,255,0.16)] h-300 lg:mt-[375px]">
            <div className="grid gap-6">
              <div className="rounded-[1.75rem] bg-[#F3F8FF] p-8">
                <div className="text-xs uppercase tracking-[0.24em] text-accent font-semibold mb-3">
                  Компания
                </div>
                <div className="text-4xl font-semibold text-slate-950">20+</div>
                <div className="mt-3 text-sm text-slate-600">лет на рынке</div>
              </div>
              <div className="rounded-[1.75rem] p-8 border border-slate-200">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold mb-3">
                  Регион
                </div>
                <div className="text-2xl font-semibold text-slate-950">Омск</div>
                <div className="mt-3 text-sm text-slate-600">Решения для локального бизнеса</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
