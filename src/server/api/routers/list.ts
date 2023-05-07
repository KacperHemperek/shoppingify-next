import { type ListState } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, userProtectedProcedure } from '@/server/api/trpc';

const itemSchema = z.object({
  amount: z.number().min(1),
  itemId: z.number().min(1),
  categoryId: z.number().min(1),
});

export type FormatedItem = {
  name: string;
  amount: number;
  id: number;
  checked: boolean;
  category: string;
};

type NotFormatedListWithItems = {
  id: number;
  name: string;
  state: ListState;
  items: {
    item: {
      category: {
        name: string;
      };
      id: number;
      name: string;
    };
    id: number;
    amount: number;
    checked: boolean;
  }[];
};

function formatListToContainItemsWithData(list: NotFormatedListWithItems): {
  name: string;
  items: FormatedItem[];
  id: number;
  state: ListState;
} {
  const formatedItems: FormatedItem[] = list.items.map((item) => ({
    name: item.item.name,
    amount: item.amount,
    id: item.id,
    category: item.item.category.name,
    checked: item.checked,
  }));

  return {
    name: list.name,
    items: formatedItems,
    id: list.id,
    state: list.state,
  };
}

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

      console.log({ items: input.items });

      try {
        const itemsToCreate = input.items.map((item) => ({
          amount: item.amount,
          checked: false,
          itemId: item.itemId,
          categoryId: item.categoryId,
        }));

        await ctx.prisma.list.updateMany({
          where: { userId: ctx.user.id, state: 'current' },
          data: { state: 'cancelled' },
        });

        await ctx.prisma.list.create({
          data: {
            name: input.listName,
            userId: ctx.user.id,
            items: { create: itemsToCreate },
          },
        });
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
  getListById: userProtectedProcedure
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
            state: true,
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

        return formatListToContainItemsWithData(list);
      } catch (e) {}
    }),
  getCurrentListId: userProtectedProcedure.query(async ({ ctx }) => {
    const currentList = await ctx.prisma.list.findFirst({
      where: { userId: ctx.user.id, state: 'current' },
      select: {
        id: true,
      },
    });

    return currentList?.id ?? null;
  }),
  toggleListItem: userProtectedProcedure
    .input(
      z.object({
        itemId: z.number().min(1, "It's not a valid id"),
        value: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.listItem.update({
          where: { id: input.itemId },
          data: { checked: input.value },
        });
      } catch (e) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unexpected error when toggling item occured',
          cause: e,
        });
      }
    }),
  updateListName: userProtectedProcedure
    .input(
      z.object({
        name: z.string().min(1, 'List name is too short'),
        listId: z.number().min(1, 'Not a valid id'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.list.update({
          where: { id: input.listId },
          data: { name: input.name },
        });
      } catch (e) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'There was a problem updating your list name',
          cause: e,
        });
      }
    }),
  changeStatus: userProtectedProcedure
    .input(z.object({ status: z.enum(['cancelled', 'current', 'completed']) }))
    .mutation(async ({ ctx, input }) => {
      try {
        const listWithId = await ctx.prisma.list.findFirst({
          where: { userId: ctx.user.id, state: 'current' },
          select: { id: true },
        });

        if (!listWithId || !listWithId.id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "User doesn't have current list",
          });
        }

        await ctx.prisma.list.update({
          where: { id: listWithId.id },
          data: { state: input.status },
        });
      } catch (e) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Unnexprected Error occured while updating list',
          cause: e,
        });
      }
    }),
});
