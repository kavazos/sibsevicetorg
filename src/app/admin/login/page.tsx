"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const mutation = trpc.admin.login.useMutation();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await mutation.mutateAsync({ username, password });
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Неверный логин или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF] flex items-center justify-center px-6 py-20 text-slate-950">
      <div className="w-full max-w-md">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.12)]">
          <span className="text-xs tracking-[0.24em] uppercase text-slate-500 font-semibold mb-4 inline-block">
            Админ-панель
          </span>
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-slate-950 mb-3">
            Вход в админ-панель
          </h1>
          <p className="text-sm text-slate-600 mb-8">Введите учетные данные администратора</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Логин
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-accent"
                placeholder="Введите логин"
                autoComplete="username"
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
                disabled={isLoading}
                className="w-full rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-accent"
                placeholder="Введите пароль"
                autoComplete="current-password"
              />
            </div>

            {error && <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="w-full rounded-full bg-accent px-4 py-4 text-sm font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Входим..." : "Войти"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
