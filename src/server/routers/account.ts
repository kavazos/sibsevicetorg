import { router, publicProcedure } from "../trpc";
import prisma from "@/lib/prisma";
import { verifySessionToken } from "@/lib/auth";
import { exportSubmissionSchema } from "../schemas";

export const accountRouter = router({
  exportSubmission: publicProcedure.input(exportSubmissionSchema).query(async ({ input, ctx }) => {
    try {
      const cookieHeader = ctx.req.headers.cookie || "";
      const match = cookieHeader.match(/user-session=([^;]+)/);
      if (!match) throw new Error("Not authenticated");
      const token = decodeURIComponent(match[1]);
      const userId = verifySessionToken(token);
      if (!userId) throw new Error("Not authenticated");

      const { id } = input;

      const submission = await prisma.contactSubmission.findUnique({ where: { id } });
      if (!submission || submission.userId !== userId) throw new Error("Not found");

      const payload = { id: submission.id, name: submission.name, email: submission.email, phone: submission.phone, message: submission.message, status: submission.status, createdAt: submission.createdAt };
      return payload;
    } catch (e) {
      console.error("exportSubmission error", e);
      throw e;
    }
  }),
});

export type AccountRouter = typeof accountRouter;
