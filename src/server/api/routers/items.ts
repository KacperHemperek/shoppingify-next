import { TRPCError } from '@trpc/server';
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
          items: { select: { id: true, name: true, desc: true } },
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
      console.log(e);
      return [];
    }
  }),
  add: userProtectedProcedure
    .input(
      z.object({
        name: z.string().min(2, 'Name must have least two letters'),
        categoryId: z.number().min(1).optional(),
        desc: z.string().min(2, 'Description must have least two letters'),
        categoryName: z.string().min(2, 'Category must have least two letters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.categoryId) {
          const newCategory = await ctx.prisma.category.create({
            data: {
              name: input.categoryName,
              userId: ctx.user.id,
              items: { create: { desc: input.desc, name: input.name } },
            },
          });
          console.log(newCategory);
          return;
        }

        const newItem = await ctx.prisma.item.create({
          data: {
            desc: input.desc,
            name: input.name,
            categoryId: input.categoryId,
          },
        });
        console.log(newItem);
        return;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'There was a problem creating new item',
          cause: e,
        });
      }
    }),
  delete: userProtectedProcedure
    .input(z.object({ itemId: z.number(), categoryName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const category = await ctx.prisma.category.findFirst({
          where: { userId: ctx.user.id, name: input.categoryName },
          select: { id: true, items: true },
        });

        if (category?.items && category?.items.length <= 1) {
          await ctx.prisma.item.delete({ where: { id: input.itemId } });
          await ctx.prisma.category.delete({ where: { id: category.id } });
          return;
        }

        await ctx.prisma.item.delete({ where: { id: input.itemId } });
      } catch (e) {}
    }),
});
