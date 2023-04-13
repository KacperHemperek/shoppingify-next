import { createTRPCRouter, userProcedure } from '@/server/api/trpc';
import type { CategoryType } from '@/types/Categoy.interface';
import type { Item } from '@/types/Item.interface';

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
});
