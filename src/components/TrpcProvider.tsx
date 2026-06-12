"use client";

import React, { useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, getTrpcClient } from "@/lib/trpc";

export default function TrpcProvider({ children }: { children: React.ReactNode }) {
  const queryClientRef = useRef<QueryClient>();
  const trpcClientRef = useRef<any>();

  if (!queryClientRef.current) queryClientRef.current = new QueryClient();
  if (!trpcClientRef.current) trpcClientRef.current = getTrpcClient();

  return (
    <trpc.Provider client={trpcClientRef.current} queryClient={queryClientRef.current}>
      <QueryClientProvider client={queryClientRef.current}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
