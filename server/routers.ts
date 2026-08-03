import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createDeposit,
  getDepositsByUserId,
  updateDeposit,
  deleteDeposit,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    /** Returns the currently authenticated user from DB, or null */
    me: publicProcedure.query(opts => opts.ctx.user),
    /** Logout is handled client-side by Clerk — this is a no-op kept for compatibility */
    logout: publicProcedure.mutation(() => {
      return { success: true } as const;
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
