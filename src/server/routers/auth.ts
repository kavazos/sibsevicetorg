import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { comparePassword, createSessionToken, cookieHeaderOptions, hashPassword, verifySessionToken } from "@/lib/auth";
import { loginSchema, registerSchema, updateProfileSchema, changePasswordSchema } from "../schemas";

export const authRouter = router({
  login: publicProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const { email, password } = input;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Неверные учётные данные");

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error("Неверные учётные данные");

    const token = createSessionToken(user.id);
    try {
      ctx.res.setHeader("Set-Cookie", `user-session=${encodeURIComponent(token)}; ${cookieHeaderOptions()}`);
    } catch {}

    return { success: true, id: user.id };
  }),

  register: publicProcedure.input(registerSchema).mutation(async ({ input, ctx }) => {
    const { email, password, name } = input;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Пользователь с таким email уже существует");

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash, name } });

    const token = createSessionToken(user.id);
    try {
      ctx.res.setHeader("Set-Cookie", `user-session=${encodeURIComponent(token)}; ${cookieHeaderOptions()}`);
    } catch {}

    return { success: true, id: user.id };
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      ctx.res.setHeader("Set-Cookie", `user-session=; ${cookieHeaderOptions(0)}`);
    } catch {}
    return { success: true };
  }),

  me: publicProcedure.query(async ({ ctx }) => {
    try {
      const cookieHeader = ctx.req.headers.cookie || "";
      const match = cookieHeader.match(/user-session=([^;]+)/);
      if (!match) return { user: null };
      const token = decodeURIComponent(match[1]);
      const userId = verifySessionToken(token);
      if (!userId) return { user: null };
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
      return { user };
    } catch (e) {
      console.error("me error", e);
      return { user: null };
    }
  }),

  update: publicProcedure.input(updateProfileSchema).mutation(async ({ input, ctx }) => {
    try {
      const cookieHeader = ctx.req.headers.cookie || "";
      const match = cookieHeader.match(/user-session=([^;]+)/);
      if (!match) throw new Error("Not authenticated");
      const token = decodeURIComponent(match[1]);
      const userId = verifySessionToken(token);
      if (!userId) throw new Error("Not authenticated");

      const { name } = input;
      const updated = await prisma.user.update({ where: { id: userId }, data: { name }, select: { id: true, email: true, name: true } });
      return { user: updated };
    } catch (e) {
      console.error("update error", e);
      throw e;
    }
  }),

  changePassword: publicProcedure.input(changePasswordSchema).mutation(async ({ input, ctx }) => {
    try {
      const cookieHeader = ctx.req.headers.cookie || "";
      const match = cookieHeader.match(/user-session=([^;]+)/);
      if (!match) throw new Error("Not authenticated");
      const token = decodeURIComponent(match[1]);
      const userId = verifySessionToken(token);
      if (!userId) throw new Error("Not authenticated");

      const { currentPassword, newPassword } = input;
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error("User not found");

      const ok = await comparePassword(currentPassword, user.passwordHash);
      if (!ok) throw new Error("Current password is incorrect");

      const newHash = await hashPassword(newPassword);
      await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });
      return { ok: true };
    } catch (e) {
      console.error("changePassword error", e);
      throw e;
    }
  }),
});

export type AuthRouter = typeof authRouter;
