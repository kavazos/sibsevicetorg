import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "@/server/routers";
import { createContext } from "@/server/trpc";
import type { NextApiRequest, NextApiResponse } from "next";
import superjson from "superjson";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Preprocess request body: accept single-call batch-shaped bodies like {"0": {...}}
  try {
    if (process.env.NODE_ENV === "development") {
      try {
        console.log("[trpc handler] incoming body (before):", JSON.stringify(req.body));
      } catch (e) {
        console.log("[trpc handler] incoming body (before): (unserializable)");
      }
    }
    const isPost = req.method === "POST";
    const hasBatchQuery = req.query?.batch === "1" || req.url?.includes("?batch=1");
    if (isPost && !hasBatchQuery && req.body && typeof req.body === "object") {
      // If body looks like a single-entry batch (key '0'), unwrap it
      if (Object.prototype.hasOwnProperty.call(req.body, "0") && Object.keys(req.body).length === 1) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        req.body = req.body["0"];
        if (process.env.NODE_ENV === "development") {
          try {
            console.log("[trpc handler] unwrapped body:", JSON.stringify(req.body));
          } catch (e) {
            console.log("[trpc handler] unwrapped body: (unserializable)");
          }
        }
      }
    }

  } catch (e) {
    // ignore preprocessing errors and let tRPC handle malformed input
  }

  return createNextApiHandler({
    router: appRouter,
    createContext: () => createContext({ req, res }),
    // middleware runs before the internal node-http handler converts the incoming message to a Request
    middleware: async (req, res, next) => {
      try {
        if (req.method !== "GET" && !Object.prototype.hasOwnProperty.call(req, "body")) {
          const chunks: Buffer[] = [];
          for await (const chunk of req as any) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          const buf = Buffer.concat(chunks);
          const text = buf.toString();
          if (process.env.NODE_ENV === "development") console.log("[trpc middleware] raw body:", text);
          try {
            // try parse JSON
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            req.body = text ? JSON.parse(text) : undefined;
          } catch (e) {
            // leave as raw text
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            req.body = text;
          }
        }
      } catch (e) {
        // ignore
      }
      return next();
    },
    responseMeta({ errors, data, ctx, paths, type }) {
      // Handle response metadata if needed
      const allOk = !errors.length;
      const isQuery = type === "query";

      if (allOk && isQuery) {
        // cache full requests for 1 second
        // never cache mutations
        return {
          headers: {
            "cache-control": "public, max-age=1, s-maxage=1",
          },
        };
      }
      return {};
    },
    onError({ error, path, input }) {
      if (process.env.NODE_ENV === "development") {
        console.error("tRPC error on path:", path);
        console.error("input:", input);
        console.error("error:", error);
      }
    },
  })(req, res);
}
