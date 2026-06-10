"use client";

import { useState } from "react";

const steps = [
  {
    num: "01",
    title: "Заявка",
    label: "Шаг 1 из 4",
    desc: "Вы оставляете техническое задание или короткое описание задачи. Мы фиксируем требования и сроки.",
    points: ["Бриф или ТЗ", "Подписание NDA при необходимости"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 7h12" />
        <path d="M6 11h12" />
        <path d="M6 15h8" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Расчёт",
    label: "Шаг 2 из 4",
    desc: "Подбираем оптимальные мощности, объём хранения и скорость обработки данных под ваш профиль нагрузки.",
    points: ["Архитектурная схема", "Коммерческое предложение"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h10" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Интеграция",
    label: "Шаг 3 из 4",
    desc: "Переносим данные, настраиваем доступ, разворачиваем инфраструктуру и проверяем под нагрузкой.",
    points: ["Миграция без простоев", "Тестовые запуски и приёмка"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20h18" />
        <path d="M6 16l6-8 6 8" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Поддержка",
    label: "Шаг 4 из 4",
    desc: "Обеспечиваем стабильную работу 24/7: мониторинг, регламентные работы и оперативная реакция.",
    points: ["SLA по реагированию", "Прозрачные ежемесячные отчёты"],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16" />
        <path d="M8 12l4-4 4 4" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
];

export default function HowSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex];

  return (
    <section id="how" className="py-20 px-6 bg-[#F8FAFF]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_0.95fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs uppercase tracking-[0.24em] font-semibold text-accent">
              Схема работы
            </span>
            <h2 className="mt-6 font-display text-[clamp(2rem,5vw,4rem)] leading-tight text-slate-950">
              Короткий путь от запроса до стабильной работы
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Прозрачные этапы, фиксация на каждом шаге, никакого «потом доделаем».
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <div className="space-y-4">
            {steps.map((step, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`group flex w-full items-center justify-between gap-6 rounded-[1.75rem] border p-6 transition ${
                    active
                      ? "border-transparent bg-accent text-white shadow-[0_20px_80px_-50px_rgba(28,110,255,0.35)]"
                      : "border-slate-200 bg-white text-slate-900 hover:border-accent/40 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold ${
                      active ? "bg-white text-accent" : "bg-slate-100 text-accent"
                    }`}>
                      {step.num}
                    </div>
                    <div>
                      <div className={`text-base font-semibold ${active ? "text-white" : "text-slate-950"}`}>{step.title}</div>
                      <div className={`text-xs uppercase tracking-[0.18em] ${active ? "text-slate-200" : "text-slate-500"}`}>
                        {step.label}
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${
                    active ? "border-white bg-white/15 text-white" : "border-slate-200 text-slate-400"
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_36px_90px_-60px_rgba(15,23,42,0.2)]">
            <div
              className="grid gap-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8"
              style={{
                backgroundImage:
                  "linear-gradient(0deg, transparent 24%, rgba(148,177,255,0.08) 24%, rgba(148,177,255,0.08) 25%, transparent 25%, transparent 74%, rgba(148,177,255,0.08) 74%, rgba(148,177,255,0.08) 75%, transparent 75%), linear-gradient(90deg, transparent 24%, rgba(148,177,255,0.08) 24%, rgba(148,177,255,0.08) 25%, transparent 25%, transparent 74%, rgba(148,177,255,0.08) 74%, rgba(148,177,255,0.08) 75%, transparent 75%)",
              }}
            >
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-accent text-white">
                {activeStep.icon}
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-medium text-slate-500">Этап {activeStep.num}</span>
                <h3 className="mt-4 text-3xl font-semibold text-slate-950">{activeStep.title}</h3>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{activeStep.desc}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeStep.points.map((point) => (
                  <div key={point} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
