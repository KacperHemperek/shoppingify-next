import { createTRPCRouter, userProcedure } from '@/server/api/trpc';
import type { CategoryType } from '@/types/Categoy.interface';
import type { Item } from '@/types/Item.interface';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const itemRouter = createTRPCRouter({
  getAll: userProcedure.query(async ({ ctx }): Promise<CategoryType[]> => {
    try {
      console.log(ctx.user);

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
  addItem: userProcedure
    .input(
      z.object({
        name: z.string().min(2, 'Name must have least two letters'),
        categoryId: z.number().min(1).optional(),
        desc: z.string().min(2, 'Description must have least two letters'),
        categoryName: z.string().min(2, 'Category must have least two letters'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

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
});
