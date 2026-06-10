import Link from "next/link";

export const metadata = {
  title: "Договор-оферта — Сибсервисторг",
  description: "Договор оферты компании Сибсервисторг. Условия сотрудничества по размещению информации и хостингу.",
};

export default function OfferPage() {
  return (
    <main className="min-h-screen bg-cream text-ink px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <span className="text-xs tracking-[0.2em] uppercase text-ink-faint font-medium block mb-4">
            Документы
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] leading-tight mb-4">
            Договор-оферта
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Здесь вы найдёте прозрачные условия сотрудничества с ООО «Сибсервисторг». Договор-оферта описывает права, обязанности и порядок оплаты услуг.
          </p>
        </div>

        <div className="space-y-6 rounded-sm border border-[#DEDAD5] bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold mb-2">Общие положения</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              ООО «Сибсервисторг» предлагает услуги корпоративного хостинга, аренды серверов и обработки данных на основании настоящей оферты. Заказ считается принятым после подписания акта оказанных услуг или оплаты.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Услуги и оплата</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Стоимость услуг согласуется индивидуально. Авансовый платёж, ежемесячная абонентская плата и дополнительные работы оформляются договором, соответствующим условиям оферты.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Конфиденциальность</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              Сибсервисторг гарантирует сохранность данных, соблюдение законодательства РФ и передачу информации третьим лицам только с согласия клиента.
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
