import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import {
  Deposit,
  DepositFormData,
  ValidationErrors,
} from "@/hooks/useDepositsWithDB";

interface EditDepositModalProps {
  isOpen: boolean;
  deposit: Deposit | null;
  onClose: () => void;
  onSave: (data: DepositFormData) => void;
  isLoading?: boolean;
}

const DEPOSIT_TYPES = [
  { value: "efectivo", label: "Efectivo" },
  { value: "cheque", label: "Cheque" },
  { value: "transferencia", label: "Transferencia" },
  { value: "deposito-automatico", label: "Depósito Automático" },
  { value: "otro", label: "Otro" },
];

export default function EditDepositModal({
  isOpen,
  deposit,
  onClose,
  onSave,
  isLoading = false,
}: EditDepositModalProps) {
  const [formData, setFormData] = useState<DepositFormData>({
    fecha: "",
    numeroCuenta: "",
    nombreCliente: "",
    monto: "",
    tipoDeposito: "",
    remito: "",
    numeroBolsa: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (deposit) {
      setFormData({
        fecha: deposit.fecha,
        numeroCuenta: deposit.numeroCuenta,
        nombreCliente: deposit.nombreCliente,
        monto: deposit.monto.toString(),
        tipoDeposito: deposit.tipoDeposito,
        remito: deposit.remito || "",
        numeroBolsa: deposit.numeroBolsa || "",
      });
      setErrors({});
    }
  }, [deposit, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, tipoDeposito: value }));
    if (errors.tipoDeposito) {
      setErrors(prev => ({ ...prev, tipoDeposito: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: "var(--font-poppins)" }}>
            Editar Depósito
          </DialogTitle>
          <DialogDescription>
            Modifica los datos del depósito y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha */}
          <div>
            <Label
              htmlFor="edit-fecha"
              className="text-sm text-foreground mb-2 block"
            >
              Fecha <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-fecha"
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleInputChange}
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
            <Label
              htmlFor="edit-numeroCuenta"
              className="text-sm text-foreground mb-2 block"
            >
              Número de Cuenta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-numeroCuenta"
              name="numeroCuenta"
              type="text"
              value={formData.numeroCuenta}
              onChange={handleInputChange}
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
            <Label
              htmlFor="edit-nombreCliente"
              className="text-sm text-foreground mb-2 block"
            >
              Nombre del Cliente <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-nombreCliente"
              name="nombreCliente"
              type="text"
              value={formData.nombreCliente}
              onChange={handleInputChange}
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
            <Label
              htmlFor="edit-monto"
              className="text-sm text-foreground mb-2 block"
            >
              Monto <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-monto"
              name="monto"
              type="number"
              step="0.01"
              min="0"
              value={formData.monto}
              onChange={handleInputChange}
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
            <Label
              htmlFor="edit-tipoDeposito"
              className="text-sm text-foreground mb-2 block"
            >
              Tipo de Depósito <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.tipoDeposito}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {DEPOSIT_TYPES.map(type => (
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

          {/* Observación */}
          <div>
            <Label
              htmlFor="edit-remito"
              className="text-sm text-foreground mb-2 block"
            >
              Remito (Opcional)
            </Label>
            <Input
              id="edit-remito"
              name="remito"
              type="text"
              placeholder="Número de remito"
              value={formData.remito || ""}
              onChange={handleInputChange}
              className="w-full text-sm"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label
              htmlFor="edit-numeroBolsa"
              className="text-sm text-foreground mb-2 block"
            >
              Número de Bolsa (Opcional)
            </Label>
            <Input
              id="edit-numeroBolsa"
              name="numeroBolsa"
              type="text"
              placeholder="Número de bolsa"
              value={formData.numeroBolsa || ""}
              onChange={handleInputChange}
              className="w-full text-sm"
              disabled={isLoading}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-border text-foreground hover:bg-secondary"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            style={{ fontFamily: "var(--font-poppins)" }}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
