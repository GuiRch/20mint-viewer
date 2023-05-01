import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { todosRouter } from "~/server/api/routers/todos";
import { collectionRouter } from "~/server/api/routers/collection";
import { rankingRouter } from "~/server/api/routers/ranking";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  todos: todosRouter,
  nfts: collectionRouter,
  ranking: rankingRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;