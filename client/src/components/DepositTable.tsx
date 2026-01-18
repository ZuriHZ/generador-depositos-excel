import { useState } from 'react';
import { Deposit, DepositFormData } from '@/hooks/useDeposits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, FileDown, Edit2 } from 'lucide-react';
import { exportDepositsToExcel } from '@/lib/excelExporter';
import { toast } from 'sonner';
import EditDepositModal from '@/components/EditDepositModal';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';

interface DepositTableProps {
  deposits: Deposit[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onEdit: (id: string, data: DepositFormData) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-UY', {
    style: 'currency',
    currency: 'UYU',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString + 'T00:00:00');
  return new Intl.DateTimeFormat('es-UY', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

const getDepositTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    efectivo: 'Efectivo',
    cheque: 'Cheque',
    transferencia: 'Transferencia',
    'deposito-automatico': 'Depósito Automático',
    otro: 'Otro',
  };
  return labels[type] || type;
};

export default function DepositTable({
  deposits,
  onRemove,
  onClearAll,
  onEdit,
}: DepositTableProps) {
  const [editingDeposit, setEditingDeposit] = useState<Deposit | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [deletingDeposit, setDeletingDeposit] = useState<Deposit | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const handleExport = () => {
    try {
      const filename = `depositos-${new Date().toISOString().split('T')[0]}.xlsx`;
      exportDepositsToExcel(deposits, filename);
      toast.success(`Archivo "${filename}" descargado exitosamente`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al exportar a Excel'
      );
    }
  };

  const handleEditClick = (deposit: Deposit) => {
    setEditingDeposit(deposit);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (data: DepositFormData) => {
    if (!editingDeposit) return;
    setIsEditLoading(true);
    setTimeout(() => {
      onEdit(editingDeposit.id, data);
      setIsEditLoading(false);
      setIsEditModalOpen(false);
      setEditingDeposit(null);
      toast.success('Depósito actualizado exitosamente');
    }, 300);
  };

  const handleDeleteClick = (deposit: Deposit) => {
    setDeletingDeposit(deposit);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingDeposit) {
      onRemove(deletingDeposit.id);
      setIsDeleteConfirmOpen(false);
      setDeletingDeposit(null);
    }
  };

  const totalAmount = deposits.reduce((sum, deposit) => sum + deposit.monto, 0);

  return (
    <div className="space-y-4">
      {/* Encabezado con estadísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-poppins)' }}>
            Depósitos Ingresados
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {deposits.length} {deposits.length === 1 ? 'depósito' : 'depósitos'}
          </p>
        </div>
        {deposits.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-poppins)' }}>
              {formatCurrency(totalAmount)}
            </p>
          </div>
        )}
      </div>

      {/* Tabla o mensaje vacío */}
      {deposits.length === 0 ? (
        <Card className="p-12 bg-secondary border border-border shadow-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <FileDown className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>
              No hay depósitos aún
            </p>
            <p className="text-sm text-muted-foreground">
              Completa el formulario para agregar depósitos
            </p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="bg-white border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground border-b border-border">
                    <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Número de Cuenta
                    </th>
                    <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-right font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Monto
                    </th>
                    <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Observación
                    </th>
                    <th className="px-4 py-3 text-center font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit, index) => (
                    <tr
                      key={deposit.id}
                      className={`border-b border-border transition-colors hover:bg-secondary ${
                        index % 2 === 0 ? 'bg-white' : 'bg-secondary/30'
                      }`}
                    >
                      <td className="px-4 py-3 text-foreground">
                        {formatDate(deposit.fecha)}
                      </td>
                      <td className="px-4 py-3 text-foreground font-mono text-xs">
                        {deposit.numeroCuenta}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {deposit.nombreCliente}
                      </td>
                      <td className="px-4 py-3 text-right text-foreground font-semibold" style={{ fontFamily: 'var(--font-poppins)' }}>
                        {formatCurrency(deposit.monto)}
                      </td>
                      <td className="px-4 py-3 text-foreground text-xs">
                        <span className="inline-block px-2 py-1 bg-accent/10 text-accent rounded">
                          {getDepositTypeLabel(deposit.tipoDeposito)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground text-xs max-w-xs truncate">
                        {deposit.observacion || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditClick(deposit)}
                            className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                            title="Editar depósito"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(deposit)}
                            className="inline-flex items-center justify-center p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Eliminar depósito"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button
              onClick={handleExport}
              className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 flex items-center justify-center gap-2"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              <FileDown className="w-4 h-4" />
              Generar Excel
            </Button>
            <Button
              onClick={onClearAll}
              variant="outline"
              className="flex-1 h-10 border-border text-foreground hover:bg-secondary font-medium transition-all duration-200"
              style={{ fontFamily: 'var(--font-poppins)' }}
            >
              Limpiar Todo
            </Button>
          </div>
        </>
      )}

      {/* Modal de edición */}
      <EditDepositModal
        isOpen={isEditModalOpen}
        deposit={editingDeposit}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingDeposit(null);
        }}
        onSave={handleEditSave}
        isLoading={isEditLoading}
      />

      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setDeletingDeposit(null);
        }}
        depositInfo={deletingDeposit ? `${deletingDeposit.nombreCliente} (${deletingDeposit.numeroCuenta})` : undefined}
      />
    </div>
  );
}
