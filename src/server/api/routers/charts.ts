import { TRPCError } from '@trpc/server';

import { createTRPCRouter, userProtectedProcedure } from '@/server/api/trpc';

export const chartsRouter = createTRPCRouter({
  getTopThreeItems: userProtectedProcedure.query(async ({ ctx }) => {
    try {
      const topThreeItemsWithTotalAmount = await ctx.prisma.listItem.groupBy({
        by: ['itemId'],
        _sum: { amount: true },
        orderBy: { _count: { amount: 'desc' } },
        take: 3,
      });

      const topThreeUsersItemsWithName = await ctx.prisma.item.findMany({
        where: {
          OR: topThreeItemsWithTotalAmount.map((item) => ({ id: item.itemId })),
        },
        select: { name: true, id: true },
      });
      const allUsersItems = await ctx.prisma.listItem.aggregate({
        _sum: { amount: true },
      });

      const topThreeUsersItemsWithCompleteInformation =
        topThreeUsersItemsWithName
          .map((itemWithName) => {
            const itemWithTotalAmount = topThreeItemsWithTotalAmount.find(
              (item) => item.itemId === itemWithName.id
            );

            return {
              name: itemWithName.name,
              id: itemWithName.id,
              amount: itemWithTotalAmount?._sum.amount ?? 0,
              allItemsAmount: allUsersItems._sum.amount ?? 0,
            };
          })
          .sort((a, b) => b.amount - a.amount);

      return topThreeUsersItemsWithCompleteInformation;
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unknow Error while fetching top items',
        cause: e,
      });
    }
  }),
});
