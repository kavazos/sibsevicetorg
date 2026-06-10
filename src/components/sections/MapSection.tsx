import Link from "next/link";

export default function MapSection() {
  return (
    <section id="location" className="py-16 px-6 bg-[#F8F5EF]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <span className="text-xs tracking-[0.2em] uppercase text-ink-faint font-medium block mb-4">
            Как нас найти
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight text-ink">
            Наш офис в Омске и удобная карта проезда
          </h2>
          <p className="max-w-2xl mx-auto text-ink-muted text-sm leading-relaxed mt-4">
            Посетите нас лично или свяжитесь до приезда — мы подготовим все для быстрого старта вашего проекта.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">
          <div className="overflow-hidden rounded-sm border border-[#DEDAD5] shadow-sm">
            <iframe
              src="https://www.google.com/maps?q=г+омск+ул+учебная+д83&output=embed"
              title="Карта адреса г. Омск, ул. Учебная, д. 83"
              className="w-full min-h-[420px] border-0"
              loading="lazy"
            ></iframe>
          </div>

          <div className="rounded-sm border border-[#DEDAD5] bg-cream p-8 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">
                  Адрес
                </div>
                <p className="text-ink font-semibold">г. Омск, ул. Учебная, д. 83</p>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">
                  Контакты
                </div>
                <div className="space-y-2 text-sm">
                  <a href="tel:+73812123456" className="block text-ink font-semibold hover:text-accent transition-colors">
                    +7 (3812) 12-34-56
                  </a>
                  <a href="mailto:info@sibservistorg.ru" className="block text-ink font-semibold hover:text-accent transition-colors">
                    info@sibservistorg.ru
                  </a>
                </div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-2">
                  Время работы
                </div>
                <p className="text-ink text-sm">Пн–Пт, 9:00–18:00</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-sm bg-ink text-cream px-5 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-[#111] transition-colors"
              >
                Написать нам
              </Link>
              <a
                href="https://www.google.com/maps/search/г+омск+ул+учебная+д83"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-sm border border-ink px-5 py-3 text-sm font-medium text-ink hover:bg-ink/5 transition-colors"
              >
                Открыть в Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
