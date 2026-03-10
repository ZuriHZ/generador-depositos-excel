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
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      setFocusedField(null);
    }, 100);
  };

  return (
    <div className="dashboard-card">
      <h2 className="dashboard-section-title">Nuevo Depósito</h2>

      <form onSubmit={handleSubmit}>
        {/* Fecha */}
        <div className="login-field-group">
          <label htmlFor="fecha" className="login-field-label">
            Fecha <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <div className="login-field-input-wrap">
            <input
              id="fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("fecha")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
              required
            />
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "fecha"}
            />
          </div>
          {errors.fecha && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                color: "var(--destructive)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-inter)",
              }}
            >
              <AlertCircle size={16} />
              {errors.fecha}
            </div>
          )}
        </div>

        {/* Número de Cuenta */}
        <div className="login-field-group">
          <label htmlFor="numeroCuenta" className="login-field-label">
            Número de Cuenta{" "}
            <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <div className="login-field-input-wrap">
            <input
              id="numeroCuenta"
              name="numeroCuenta"
              type="text"
              placeholder="Ej: 123456789"
              value={formData.numeroCuenta}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("numeroCuenta")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
              required
            />
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "numeroCuenta"}
            />
          </div>
          {errors.numeroCuenta && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                color: "var(--destructive)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-inter)",
              }}
            >
              <AlertCircle size={16} />
              {errors.numeroCuenta}
            </div>
          )}
        </div>

        {/* Nombre del Cliente */}
        <div className="login-field-group">
          <label htmlFor="nombreCliente" className="login-field-label">
            Nombre del Cliente{" "}
            <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <div className="login-field-input-wrap">
            <input
              id="nombreCliente"
              name="nombreCliente"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={formData.nombreCliente}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("nombreCliente")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
              required
            />
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "nombreCliente"}
            />
          </div>
          {errors.nombreCliente && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                color: "var(--destructive)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-inter)",
              }}
            >
              <AlertCircle size={16} />
              {errors.nombreCliente}
            </div>
          )}
        </div>

        {/* Monto */}
        <div className="login-field-group">
          <label htmlFor="monto" className="login-field-label">
            Monto <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <div className="login-field-input-wrap">
            <input
              id="monto"
              name="monto"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={formData.monto}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("monto")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
              required
            />
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "monto"}
            />
          </div>
          {errors.monto && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                color: "var(--destructive)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-inter)",
              }}
            >
              <AlertCircle size={16} />
              {errors.monto}
            </div>
          )}
        </div>

        {/* Tipo de Depósito */}
        <div className="login-field-group">
          <label htmlFor="tipoDeposito" className="login-field-label">
            Tipo de Depósito{" "}
            <span style={{ color: "var(--destructive)" }}>*</span>
          </label>
          <div className="login-field-input-wrap">
            <select
              id="tipoDeposito"
              name="tipoDeposito"
              value={formData.tipoDeposito}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("tipoDeposito")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
              required
              style={{ appearance: "none" }}
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
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "tipoDeposito"}
            />
          </div>
          {errors.tipoDeposito && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "0.5rem",
                color: "var(--destructive)",
                fontSize: "0.875rem",
                fontFamily: "var(--font-inter)",
              }}
            >
              <AlertCircle size={16} />
              {errors.tipoDeposito}
            </div>
          )}
        </div>

        {/* Remito */}
        <div className="login-field-group">
          <label htmlFor="remito" className="login-field-label">
            Remito
          </label>
          <div className="login-field-input-wrap">
            <input
              id="remito"
              name="remito"
              type="text"
              placeholder="Número de remito"
              value={formData.remito || ""}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("remito")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
            />
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "remito"}
            />
          </div>
        </div>

        {/* Número de Bolsa */}
        <div className="login-field-group">
          <label htmlFor="numeroBolsa" className="login-field-label">
            Número de Bolsa
          </label>
          <div className="login-field-input-wrap">
            <input
              id="numeroBolsa"
              name="numeroBolsa"
              type="text"
              placeholder="Número de bolsa"
              value={formData.numeroBolsa || ""}
              onChange={handleInputChange}
              onFocus={() => setFocusedField("numeroBolsa")}
              onBlur={() => setFocusedField(null)}
              className="login-field-input"
              disabled={isLoading}
            />
            <div
              className="login-field-focus-line"
              data-focused={focusedField === "numeroBolsa"}
            />
          </div>
        </div>

        {/* Botón Agregar */}
        <div
          className="login-submit-wrap"
          style={{ marginTop: "2.5rem", animation: "none" }}
        >
          <button
            type="submit"
            className="login-submit-btn"
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
        </div>
      </form>
    </div>
  );
}
