import { createTRPCRouter } from '@/server/api/trpc';
import { categoryRouter } from './routers/category';
import { itemRouter } from './routers/items';
import { userRouter } from './routers/user';
import { listRouter } from './routers/list';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  item: itemRouter,
  category: categoryRouter,
  list: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
