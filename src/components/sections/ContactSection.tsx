"use client";

import { useEffect, useState, type FormEvent } from "react";
import Toast from "@/components/ui/Toast";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    let normalized = digits;
    if (normalized[0] === "8") normalized = "7" + normalized.slice(1);
    if (normalized[0] !== "7") normalized = "7" + normalized;

    const part1 = normalized.slice(1, 4);
    const part2 = normalized.slice(4, 7);
    const part3 = normalized.slice(7, 9);
    const part4 = normalized.slice(9, 11);

    let formatted = "+7";
    if (part1.length) formatted += " (" + part1;
    if (part1.length === 3) formatted += ")";
    if (part2.length) formatted += " " + part2;
    if (part3.length) formatted += "-" + part3;
    if (part4.length) formatted += "-" + part4;

    return formatted;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Не удалось отправить заявку. Попробуйте позже.");
        return;
      }

      setSent(true);
      setForm({ name: "", company: "", phone: "", email: "", service: "", message: "" });
      setToast({ message: "Ваша заявка успешно отправлена!", type: "success" });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError("Ошибка сети. Проверьте подключение и повторите попытку.");
      setToast({ message: "Не удалось отправить заявку. Попробуйте позже.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <section id="contact" className="py-20 px-6 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-xl">
            <span className="text-xs tracking-[0.24em] uppercase text-accent font-semibold mb-4 inline-block">
              Свяжитесь с нами
            </span>
            <h2 className="font-display text-[clamp(2.8rem,5vw,4.2rem)] leading-tight text-slate-950 mb-6">
              Опишите задачу – ответим в течение рабочего дня
            </h2>
            <p className="text-lg leading-8 text-slate-600 mb-10">
              Оставьте заявку, и мы подготовим расчёт, поможем выбрать схему размещения и предложим оптимальный формат работ.
            </p>

            <div className="grid gap-4">
              {[
                { title: "Офис", description: "Омск, ул. Ленина, д. 123" },
                { title: "Телефон", description: "+7 (3812) 12-34-56" },
                { title: "Почта", description: "info@sibservistorg.ru" },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.75rem] bg-white p-6 shadow-[0_22px_54px_-36px_rgba(15,23,42,0.12)] border border-slate-200">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold mb-2">
                    {item.title}
                  </div>
                  <div className="text-sm font-semibold text-slate-950">{item.description}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_22px_54px_-36px_rgba(15,23,42,0.12)]">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-3">Мессенджеры</div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://t.me/sibservistorg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-slate-200 bg-[#F8FAFF] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-accent hover:text-accent"
                >
                  Telegram
                </a>
                <a
                  href="https://wa.me/73812123456"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-w-[140px] items-center justify-center rounded-full border border-slate-200 bg-[#F8FAFF] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-accent hover:text-accent"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_40px_120px_-80px_rgba(28,110,255,0.22)] lg:mt-[320px]">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[420px] text-center">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-950 mb-3">Заявка отправлена!</h3>
                <p className="text-sm leading-7 text-slate-600">Мы свяжемся с вами в течение рабочего дня, чтобы обсудить детали и подготовить предложение.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Ваше имя</span>
                    <input
                      type="text"
                      placeholder="Иван Иванов"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Компания</span>
                    <input
                      type="text"
                      placeholder="ООО «Техно»"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
                    />
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Телефон</span>
                    <input
                      type="tel"
                      placeholder="+7 (3812) 12-34-56"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-700">
                    <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">E-mail</span>
                    <input
                      type="email"
                      placeholder="info@sibservistorg.ru"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Услуга</span>
                  <select
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent"
                  >
                    <option value="">Выберите направление</option>
                    <option value="hosting">Хостинг и VDS</option>
                    <option value="data">Обработка данных</option>
                    <option value="storage">Облачное хранение</option>
                    <option value="admin">Администрирование</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm text-slate-700">
                  <span className="block text-xs uppercase tracking-[0.18em] text-slate-400">Сообщение</span>
                  <textarea
                    rows={5}
                    placeholder="Кратко опишите задачу, текущую инфраструктуру и желаемый результат"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent resize-none"
                  />
                </label>

                {error && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_-32px_rgba(27,101,255,0.45)] transition hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Отправка…" : "Оставить заявку"}
                </button>
              </form>
            )}
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

