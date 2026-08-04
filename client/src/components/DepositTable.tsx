import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  FileDown,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import EditDepositModal from "@/components/EditDepositModal";
import { TotalStamp } from "@/components/TotalStamp";
import { Deposit, DepositFormData } from "@/hooks/useDepositsWithDB";
import { exportDepositsToExcel } from "@/lib/excelExporter";

interface DepositTableProps {
  deposits: Deposit[];
  onRemove: (id: number) => void;
  onClearAll: () => void;
  onEdit: (id: number, data: DepositFormData) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-UY", {
    style: "currency",
    currency: "UYU",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString + "T00:00:00");
  return new Intl.DateTimeFormat("es-UY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

const getDepositTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    efectivo: "Efectivo",
    cheque: "Cheque",
    transferencia: "Transferencia",
    "deposito-automatico": "Depósito Automático",
    otro: "Otro",
  };
  return labels[type] || type;
};

const ITEMS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(deposits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDeposits = deposits.slice(startIndex, endIndex);

  const handleExport = async () => {
    try {
      const filename = `depositos-${new Date().toISOString().split("T")[0]}.xlsx`;
      await exportDepositsToExcel(deposits, filename);
      toast.success(`Archivo "${filename}" descargado exitosamente`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al exportar a Excel"
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
      toast.success("Depósito actualizado exitosamente");
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
    <div className="ledger-table-wrapper">

      {/* Sello del Total - fixed at top */}
      {deposits.length > 0 && (
        <div className="ledger-stamp-container">
          <TotalStamp
            total={totalAmount}
            count={deposits.length}
            formatCurrency={formatCurrency}
          />
        </div>
      )}

      {/* Scrollable content area */}
      <div className="ledger-scroll-area">
        {/* Tabla o mensaje vacío */}
        {deposits.length === 0 ? (
          <div className="ledger-empty">
            <div className="ledger-empty-icon">
              <FileDown size={48} />
            </div>
            <p className="ledger-empty-title">No hay depósitos aún</p>
            <p className="ledger-empty-text">Completa el formulario para agregar depósitos</p>
          </div>
        ) : (
          <>
            {/* Desktop: Tabla */}
            <div className="refined-table-container">
            {/* Header */}
            <div className="ledger-table-header">
              <div>Fecha</div>
              <div>Número de Cuenta</div>
              <div>Cliente</div>
              <div style={{ textAlign: "right" }}>Monto</div>
              <div>Tipo</div>
              <div>Remito</div>
              <div>Bolsa</div>
              <div style={{ textAlign: "center" }}>Acciones</div>
            </div>

            {/* Rows */}
            {currentDeposits.map(deposit => (
              <div
                key={deposit.id}
                className="ledger-table-row"
                data-type={deposit.tipoDeposito}
              >
                <div className="ledger-table-cell">{formatDate(deposit.fecha)}</div>
                <div className="ledger-table-cell mono">{deposit.numeroCuenta}</div>
                <div className="ledger-table-cell client">{deposit.nombreCliente}</div>
                <div className="ledger-table-cell amount">{formatCurrency(deposit.monto)}</div>
                <div>
                  <span className={`ledger-badge ${deposit.tipoDeposito}`}>
                    {getDepositTypeLabel(deposit.tipoDeposito)}
                  </span>
                </div>
                <div className="ledger-table-cell">{deposit.remito || "—"}</div>
                <div className="ledger-table-cell">{deposit.numeroBolsa || "—"}</div>
                <div className="ledger-actions">
                  <button
                    className="ledger-action-btn"
                    onClick={() => handleEditClick(deposit)}
                    title="Editar depósito"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="ledger-action-btn delete"
                    onClick={() => handleDeleteClick(deposit)}
                    title="Eliminar depósito"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Cards */}
          <div className="deposit-cards-container">
            {currentDeposits.map(deposit => (
              <div
                key={deposit.id}
                className="deposit-card"
                data-type={deposit.tipoDeposito}
              >
                <div className="deposit-card-header">
                  <span className={`ledger-badge ${deposit.tipoDeposito}`}>
                    {getDepositTypeLabel(deposit.tipoDeposito)}
                  </span>
                  <div className="deposit-card-actions">
                    <button
                      className="ledger-action-btn"
                      onClick={() => handleEditClick(deposit)}
                      title="Editar depósito"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="ledger-action-btn delete"
                      onClick={() => handleDeleteClick(deposit)}
                      title="Eliminar depósito"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="deposit-card-body">
                  <div className="deposit-card-field">
                    <span className="deposit-card-label">Fecha:</span>
                    <span className="deposit-card-value">{formatDate(deposit.fecha)}</span>
                  </div>
                  <div className="deposit-card-field">
                    <span className="deposit-card-label">N° Cuenta:</span>
                    <span className="deposit-card-value mono">{deposit.numeroCuenta}</span>
                  </div>
                  <div className="deposit-card-field">
                    <span className="deposit-card-label">Cliente:</span>
                    <span className="deposit-card-value">{deposit.nombreCliente}</span>
                  </div>
                  <div className="deposit-card-field">
                    <span className="deposit-card-label">Monto:</span>
                    <span className="deposit-card-value amount">{formatCurrency(deposit.monto)}</span>
                  </div>
                  {deposit.remito && (
                    <div className="deposit-card-field">
                      <span className="deposit-card-label">Remito:</span>
                      <span className="deposit-card-value mono">{deposit.remito}</span>
                    </div>
                  )}
                  {deposit.numeroBolsa && (
                    <div className="deposit-card-field">
                      <span className="deposit-card-label">Bolsa:</span>
                      <span className="deposit-card-value mono">{deposit.numeroBolsa}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
           </div>
          </>
        )}
        </div>

      {/* Paginación - fixed at bottom */}
      {totalPages > 1 && (
        <div className="ledger-pagination">
          <button
            className="ledger-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`ledger-pagination-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            className="ledger-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Botones de acción inferiores - fixed at bottom */}
      <div className="ledger-bottom-actions">
        <button
          onClick={handleExport}
          className="ledger-export-btn"
        >
          <FileDown size={18} />
          <span>Generar Excel</span>
        </button>
        <button
          onClick={onClearAll}
          className="ledger-clear-btn"
        >
          Limpiar Todo
        </button>
      </div>

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
        depositInfo={
          deletingDeposit
            ? `${deletingDeposit.nombreCliente} (${deletingDeposit.numeroCuenta})`
            : undefined
        }
      />
    </div>
  );
}