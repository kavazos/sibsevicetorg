"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";

export default function ConfirmationHandler() {
  const searchParams = useSearchParams();
  const confirmedToken = searchParams.get("confirmed_token");
  const confirmMutation = trpc.contact.confirm.useMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (confirmedToken && !isProcessing) {
      setIsProcessing(true);
      confirmMutation
        .mutateAsync({ token: confirmedToken })
        .then(() => {
          setTimeout(() => {
            window.location.href = "/?confirmed=1";
          }, 1500);
        })
        .catch(() => {
          setIsProcessing(false);
        });
    }
  }, [confirmedToken, confirmMutation, isProcessing]);

  if (!confirmedToken || !isProcessing) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 text-center">
        {confirmMutation.isPending && <p className="text-slate-900 font-medium">Подтверждаем ваш email...</p>}
        {confirmMutation.isSuccess && <p className="text-green-600 font-medium">Email успешно подтвержден!</p>}
        {confirmMutation.isError && <p className="text-red-600 font-medium">Ошибка при подтверждении email</p>}
      </div>
    </div>
  );
}

