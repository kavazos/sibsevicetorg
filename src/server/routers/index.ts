import { router } from "../trpc";
import { authRouter } from "./auth";
import { adminRouter } from "./admin";
import { contactRouter } from "./contact";
import { accountRouter } from "./account";

export const appRouter = router({
  auth: authRouter,
  admin: adminRouter,
  contact: contactRouter,
  account: accountRouter,
});

export type AppRouter = typeof appRouter;
