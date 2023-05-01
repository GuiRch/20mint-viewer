// Imports
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// Router
export const rankingRouter = createTRPCRouter({
  /**
   * All todos belonging to the session user
   */
  all: protectedProcedure.query(async ({ ctx }) => {
    const nfts = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: {
        likes: true
      }
    });
    return nfts;
  }),
});