import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";

export type CreateContextOptions = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export const createContext = ({ req, res }: CreateContextOptions) => {
  return { req, res, prisma };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  const cookie = ctx.req.headers.cookie || "";
  const match = cookie.match(/user-session=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;
  const userId = verifySessionToken(token);
  if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({ ctx: { ...ctx, userId } });
});

export const protectedProcedure = t.procedure.use(isAuthed);

const isAdmin = t.middleware(({ ctx, next }) => {
  const cookie = ctx.req.headers.cookie || "";
  const match = cookie.match(/admin-session=([^;]+)/);
  if (!match) throw new TRPCError({ code: "UNAUTHORIZED" });
  return next();
});

export const adminProcedure = t.procedure.use(isAdmin);

export type AppRouter = typeof router;
