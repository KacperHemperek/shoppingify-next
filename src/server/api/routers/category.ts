import { type DropdownOptionType } from '@/components/DropDown';

import { createTRPCRouter, userProtectedProcedure } from '@/server/api/trpc';

export const categoryRouter = createTRPCRouter({
  getCategoriesForDropdown: userProtectedProcedure.query(
    async ({ ctx }): Promise<DropdownOptionType[]> => {
      const categories = await ctx.prisma.category.findMany({
        where: { userId: ctx.user.id },
        select: {
          id: true,
          name: true,
        },
      });
      return categories;
    }
  ),
});
