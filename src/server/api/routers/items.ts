import { z } from 'zod';

import type { CategoryType } from '@/types/Categoy.interface';
import type { Item } from '@/types/Item.interface';

import {
  createTRPCRouter,
  userProcedure,
  userProtectedProcedure,
} from '@/server/api/trpc';

export const itemRouter = createTRPCRouter({
  getAll: userProcedure.query(async ({ ctx }): Promise<CategoryType[]> => {
    try {
      if (!ctx.user) {
        return [];
      }

      const categoriesWithItems = await ctx.prisma.category.findMany({
        where: { userId: ctx.user.id },
        select: {
          id: true,
          items: {
            select: { id: true, name: true, desc: true },
            where: { deletedAt: null },
          },
          name: true,
        },
      });
      const result = categoriesWithItems.map((category) => {
        const itemsWithNames: Item[] = category.items.map((item) => ({
          ...item,
          category: category.name,
        }));
        return { name: category.name, id: category.id, items: itemsWithNames };
      });

      return result;
    } catch (e) {
      return [];
    }
  }),
  add: userProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2, 'Name must have least two letters'),
        categoryId: z.number().min(1).optional(),
        desc: z.string().optional(),
        categoryName: z.string().min(2, 'Category must have least two letters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.categoryId) {
        await ctx.prisma.category.create({
          data: {
            name: input.categoryName,
            userId: ctx.user.id,
            items: { create: { desc: input.desc ?? '', name: input.name } },
          },
        });
        return;
      }

      await ctx.prisma.item.create({
        data: {
          desc: input.desc ?? '',
          name: input.name,
          categoryId: input.categoryId,
        },
      });
    }),
  delete: userProtectedProcedure
    .input(z.object({ itemId: z.number(), categoryName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedItem = await ctx.prisma.item.update({
        where: { id: input.itemId },
        data: { deletedAt: new Date() },
      });
      return updatedItem;
    }),
});
