import { useState, useCallback } from 'react';

export interface Deposit {
  id: string;
  fecha: string;
  numeroCuenta: string;
  nombreCliente: string;
  monto: number;
  tipoDeposito: string;
  observacion: string;
}

export interface DepositFormData {
  fecha: string;
  numeroCuenta: string;
  nombreCliente: string;
  monto: string;
  tipoDeposito: string;
  observacion: string;
}

export interface ValidationErrors {
  fecha?: string;
  numeroCuenta?: string;
  nombreCliente?: string;
  monto?: string;
  tipoDeposito?: string;
}

export const useDeposits = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const validateForm = (data: DepositFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    // Validar fecha
    if (!data.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.fecha)) {
        errors.fecha = 'Formato de fecha inválido (YYYY-MM-DD)';
      } else {
        const date = new Date(data.fecha);
        if (isNaN(date.getTime())) {
          errors.fecha = 'Fecha inválida';
        }
      }
    }

    // Validar número de cuenta
    if (!data.numeroCuenta) {
      errors.numeroCuenta = 'El número de cuenta es requerido';
    } else if (data.numeroCuenta.trim().length < 5) {
      errors.numeroCuenta = 'El número de cuenta debe tener al menos 5 caracteres';
    }

    // Validar nombre del cliente
    if (!data.nombreCliente) {
      errors.nombreCliente = 'El nombre del cliente es requerido';
    } else if (data.nombreCliente.trim().length < 2) {
      errors.nombreCliente = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar monto
    if (!data.monto) {
      errors.monto = 'El monto es requerido';
    } else {
      const montoNum = parseFloat(data.monto);
      if (isNaN(montoNum) || montoNum <= 0) {
        errors.monto = 'El monto debe ser un número mayor a 0';
      }
    }

    // Validar tipo de depósito
    if (!data.tipoDeposito) {
      errors.tipoDeposito = 'El tipo de depósito es requerido';
    }

    return errors;
  };

  const addDeposit = useCallback((data: DepositFormData): { success: boolean; errors?: ValidationErrors } => {
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const newDeposit: Deposit = {
      id: `deposit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fecha: data.fecha,
      numeroCuenta: data.numeroCuenta.trim(),
      nombreCliente: data.nombreCliente.trim(),
      monto: parseFloat(data.monto),
      tipoDeposito: data.tipoDeposito,
      observacion: data.observacion.trim(),
    };

    setDeposits((prev) => [...prev, newDeposit]);
    return { success: true };
  }, []);

  const removeDeposit = useCallback((id: string) => {
    setDeposits((prev) => prev.filter((deposit) => deposit.id !== id));
  }, []);

  const clearAllDeposits = useCallback(() => {
    setDeposits([]);
  }, []);

  const editDeposit = useCallback((id: string, data: DepositFormData): { success: boolean; errors?: ValidationErrors } => {
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    setDeposits((prev) =>
      prev.map((deposit) =>
        deposit.id === id
          ? {
              ...deposit,
              fecha: data.fecha,
              numeroCuenta: data.numeroCuenta.trim(),
              nombreCliente: data.nombreCliente.trim(),
              monto: parseFloat(data.monto),
              tipoDeposito: data.tipoDeposito,
              observacion: data.observacion.trim(),
            }
          : deposit
      )
    );
    return { success: true };
  }, []);

  return {
    deposits,
    addDeposit,
    removeDeposit,
    clearAllDeposits,
    editDeposit,
  };
};
