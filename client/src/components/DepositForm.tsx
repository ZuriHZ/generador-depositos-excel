import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { DepositFormData, ValidationErrors } from '@/hooks/useDeposits';

interface DepositFormProps {
  onSubmit: (data: DepositFormData) => void;
  isLoading?: boolean;
}

const DEPOSIT_TYPES = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'deposito-automatico', label: 'Depósito Automático' },
  { value: 'otro', label: 'Otro' },
];

export default function DepositForm({ onSubmit, isLoading = false }: DepositFormProps) {
  const [formData, setFormData] = useState<DepositFormData>({
    fecha: new Date().toISOString().split('T')[0],
    numeroCuenta: '',
    nombreCliente: '',
    monto: '',
    tipoDeposito: '',
    remito: '',
    numeroBolsa: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empieza a escribir
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tipoDeposito: value }));
    if (errors.tipoDeposito) {
      setErrors((prev) => ({ ...prev, tipoDeposito: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Limpiar formulario después de envío exitoso
    setTimeout(() => {
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        numeroCuenta: '',
        nombreCliente: '',
        monto: '',
        tipoDeposito: '',
        remito: '',
        numeroBolsa: '',
      });
      setTouched({});
    }, 100);
  };

  const handleErrors = (newErrors: ValidationErrors) => {
    setErrors(newErrors);
  };

  return (
    <Card className="p-6 bg-white border border-border shadow-sm">
      <h2 className="text-xl font-bold text-foreground mb-6" style={{ fontFamily: 'var(--font-poppins)' }}>
        Nuevo Depósito
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Fecha */}
        <div>
          <Label htmlFor="fecha" className="text-sm text-foreground mb-2 block">
            Fecha <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fecha"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleInputChange}
            onBlur={() => handleBlur('fecha')}
            className="w-full h-10 text-sm"
            disabled={isLoading}
          />
          {errors.fecha && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.fecha}
            </div>
          )}
        </div>

        {/* Número de Cuenta */}
        <div>
          <Label htmlFor="numeroCuenta" className="text-sm text-foreground mb-2 block">
            Número de Cuenta <span className="text-destructive">*</span>
          </Label>
          <Input
            id="numeroCuenta"
            name="numeroCuenta"
            type="text"
            placeholder="Ej: 123456789"
            value={formData.numeroCuenta}
            onChange={handleInputChange}
            onBlur={() => handleBlur('numeroCuenta')}
            className="w-full h-10 text-sm"
            disabled={isLoading}
          />
          {errors.numeroCuenta && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.numeroCuenta}
            </div>
          )}
        </div>

        {/* Nombre del Cliente */}
        <div>
          <Label htmlFor="nombreCliente" className="text-sm text-foreground mb-2 block">
            Nombre del Cliente <span className="text-destructive">*</span>
          </Label>
          <Input
            id="nombreCliente"
            name="nombreCliente"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={formData.nombreCliente}
            onChange={handleInputChange}
            onBlur={() => handleBlur('nombreCliente')}
            className="w-full h-10 text-sm"
            disabled={isLoading}
          />
          {errors.nombreCliente && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.nombreCliente}
            </div>
          )}
        </div>

        {/* Monto */}
        <div>
          <Label htmlFor="monto" className="text-sm text-foreground mb-2 block">
            Monto <span className="text-destructive">*</span>
          </Label>
          <Input
            id="monto"
            name="monto"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.monto}
            onChange={handleInputChange}
            onBlur={() => handleBlur('monto')}
            className="w-full h-10 text-sm"
            disabled={isLoading}
          />
          {errors.monto && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.monto}
            </div>
          )}
        </div>

        {/* Tipo de Depósito */}
        <div>
          <Label htmlFor="tipoDeposito" className="text-sm text-foreground mb-2 block">
            Tipo de Depósito <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.tipoDeposito} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full h-10 text-sm">
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {DEPOSIT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipoDeposito && (
            <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.tipoDeposito}
            </div>
          )}
        </div>

        {/* Remito */}
        <div>
          <Label htmlFor="remito" className="text-sm text-foreground mb-2 block">
            Remito (Opcional)
          </Label>
          <Input
            id="remito"
            name="remito"
            type="text"
            placeholder="Número de remito"
            value={formData.remito || ''}
            onChange={handleInputChange}
            className="w-full text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Número de Bolsa */}
        <div>
          <Label htmlFor="numeroBolsa" className="text-sm text-foreground mb-2 block">
            Número de Bolsa (Opcional)
          </Label>
          <Input
            id="numeroBolsa"
            name="numeroBolsa"
            type="text"
            placeholder="Número de bolsa"
            value={formData.numeroBolsa || ''}
            onChange={handleInputChange}
            className="w-full text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Botón Agregar */}
        <Button
          type="submit"
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
          style={{ fontFamily: 'var(--font-poppins)' }}
          disabled={isLoading}
        >
          {isLoading ? 'Agregando...' : 'Agregar Depósito'}
        </Button>
      </form>
    </Card>
  );
}
