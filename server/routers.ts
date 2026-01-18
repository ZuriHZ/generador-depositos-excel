import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createDeposit,
  getDepositsByUserId,
  updateDeposit,
  deleteDeposit,
  getUserByEmail,
  upsertUser,
} from "./db";
import bcrypt from "bcryptjs";
import { sdk } from "./_core/sdk";
import { ONE_YEAR_MS } from "@shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          input.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // For manual users, we use email as openId or a specific format
        const sessionToken = await sdk.createSessionToken(user.openId!, {
          name: user.name || user.email,
          expiresInMs: ONE_YEAR_MS,
        });

        // Update lastSignedIn
        await upsertUser({
          openId: user.openId!,
          email: user.email,
          lastSignedIn: new Date(),
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true, user };
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  deposits: router({
    list: protectedProcedure.query(({ ctx }) =>
      getDepositsByUserId(ctx.user.id)
    ),
    create: protectedProcedure
      .input(
        z.object({
          fecha: z.string(),
          numeroCuenta: z.string(),
          nombreCliente: z.string(),
          monto: z.string(),
          tipoDeposito: z.string(),
          remito: z.string().optional(),
          numeroBolsa: z.string().optional(),
        })
      )
      .mutation(({ ctx, input }) => {
        const monto = parseFloat(input.monto);
        return createDeposit(ctx.user.id, {
          fecha: input.fecha,
          numeroCuenta: input.numeroCuenta,
          nombreCliente: input.nombreCliente,
          monto: monto.toString(),
          tipoDeposito: input.tipoDeposito,
          remito: input.remito || undefined,
          numeroBolsa: input.numeroBolsa || undefined,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          fecha: z.string().optional(),
          numeroCuenta: z.string().optional(),
          nombreCliente: z.string().optional(),
          monto: z.string().optional(),
          tipoDeposito: z.string().optional(),
          remito: z.string().optional(),
          numeroBolsa: z.string().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        const updateData: Record<string, any> = {};
        if (data.monto) updateData.monto = parseFloat(data.monto).toString();
        if (data.fecha) updateData.fecha = data.fecha;
        if (data.numeroCuenta) updateData.numeroCuenta = data.numeroCuenta;
        if (data.nombreCliente) updateData.nombreCliente = data.nombreCliente;
        if (data.tipoDeposito) updateData.tipoDeposito = data.tipoDeposito;
        if (data.remito !== undefined) updateData.remito = data.remito;
        if (data.numeroBolsa !== undefined)
          updateData.numeroBolsa = data.numeroBolsa;
        return updateDeposit(id, updateData);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteDeposit(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
