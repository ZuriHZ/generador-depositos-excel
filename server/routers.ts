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
          fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha invalida (YYYY-MM-DD)"),
          numeroCuenta: z.string().min(5, "Numero de cuenta muy corto").max(30),
          nombreCliente: z.string().min(2, "Nombre muy corto").max(100),
          monto: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monto invalido"),
          tipoDeposito: z.enum(["efectivo", "cheque", "transferencia"], {
            message: "Tipo de deposito invalido",
          }),
          remito: z.string().max(50).optional(),
          numeroBolsa: z.string().max(50).optional(),
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
          id: z.number().positive(),
          fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
          numeroCuenta: z.string().min(5).max(30).optional(),
          nombreCliente: z.string().min(2).max(100).optional(),
          monto: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
          tipoDeposito: z.enum(["efectivo", "cheque", "transferencia"]).optional(),
          remito: z.string().max(50).optional(),
          numeroBolsa: z.string().max(50).optional(),
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
      .input(z.object({ id: z.number().positive() }))
      .mutation(({ input }) => deleteDeposit(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
