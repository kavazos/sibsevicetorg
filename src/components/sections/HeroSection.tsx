import Link from "next/link";

const stats = [
  { value: "20+", label: "лет на рынке", meta: "с 2006 года" },
  { value: "99,9%", label: "гарантированная доступность" },
  { value: "500+", label: "клиентов в Омске" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24 pb-20 px-6 bg-[#F8FAFF]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(28,110,255,0.18),transparent_24%),radial-gradient(circle_at_top_right,rgba(82,142,255,0.12),transparent_18%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12">
        <div className="relative z-10">
          <span className="text-xs tracking-[0.24em] uppercase text-slate-500 font-medium">
            ООО «Сибсервисторг»
          </span>
          <h1 className="mt-6 max-w-3xl text-[clamp(2.8rem,6vw,5rem)] font-display leading-[0.96] text-slate-950">
            Надёжная обработка данных и хостинг для вашего бизнеса в Омске
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600">
            ООО «Сибсервисторг» – размещение информации, аренда серверов, парсинг и оптимизация баз данных. Локальные мощности, прямая связь со специалистами, никакой бюрократии.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(28,110,255,0.45)] transition-colors duration-200 hover:bg-accent-dark"
            >
              Обсудить проект
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-slate-900 transition-colors duration-200 hover:border-accent hover:text-accent"
            >
              Наши услуги
            </Link>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {stats.map((item, index) => (
              <div key={index} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)]">
                <div className="text-3xl font-semibold text-slate-950">{item.value}</div>
                <div className="mt-2 text-sm font-medium text-slate-700">{item.label}</div>
                {item.meta ? <div className="mt-3 text-xs text-slate-500">{item.meta}</div> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_40px_120px_-70px_rgba(28,110,255,0.3)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(28,110,255,0.06),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(92,156,255,0.08),transparent_35%)]" />
            <div className="relative grid gap-6">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-accent font-semibold">Локация серверов</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">Омск, РФ</p>
                    <p className="mt-2 text-sm text-slate-600">Ping &lt; 5 ms по городу</p>
                  </div>
                  <div className="rounded-3xl bg-accent px-4 py-3 text-sm font-semibold text-white">Локально</div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-950">Сертификаты</p>
                  <p className="mt-2 text-sm text-slate-600">ФЗ-152 · NDA</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-950">Поддержка</p>
                  <p className="mt-2 text-sm text-slate-600">Местный контакт и помощь по инфраструктуре</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
