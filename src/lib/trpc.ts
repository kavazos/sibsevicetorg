import superjson from "superjson";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@/server/routers";

export const trpc = createTRPCReact<AppRouter>();

export function getTrpcClient() {
  return trpc.createClient({
    links: [
      // cast to any to avoid mismatched transformer typing between @trpc versions
      httpBatchLink(({
        url: "/api/trpc",
        transformer: superjson,
        async fetch(input, init) {
          const response = await fetch(input, {
            ...init,
            credentials: "include",
          });
          return response;
        },
      } as any)),
    ],
    transformer: superjson,
  });
}
