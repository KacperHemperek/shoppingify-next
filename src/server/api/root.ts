import { createTRPCRouter } from '@/server/api/trpc';

import { categoryRouter } from './routers/category';
import { chartsRouter } from './routers/charts';
import { itemRouter } from './routers/items';
import { listRouter } from './routers/list';
import { userRouter } from './routers/user';

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
  charts: chartsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
