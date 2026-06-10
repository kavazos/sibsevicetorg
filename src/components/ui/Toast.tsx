"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose?: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), 4500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        "fixed bottom-6 left-1/2 z-50 w-[min(92vw,440px)] -translate-x-1/2 rounded-2xl border p-4 shadow-2xl shadow-black/10 backdrop-blur-sm transition-all duration-300"
      }
      style={{
        backgroundColor: type === "success" ? "rgba(236, 254, 235, 0.98)" : "rgba(254, 226, 226, 0.98)",
        borderColor: type === "success" ? "#A7F3D0" : "#FECACA",
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-3 w-3 rounded-full" style={{ backgroundColor: type === "success" ? "#22C55E" : "#EF4444" }} />
        <div>
          <p className="text-sm font-medium text-pearl">{type === "success" ? "Успех" : "Ошибка"}</p>
          <p className="text-sm text-tan leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}


