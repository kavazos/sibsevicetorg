import Link from "next/link";

const footerLinks = {
  services: [
    { label: "Хостинг и VDS", href: "#services" },
    { label: "Обработка данных", href: "#services" },
    { label: "Облачное хранение", href: "#services" },
    { label: "Администрирование", href: "#services" },
  ],
  company: [
    { label: "О компании", href: "#about" },
    { label: "Как мы работаем", href: "#how" },
    { label: "Контакты", href: "#contact" },
  ],
  legal: [
    { label: "Договор-оферта", href: "/offer" },
    { label: "Политика конфиденциальности", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#071026] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 xl:grid-cols-4">
          <div className="space-y-5">
            <div className="text-2xl font-semibold">Сибсервисторг</div>
            <p className="max-w-sm text-sm text-slate-300 leading-relaxed">
              Надёжная обработка данных и хостинг для бизнеса в Омске с 2006 года.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold mb-5">Услуги</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {footerLinks.services.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold mb-5">Компания</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-[0.24em] text-slate-400 font-semibold mb-5">Контакты</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div>Омск, ул. Ленина, д. 123</div>
              <a href="tel:+73812123456" className="block hover:text-white transition-colors duration-200">
                +7 (3812) 12-34-56
              </a>
              <a href="mailto:info@sibservistorg.ru" className="block hover:text-white transition-colors duration-200">
                info@sibservistorg.ru
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-sm text-slate-500 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ООО «Сибсервисторг». Все права защищены.</p>
          <p>ИНН 5501234567 · ОГРН 1065543123456</p>
        </div>
      </div>
    </footer>
  );
}
