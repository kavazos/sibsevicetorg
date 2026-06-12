"use client";

import { useState, FormEvent } from "react";

import { trpc } from "@/lib/trpc";

export default function ProfileForm({ user }: { user: { id: string; name?: string; email: string } }) {
  const [name, setName] = useState(user.name || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const updateMutation = trpc.auth.update.useMutation();
  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      await updateMutation.mutateAsync({ name });
      setMsg('Сохранено');
    } catch (err: any) {
      setMsg(err.message || 'Ошибка');
    } finally {
      setSaving(false);
    }
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [changing, setChanging] = useState(false);

  const changePasswordMutation = trpc.auth.changePassword.useMutation();
  const changePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChanging(true);
    setPwMsg(null);
    try {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
      setPwMsg('Пароль изменён');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPwMsg(err.message || 'Ошибка');
    } finally {
      setChanging(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={save} className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
        <div>
          <div className="text-sm font-semibold text-slate-950">Редактировать имя</div>
          <p className="mt-2 text-sm text-slate-600">Измените отображаемое имя, которое будет видно в личном кабинете.</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-600">Имя</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent" />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button disabled={saving} className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(28,110,255,0.45)] transition-colors duration-200 hover:bg-accent-dark disabled:opacity-60">Сохранить</button>
          {msg && <div className="text-sm text-slate-600">{msg}</div>}
        </div>
      </form>

      <form onSubmit={changePassword} className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
        <div>
          <div className="text-sm font-semibold text-slate-950">Сменить пароль</div>
          <p className="mt-2 text-sm text-slate-600">Обновите пароль для безопасности аккаунта.</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Старый пароль</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Новый пароль</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-accent" />
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button disabled={changing} className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_-30px_rgba(28,110,255,0.45)] transition-colors duration-200 hover:bg-accent-dark disabled:opacity-60">Сменить пароль</button>
          {pwMsg && <div className="text-sm text-slate-600">{pwMsg}</div>}
        </div>
      </form>
    </div>
  )
}
