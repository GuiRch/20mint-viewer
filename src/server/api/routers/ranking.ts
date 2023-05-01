// Imports
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// Router
export const rankingRouter = createTRPCRouter({
  // Get all the liked Nfts and include the 
  getLikedNfts: protectedProcedure.query(async ({ ctx }) => {
    const nfts = await ctx.prisma.nft.findMany({
      include: {
        _count: {
            select: {
                likes: true,
            }
        },
        likes: true
      }
    });
    return nfts;
  }),
});