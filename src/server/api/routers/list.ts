import {
  createTRPCRouter,
  userProcedure,
  userProtectedProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const itemSchema = z.object({
  amount: z.number().min(1),
  itemId: z.number().min(1),
});

type FormatedItem = {
  name: string;
  amount: number;
  id: number;
  checked: boolean;
  category: string;
};

export const listRouter = createTRPCRouter({
  create: userProtectedProcedure
    .input(
      z.object({
        listName: z.string(),
        items: z.array(itemSchema).min(1, 'List has to have at least one item'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.items.length < 1) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You need to provide at least one item',
        });
      }

      try {
        const itemsToCreate = input.items.map((item) => ({
          amount: item.amount,
          checked: false,
          itemId: item.itemId,
        }));
        console.log({ input });
        console.log({ itemsToCreate });

        const newList = await ctx.prisma.list.create({
          data: {
            name: input.listName,
            userId: ctx.user.id,
            items: { create: itemsToCreate },
          },
        });

        console.log({ newList });
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          cause: e,
          message: 'There was unexprected server error',
        });
      }
    }),
  getAll: userProtectedProcedure.query(async ({ ctx }) => {
    try {
      const lists = await ctx.prisma.list.findMany({
        where: { userId: ctx.user.id },
        select: { name: true, id: true, state: true, createdAt: true },
      });

      return lists;
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        cause: e,
      });
    }
  }),
  getList: userProtectedProcedure
    .input(z.object({ listId: z.number().min(1, 'This is not a valid ID') }))
    .query(async ({ ctx, input }) => {
      try {
        const list = await ctx.prisma.list.findFirst({
          where: {
            id: input.listId,
          },
          select: {
            name: true,
            id: true,
            items: {
              select: {
                item: {
                  select: {
                    category: { select: { name: true } },
                    id: true,
                    name: true,
                  },
                },
                checked: true,
                amount: true,
                id: true,
              },
            },
          },
        });

        if (!list) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'List was not found',
          });
        }

        const formatedItems: FormatedItem[] = list.items.map((item) => ({
          name: item.item.name,
          amount: item.amount,
          id: item.item.id,
          category: item.item.category.name,
          checked: item.checked,
        }));

        return { name: list.name, items: formatedItems, id: list.id };
      } catch (e) {}
    }),
});
