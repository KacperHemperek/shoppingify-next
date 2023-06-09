import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  getUserFromSession: publicProcedure.query(async ({ ctx }) => {
    try {
      const sessionId = ctx.cookies?.session;

      if (!sessionId) {
        return null;
      }

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
    try {
      const sessionId = ctx.cookies.session;

      if (!sessionId) {
        return;
      }

      await ctx.prisma.session.delete({
        where: { id: Number(sessionId) },
      });

      ctx.setCookie('session', '', { maxAge: -1 });
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        cause: e,
      });
    }
  }),

  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.prisma.user.findFirst({
          where: { email: input.email },
        });

        if (!user || user.password !== input.password) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Wrong password or email',
          });
        }

        const newSession = await ctx.prisma.session.create({
          data: { userId: user.id },
        });

        ctx.setCookie('session', newSession.id);
      } catch (e) {
        console.error(e);
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Wrong password or email',
          cause: e,
        });
      }
    }),
  signIn: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email('Invalid email'),
        password: z
          .string()
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/gi,
            'Invalid password'
          ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newUser = await ctx.prisma.user.create({
          data: {
            email: input.email,
            name: input.name,
            password: input.password,
          },
        });

        const newSession = await ctx.prisma.session.create({
          data: { userId: newUser.id },
        });

        ctx.setCookie('session', newSession.id);
      } catch (e) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === 'P2002'
        ) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'User with this email already exists',
            cause: e,
          });
        } else {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
            cause: e,
          });
        }
      }
    }),
});
