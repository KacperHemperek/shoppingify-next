import { type DropdownOptionType } from '@/components/DropDown';

import { createTRPCRouter, userProcedure } from '@/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getCategoriesForDropdown: userProcedure.query(
    async ({ ctx }): Promise<DropdownOptionType[]> => {
      if (!ctx.user) {
        return [];
      }
      try {
        const categories = await ctx.prisma.category.findMany({
          where: { userId: ctx.user.id },
          select: {
            id: true,
            name: true,
          },
        });
        return categories;
      } catch (e) {
        console.error(e);
        return [];
      }
    }
  ),
});
