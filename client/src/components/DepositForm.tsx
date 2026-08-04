import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { DepositFormData, ValidationErrors } from "@/hooks/useDepositsWithDB";

interface DepositFormProps {
  onSubmit: (data: DepositFormData) => void;
  isLoading?: boolean;
}

const DEPOSIT_TYPES = [
  { value: "efectivo", label: "Efectivo" },
  { value: "cheque", label: "Cheque" },
  { value: "transferencia", label: "Transferencia" },
  { value: "deposito-automatico", label: "Depósito Automático" },
  { value: "otro", label: "Otro" },
];

export default function DepositForm({
  onSubmit,
  isLoading = false,
}: DepositFormProps) {
  const [formData, setFormData] = useState<DepositFormData>({
    fecha: new Date().toISOString().split("T")[0],
    numeroCuenta: "",
    nombreCliente: "",
    monto: "",
    tipoDeposito: "",
    remito: "",
    numeroBolsa: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setTimeout(() => {
      setFormData({
        fecha: new Date().toISOString().split("T")[0],
        numeroCuenta: "",
        nombreCliente: "",
        monto: "",
        tipoDeposito: "",
        remito: "",
        numeroBolsa: "",
      });
    }, 100);
  };

  return (
    <div className="ledger-form-card">
      <h2 className="ledger-section-title">Nuevo Depósito</h2>

      <form className="ledger-form" onSubmit={handleSubmit}>
        {/* Fecha */}
        <div className="form-field">
          <label htmlFor="fecha">
            Fecha <span className="required">*</span>
          </label>
          <div className="date-field-wrapper">
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="date-icon"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          {errors.fecha && (
            <div className="field-error">
              <AlertCircle size={14} />
              {errors.fecha}
            </div>
          )}
        </div>

        {/* Número de Cuenta */}
        <div className="form-field">
          <label htmlFor="numeroCuenta">
            Número de Cuenta <span className="required">*</span>
          </label>
          <input
            id="numeroCuenta"
            name="numeroCuenta"
            type="text"
            placeholder="Ej: 123456789"
            value={formData.numeroCuenta}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.numeroCuenta && (
            <div className="field-error">
              <AlertCircle size={14} />
              {errors.numeroCuenta}
            </div>
          )}
        </div>

        {/* Nombre del Cliente */}
        <div className="form-field">
          <label htmlFor="nombreCliente">
            Nombre del Cliente <span className="required">*</span>
          </label>
          <input
            id="nombreCliente"
            name="nombreCliente"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={formData.nombreCliente}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.nombreCliente && (
            <div className="field-error">
              <AlertCircle size={14} />
              {errors.nombreCliente}
            </div>
          )}
        </div>

        {/* Monto */}
        <div className="form-field">
          <label htmlFor="monto">
            Monto <span className="required">*</span>
          </label>
          <input
            id="monto"
            name="monto"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.monto}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
          {errors.monto && (
            <div className="field-error">
              <AlertCircle size={14} />
              {errors.monto}
            </div>
          )}
        </div>

        {/* Tipo de Depósito */}
        <div className="form-field">
          <label htmlFor="tipoDeposito">
            Tipo de Depósito <span className="required">*</span>
          </label>
          <select
            id="tipoDeposito"
            name="tipoDeposito"
            value={formData.tipoDeposito}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          >
            <option value="" disabled>
              Selecciona un tipo
            </option>
            {DEPOSIT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.tipoDeposito && (
            <div className="field-error">
              <AlertCircle size={14} />
              {errors.tipoDeposito}
            </div>
          )}
        </div>

        {/* Remito (opcional) */}
        <div className="form-field">
          <label htmlFor="remito">Remito</label>
          <input
            id="remito"
            name="remito"
            type="text"
            placeholder="Número de remito"
            value={formData.remito || ""}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Número de Bolsa (opcional) */}
        <div className="form-field">
          <label htmlFor="numeroBolsa">Número de Bolsa</label>
          <input
            id="numeroBolsa"
            name="numeroBolsa"
            type="text"
            placeholder="Número de bolsa"
            value={formData.numeroBolsa || ""}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>

        {/* Botón Agregar */}
        <button
          type="submit"
          className="ledger-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2
                style={{ width: 18, height: 18 }}
                className="animate-spin"
              />
              <span>Agregando...</span>
            </>
          ) : (
            <span>Agregar Depósito</span>
          )}
        </button>
      </form>
    </div>
  );
}
