import { createTRPCRouter } from "~/server/api/trpc";
import { collectionRouter } from "~/server/api/routers/collection";
import { rankingRouter } from "~/server/api/routers/ranking";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  nfts: collectionRouter,
  ranking: rankingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;