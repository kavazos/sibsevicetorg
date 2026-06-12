import { router, publicProcedure, adminProcedure } from "../trpc";
import { createHash } from "crypto";
import prisma from "@/lib/prisma";
import { adminLoginSchema, deleteSubmissionSchema, updateSubmissionStatusSchema } from "../schemas";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password";
const SESSION_SECRET = process.env.SESSION_SECRET || "your-secret-key-change-in-prod";

function generateSessionToken(username: string): string {
  const timestamp = Date.now();
  const data = `${username}-${timestamp}-${SESSION_SECRET}`;
  return createHash("sha256").update(data).digest("hex");
}

export const adminRouter = router({
  login: publicProcedure.input(adminLoginSchema).mutation(async ({ input, ctx }) => {
    const { username, password } = input;
    if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) throw new Error("Неверный логин или пароль");

    const sessionToken = generateSessionToken(username);
    try {
      ctx.res.setHeader("Set-Cookie", `admin-session=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; SameSite=Lax`);
    } catch {}
    return { success: true };
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      ctx.res.setHeader("Set-Cookie", `admin-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
    } catch {}
    return { success: true };
  }),

  deleteSubmission: adminProcedure.input(deleteSubmissionSchema).mutation(async ({ input, ctx }) => {
    const { id } = input;
    try {
      await prisma.contactSubmission.delete({ where: { id } });
      return { success: true };
    } catch (err) {
      console.error("Admin delete error:", err);
      throw new Error("Не удалось удалить заявку.");
    }
  }),

  updateSubmissionStatus: adminProcedure.input(updateSubmissionStatusSchema).mutation(async ({ input, ctx }) => {
    const { id, status } = input;
    try {
      const updated = await prisma.contactSubmission.update({ where: { id }, data: { status } });
      return { success: true, id: updated.id };
    } catch (err) {
      console.error("Admin update status error:", err);
      throw new Error("Не удалось обновить статус заявки.");
    }
  }),
});

export type AdminRouter = typeof adminRouter;
