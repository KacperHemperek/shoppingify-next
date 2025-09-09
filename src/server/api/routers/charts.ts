import { TRPCError } from '@trpc/server';

import { createTRPCRouter, userProtectedProcedure } from '@/server/api/trpc';

export const chartsRouter = createTRPCRouter({
  getTopThreeItems: userProtectedProcedure.query(async ({ ctx }) => {
    const topThreeItemsWithTotalAmount = await ctx.prisma.listItem.groupBy({
      where: { list: { userId: ctx.user.id } },
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
      where: { list: { userId: ctx.user.id } },
      _sum: { amount: true },
    });

    const topThreeUsersItemsWithCompleteInformation = topThreeUsersItemsWithName
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
  }),
  getTopThreeCategories: userProtectedProcedure.query(async ({ ctx }) => {
    const topThreeCategoriesWithTotalAmount = await ctx.prisma.listItem.groupBy(
      {
        where: { list: { userId: ctx.user.id } },
        by: ['categoryId'],
        _sum: { amount: true },
        orderBy: { _count: { amount: 'desc' } },
        take: 3,
      }
    );

    const topThreeUsersCategoriesWithName = await ctx.prisma.category.findMany({
      where: {
        OR: topThreeCategoriesWithTotalAmount.map((item) => ({
          id: item.categoryId ?? -1,
        })),
      },
      select: { name: true, id: true },
    });
    const allUsersItems = await ctx.prisma.listItem.aggregate({
      where: { list: { userId: ctx.user.id } },
      _sum: { amount: true },
    });

    const topThreeUsersItemsWithCompleteInformation =
      topThreeUsersCategoriesWithName
        .map((categoryWithName) => {
          const itemWithTotalAmount = topThreeCategoriesWithTotalAmount.find(
            (item) => item.categoryId === categoryWithName.id
          );

          return {
            name: categoryWithName.name,
            id: categoryWithName.id,
            amount: itemWithTotalAmount?._sum.amount ?? 0,
            allItemsAmount: allUsersItems._sum.amount ?? 0,
          };
        })
        .sort((a, b) => b.amount - a.amount);

    return topThreeUsersItemsWithCompleteInformation;
  }),
  getLineChartData: userProtectedProcedure.query(async ({ ctx }) => {
    const result: Record<string, number> = {};
    const allItems = await ctx.prisma.listItem.findMany({
      where: { list: { userId: ctx.user.id } },
      select: {
        amount: true,
        id: true,
        item: true,
        list: { select: { createdAt: true } },
      },
      orderBy: { list: { createdAt: 'asc' } },
    });

    allItems.forEach((item) => {
      const itemDate = Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(item.list.createdAt);

      if (itemDate in result && result[itemDate]) {
        result[itemDate] += item.amount;
      } else {
        result[itemDate] = item.amount;
      }
    });

    return Object.entries(result)
      .map(([date, itemsAmount]) => ({
        date,
        items: itemsAmount,
      }))
      .slice(-5);
  }),
});
