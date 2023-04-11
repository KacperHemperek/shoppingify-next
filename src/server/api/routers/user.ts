import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const userRouter = createTRPCRouter({
  getUserFromSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const sessionId = ctx.cookies?.session;

      console.log({ cookies: ctx.cookies });

      if (!sessionId) {
        return null;
      }
      console.log({ sessionId });
      const session = await ctx.prisma.session.findFirst({
        where: { id: Number(sessionId) },
      });

      if (!session) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Couldn't find session",
        });
      }
      const user = await ctx.prisma.user.findFirst({
        where: { id: Number(session.userId) },
      });

      if (!user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: "Couldn't find a user from session",
        });
      }

      return user;
    } catch (e) {
      console.error({ error: e });
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        cause: e,
      });
    }
  }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const sessionId = ctx.cookies.session;

    if (!sessionId) {
      return;
    }

    await ctx.prisma.session.delete({
      where: { id: Number(sessionId) },
    });

    ctx.setCookie('session', '', { maxAge: -1 });
  }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findFirst({
        where: { email: input.email },
      });

      if (!user || user.password !== input.password) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Wrong password or email',
        });
      }

      const newSession = await ctx.prisma.session.create({
        data: { userId: user.id },
      });

      ctx.setCookie('session', newSession.id);
    }),
});
