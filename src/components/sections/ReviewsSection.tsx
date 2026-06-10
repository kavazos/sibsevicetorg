export default function ReviewsSection() {
  const reviews = [
    {
      name: "ООО Премьера",
      text: "Быстро настроили сервер и помогли с переносом данных. Рекомендую.",
    },
    {
      name: "ИП Иванов",
      text: "Отличная поддержка и адекватные цены на VDS.",
    },
    {
      name: "ООО ОмскСайдингИнвест",
      text: "Профессиональная команда, всё работает стабильно.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h2 className="font-display text-2xl mb-6">Отзывы клиентов</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-md border border-[#EFECE8] bg-white p-6">
            <div className="text-sm text-ink-muted mb-2">{r.name}</div>
            <div className="text-ink">{r.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
