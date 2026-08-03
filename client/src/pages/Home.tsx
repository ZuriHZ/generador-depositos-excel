import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DepositForm from "@/components/DepositForm";
import DepositTable from "@/components/DepositTable";
import {
  useDepositsWithDB,
  DepositFormData,
  ValidationErrors,
} from "@/hooks/useDepositsWithDB";
import { toast } from "sonner";
import { DollarSign } from "lucide-react";
import { getLoginUrl } from "@/const";
import { UserButton } from "@clerk/react";

/**
 * Página principal del Generador de Excel para Depósitos Bancarios
 *
 * Diseño: Corporativo Minimalista
 * - Layout de dos columnas: formulario (40%) | tabla (60%)
 * - Paleta: Grises corporativos + Azul profesional (#0066CC)
 * - Tipografía: Poppins (títulos) + Inter (cuerpo)
 * - Transiciones suaves de 200ms
 */
export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const {
    deposits,
    addDeposit,
    removeDeposit,
    clearAllDeposits,
    editDeposit,
    isLoading,
  } = useDepositsWithDB();

  if (loading) {
    return (
      <div
        className="dashboard-page"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            animation:
              "loginFadeSlideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div className="dashboard-logo-icon loader-pulse">$</div>
          <p
            style={{
              marginTop: "1.5rem",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              color: "oklch(60% 0.02 250)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              fontSize: "0.8125rem",
            }}
          >
            Iniciando sistema...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="unauth-page">
        {/* ---- Brand Panel ---- */}
        <div className="unauth-brand-panel">
          <div className="unauth-brand-logo">
            <div className="unauth-brand-logo-mark">
              <div className="unauth-brand-logo-icon">$</div>
              <span className="unauth-brand-logo-text">Depósitos</span>
            </div>
          </div>

          <div className="unauth-brand-content">
            <h1 className="unauth-brand-headline">
              Genera tus reportes de <em>depósitos bancarios</em> en segundos
            </h1>
            <p className="unauth-brand-description">
              Crea archivos Excel listos para el banco, sin errores manuales y
              con trazabilidad completa.
            </p>

            <div className="unauth-features">
              <div className="unauth-feature">
                <span className="unauth-feature-marker" />
                <span className="unauth-feature-text">
                  Exportación inmediata a Excel
                </span>
              </div>
              <div className="unauth-feature">
                <span className="unauth-feature-marker" />
                <span className="unauth-feature-text">
                  Validación automática de datos
                </span>
              </div>
              <div className="unauth-feature">
                <span className="unauth-feature-marker" />
                <span className="unauth-feature-text">
                  Historial de depósitos en la nube
                </span>
              </div>
            </div>
          </div>

          <div className="unauth-brand-footer">
            © {new Date().getFullYear()} Generador de Depósitos
          </div>
        </div>

        {/* ---- CTA Panel ---- */}
        <div className="unauth-cta-panel">
          <div className="unauth-cta-wrapper">
            <div className="unauth-cta-icon-wrap">
              <DollarSign className="unauth-cta-icon" />
            </div>

            <h2 className="unauth-cta-title">Bienvenido</h2>
            <p className="unauth-cta-subtitle">
              Inicia sesión para acceder al panel de generación de depósitos
            </p>

            <a href={getLoginUrl()} className="unauth-cta-btn">
              <span>Iniciar Sesión</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>

            <div className="unauth-cta-footer-sep" />
            <p className="unauth-cta-footer-text">
              Acceso seguro con credenciales corporativas
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddDeposit = async (data: DepositFormData) => {
    const result = await addDeposit(data);

    if (result.success) {
      toast.success("Depósito agregado exitosamente");
    } else if (result.errors) {
      const firstError = Object.values(result.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
    }
  };

  const handleRemoveDeposit = async (id: number) => {
    await removeDeposit(id);
    toast.success("Depósito eliminado");
  };

  const handleClearAll = async () => {
    if (deposits.length === 0) {
      toast.info("No hay depósitos para limpiar");
      return;
    }

    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar todos los depósitos?"
      )
    ) {
      await clearAllDeposits();
      toast.success("Todos los depósitos han sido eliminados");
    }
  };

  const handleEditDeposit = async (id: number, data: DepositFormData) => {
    const result = await editDeposit(id, data);
    if (!result.success && result.errors) {
      const firstError = Object.values(result.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
    } else {
      toast.success("Depósito actualizado exitosamente");
    }
  };

  return (
    <div className="dashboard-page">
      {/* Encabezado */}
      <header className="dashboard-header h-12">
        <div className="dashboard-logo">
          <div className="dashboard-logo-icon">$</div>
          <span className="dashboard-logo-text">Depósitos</span>
        </div>
        <div className="dashboard-footer ">
          © {new Date().getFullYear()} Generador de Depósitos. Todos los
          derechos reservados.
        </div>
        <div className="dashboard-userinfo">
          <span className="dashboard-username">
            {user?.name || user?.email}
          </span>
          <UserButton />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="dashboard-main">
        {/* Columna izquierda: Formulario */}
        <div className="dashboard-form-col">
          <DepositForm onSubmit={handleAddDeposit} isLoading={isLoading} />
        </div>

        {/* Columna derecha: Tabla */}
        <div className="dashboard-table-col">
          <DepositTable
            deposits={deposits}
            onRemove={handleRemoveDeposit}
            onClearAll={handleClearAll}
            onEdit={handleEditDeposit}
          />
        </div>
      </main>
    </div>
  );
}
