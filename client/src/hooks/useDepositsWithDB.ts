import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

export interface Deposit {
  id: number;
  fecha: string;
  numeroCuenta: string;
  nombreCliente: string;
  monto: number;
  tipoDeposito: string;
  remito?: string;
  numeroBolsa?: string;
}

export interface DepositFormData {
  fecha: string;
  numeroCuenta: string;
  nombreCliente: string;
  monto: string;
  tipoDeposito: string;
  remito?: string;
  numeroBolsa?: string;
}

export interface ValidationErrors {
  fecha?: string;
  numeroCuenta?: string;
  nombreCliente?: string;
  monto?: string;
  tipoDeposito?: string;
}

export const useDepositsWithDB = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  // Queries y mutations de tRPC
  const {
    data: dbDeposits,
    isLoading: isLoadingDeposits,
    refetch,
  } = trpc.deposits.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const createMutation = trpc.deposits.create.useMutation();
  const updateMutation = trpc.deposits.update.useMutation();
  const deleteMutation = trpc.deposits.delete.useMutation();

  // Cargar depósitos de la BD cuando el componente monta
  useEffect(() => {
    if (dbDeposits) {
      const formattedDeposits = dbDeposits.map((d: any) => ({
        id: d.id,
        fecha: d.fecha,
        numeroCuenta: d.numeroCuenta,
        nombreCliente: d.nombreCliente,
        monto: typeof d.monto === "string" ? parseFloat(d.monto) : d.monto,
        tipoDeposito: d.tipoDeposito,
        remito: d.remito || undefined,
        numeroBolsa: d.numeroBolsa || undefined,
      }));
      setDeposits(formattedDeposits);
    }
  }, [dbDeposits]);

  const validateForm = (data: DepositFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.fecha) {
      errors.fecha = "La fecha es requerida";
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.fecha)) {
        errors.fecha = "Formato de fecha inválido (YYYY-MM-DD)";
      } else {
        const date = new Date(data.fecha);
        if (isNaN(date.getTime())) {
          errors.fecha = "Fecha inválida";
        }
      }
    }

    if (!data.numeroCuenta) {
      errors.numeroCuenta = "El número de cuenta es requerido";
    } else if (data.numeroCuenta.trim().length < 5) {
      errors.numeroCuenta =
        "El número de cuenta debe tener al menos 5 caracteres";
    }

    if (!data.nombreCliente) {
      errors.nombreCliente = "El nombre del cliente es requerido";
    } else if (data.nombreCliente.trim().length < 2) {
      errors.nombreCliente = "El nombre debe tener al menos 2 caracteres";
    }

    if (!data.monto) {
      errors.monto = "El monto es requerido";
    } else {
      const montoNum = parseFloat(data.monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        errors.monto = "El monto debe ser un número mayor a 0";
      }
    }

    if (!data.tipoDeposito) {
      errors.tipoDeposito = "El tipo de depósito es requerido";
    }

    return errors;
  };

  const addDeposit = useCallback(
    async (
      data: DepositFormData
    ): Promise<{ success: boolean; errors?: ValidationErrors }> => {
      const errors = validateForm(data);

      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      try {
        setIsLoading(true);
        await createMutation.mutateAsync({
          fecha: data.fecha,
          numeroCuenta: data.numeroCuenta.trim(),
          nombreCliente: data.nombreCliente.trim(),
          monto: data.monto,
          tipoDeposito: data.tipoDeposito,
          remito: data.remito?.trim(),
          numeroBolsa: data.numeroBolsa?.trim(),
        });

        // Recargar depósitos de la BD
        await refetch();
        return { success: true };
      } catch (error) {
        console.error("Error al agregar depósito:", error);
        return {
          success: false,
          errors: { fecha: "Error al guardar el depósito" },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [createMutation, refetch]
  );

  const removeDeposit = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        await deleteMutation.mutateAsync({ id });
        await refetch();
      } catch (error) {
        console.error("Error al eliminar depósito:", error);
        toast.error("Error al eliminar el depósito");
      } finally {
        setIsLoading(false);
      }
    },
    [deleteMutation, refetch]
  );

  const clearAllDeposits = useCallback(async () => {
    try {
      setIsLoading(true);
      // Eliminar todos los depósitos uno por uno
      for (const deposit of deposits) {
        await deleteMutation.mutateAsync({ id: deposit.id });
      }
      await refetch();
    } catch (error) {
      console.error("Error al limpiar depósitos:", error);
      toast.error("Error al limpiar los depósitos");
    } finally {
      setIsLoading(false);
    }
  }, [deposits, deleteMutation, refetch]);

  const editDeposit = useCallback(
    async (
      id: number,
      data: DepositFormData
    ): Promise<{ success: boolean; errors?: ValidationErrors }> => {
      const errors = validateForm(data);

      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      try {
        setIsLoading(true);
        await updateMutation.mutateAsync({
          id,
          fecha: data.fecha,
          numeroCuenta: data.numeroCuenta.trim(),
          nombreCliente: data.nombreCliente.trim(),
          monto: data.monto,
          tipoDeposito: data.tipoDeposito,
          remito: data.remito?.trim(),
          numeroBolsa: data.numeroBolsa?.trim(),
        });

        await refetch();
        return { success: true };
      } catch (error) {
        console.error("Error al editar depósito:", error);
        return {
          success: false,
          errors: { fecha: "Error al guardar los cambios" },
        };
      } finally {
        setIsLoading(false);
      }
    },
    [updateMutation, refetch]
  );

  return {
    deposits,
    addDeposit,
    removeDeposit,
    clearAllDeposits,
    editDeposit,
    isLoading: isLoading || isLoadingDeposits,
  };
};
