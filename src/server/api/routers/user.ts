import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  getUserFromSession: publicProcedure.query(async ({ ctx }) => {
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

      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Wrong password or email',
        });
      }

      const newSession = await ctx.prisma.session.create({
        data: { userId: user.id },
      });

      ctx.setCookie('session', newSession.id);
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password: _, ...userWithoutPassword } = user;

      return userWithoutPassword;
    }),
  signUp: publicProcedure
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
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const newUser = await ctx.prisma.user.create({
          data: {
            email: input.email,
            name: input.name,
            password: hashedPassword,
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
          });
        }
        throw e;
      }
    }),
});
