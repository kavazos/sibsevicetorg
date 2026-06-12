"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const logoutMutation = trpc.admin.logout.useMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutMutation.mutateAsync();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_-20px_rgba(28,110,255,0.5)] hover:bg-accent-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      title="Выйти из админ-панели"
    >
      <LogOut size={16} />
      {isLoading ? "Выходим..." : "Выход"}
    </button>
  );
}
