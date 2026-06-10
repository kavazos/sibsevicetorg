import Link from "next/link";

const trustItems = [
  {
    title: "Типовая оферта",
    description: "Договор на услуги хостинга и обработки данных, понятные условия сотрудничества.",
  },
  {
    title: "Соглашение о NDA",
    description: "Подписываем перед началом работы с конфиденциальными данными.",
  },
  {
    title: "Соответствие 152-ФЗ",
    description: "Регламент обработки персональных данных и защита информации по закону.",
  },
];

export default function TrustSection() {
  return (
    <section id="trust" className="py-20 px-6 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-xs tracking-[0.24em] uppercase text-accent font-semibold mb-4 inline-block">
              Надёжность и право
            </span>
            <h2 className="font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-tight text-slate-950 mb-6">
              Прозрачная компания для прозрачной работы
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-600 mb-10">
              Мы юридическое лицо с реальной историей. Все услуги оформляются договором,
              а работа с данными — отдельным соглашением с конфиденциальностью.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {trustItems.slice(0, 2).map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.16)]">
                  <h3 className="text-lg font-semibold text-slate-950 mb-3">{item.title}</h3>
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-48px_rgba(15,23,42,0.16)]">
              <h3 className="text-lg font-semibold text-slate-950 mb-3">{trustItems[2].title}</h3>
              <p className="text-sm leading-7 text-slate-600">{trustItems[2].description}</p>
            </div>
            <div className="rounded-[2rem] bg-accent text-white p-8 shadow-[0_40px_100px_-70px_rgba(28,110,255,0.35)]">
              <p className="text-sm uppercase tracking-[0.24em] text-accent/20 font-semibold mb-4">Уже работаете с нами?</p>
              <h3 className="text-2xl font-semibold mb-4">Подпишем NDA и расширим сотрудничество за 1 рабочий день</h3>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-accent shadow-lg shadow-white/10 hover:bg-slate-100 transition-colors duration-200"
              >
                Запросить шаблон
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
