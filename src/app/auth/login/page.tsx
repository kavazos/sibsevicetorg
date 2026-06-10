"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Ошибка входа");
      return;
    }

    router.push("/account");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6 py-20 text-slate-950">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)]">
          <span className="text-xs tracking-[0.24em] uppercase text-slate-500 font-semibold mb-4 inline-block">
            Личный кабинет
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-slate-950 mb-3">
            Вход в аккаунт
          </h1>
          <p className="text-sm text-slate-600 mb-8">
            Введите ваш email и пароль, чтобы просмотреть статус заявок.
          </p>

          <form onSubmit={submit} className="space-y-6">
            {error && (
              <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-accent"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-accent"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-accent px-4 py-4 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Войти
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500 mb-3">Еще нет аккаунта?</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-950 hover:bg-slate-50 transition"
            >
              Зарегистрироваться
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
