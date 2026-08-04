import { useState } from "react";
import { Deposit, DepositFormData } from "@/hooks/useDepositsWithDB";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, FileDown, Edit2 } from "lucide-react";
import { exportDepositsToExcel } from "@/lib/excelExporter";
import { toast } from "sonner";
import EditDepositModal from "@/components/EditDepositModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

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
    <div
      className="dashboard-card"
      style={{ display: "flex", flexDirection: "column", gap: "2rem", height: "100%" }}
    >
      {/* Encabezado con estadísticas */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 className="dashboard-section-title" style={{ margin: 0 }}>
            Depósitos Ingresados
          </h2>
          <p
            style={{
              color: "oklch(60% 0.02 250)",
              fontSize: "0.9375rem",
              marginTop: "0.5rem",
            }}
          >
            {deposits.length} {deposits.length === 1 ? "depósito" : "depósitos"}
          </p>
        </div>
        {deposits.length > 0 && (
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                color: "oklch(60% 0.02 250)",
                fontSize: "0.875rem",
                margin: 0,
              }}
            >
              Total
            </p>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.5rem",
                fontWeight: 500,
                color: "oklch(38% 0.1 250)",
                margin: 0,
              }}
            >
              {formatCurrency(totalAmount)}
            </p>
          </div>
        )}
      </div>

      {/* Tabla o mensaje vacío */}
      {deposits.length === 0 ? (
        <div
          style={{
            padding: "4rem 2rem",
            textAlign: "center",
            background: "oklch(99% 0.002 250)",
            borderRadius: "1rem",
            border: "1px solid oklch(92% 0.01 250)",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "oklch(96% 0.01 250)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "oklch(60% 0.02 250)",
            }}
          >
            <FileDown size={32} />
          </div>
          <p
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "1.25rem",
              color: "oklch(20% 0.02 250)",
              margin: "0 0 0.5rem",
            }}
          >
            No hay depósitos aún
          </p>
          <p
            style={{
              color: "oklch(60% 0.02 250)",
              fontSize: "0.9375rem",
              margin: 0,
            }}
          >
            Completa el formulario para agregar depósitos
          </p>
        </div>
      ) : (
        <>
          <div className="refined-table-container">
            <table className="refined-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Número de Cuenta</th>
                  <th>Cliente</th>
                  <th style={{ textAlign: "right" }}>Monto</th>
                  <th>Tipo</th>
                  <th>Remito</th>
                  <th>Bolsa</th>
                  <th style={{ textAlign: "center" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map(deposit => (
                  <tr key={deposit.id}>
                    <td>{formatDate(deposit.fecha)}</td>
                    <td
                      style={{
                        fontFamily: "monospace",
                        color: "oklch(45% 0.02 250)",
                      }}
                    >
                      {deposit.numeroCuenta}
                    </td>
                    <td
                      style={{ fontWeight: 500, color: "oklch(20% 0.02 250)" }}
                    >
                      {deposit.nombreCliente}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: 600,
                        color: "oklch(20% 0.02 250)",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {formatCurrency(deposit.monto)}
                    </td>
                    <td>
                      <span className="table-badge">
                        {getDepositTypeLabel(deposit.tipoDeposito)}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.8125rem" }}>
                      {deposit.remito || "—"}
                    </td>
                    <td style={{ fontSize: "0.8125rem" }}>
                      {deposit.numeroBolsa || "—"}
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          onClick={() => handleEditClick(deposit)}
                          title="Editar depósito"
                          style={{
                            padding: "0.5rem",
                            color: "oklch(45% 0.02 250)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "0.375rem",
                            transition: "all 150ms",
                          }}
                          onMouseOver={e => (
                            (e.currentTarget.style.background =
                              "oklch(96% 0.01 250)"),
                            (e.currentTarget.style.color =
                              "oklch(20% 0.02 250)")
                          )}
                          onMouseOut={e => (
                            (e.currentTarget.style.background = "transparent"),
                            (e.currentTarget.style.color =
                              "oklch(45% 0.02 250)")
                          )}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(deposit)}
                          title="Eliminar depósito"
                          style={{
                            padding: "0.5rem",
                            color: "var(--destructive)",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            borderRadius: "0.375rem",
                            transition: "all 150ms",
                          }}
                          onMouseOver={e =>
                            (e.currentTarget.style.background =
                              "color-mix(in srgb, var(--destructive) 10%, transparent)")
                          }
                          onMouseOut={e =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Botones de acción */}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleExport}
              className="login-submit-btn"
              style={{ flex: 1, padding: "0 1.5rem" }}
            >
              <FileDown size={18} />
              <span>Generar Excel</span>
            </button>
            <button
              onClick={onClearAll}
              style={{
                flex: 1,
                padding: "0 1.5rem",
                height: "3rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                color: "oklch(40% 0.02 250)",
                background: "transparent",
                border: "1.5px solid oklch(88% 0.015 250)",
                borderRadius: "0.625rem",
                cursor: "pointer",
                transition: "all 200ms ease",
              }}
              onMouseOver={e =>
                (e.currentTarget.style.background = "oklch(96% 0.01 250)")
              }
              onMouseOut={e =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Limpiar Todo
            </button>
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
        depositInfo={
          deletingDeposit
            ? `${deletingDeposit.nombreCliente} (${deletingDeposit.numeroCuenta})`
            : undefined
        }
      />
    </div>
  );
}
