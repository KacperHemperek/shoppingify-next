import { createTRPCRouter, userProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const itemSchema = z.object({
  amount: z.number().min(1),
  itemId: z.number().min(1),
});

export const listRouter = createTRPCRouter({
  create: userProcedure
    .input(
      z.object({
        listName: z.string(),
        items: z.array(itemSchema).min(1, 'List has to have at least one item'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

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
});
