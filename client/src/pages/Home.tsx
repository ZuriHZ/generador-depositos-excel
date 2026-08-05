import { UserButton, useUser } from "@clerk/react";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import DepositForm from "@/components/DepositForm";
import DepositTable from "@/components/DepositTable";
import { getLoginUrl } from "@/const";
import {
  DepositFormData,
  useDepositsWithDB,
} from "@/hooks/useDepositsWithDB";

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
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const { user, isAuthenticated, loading } = useAuth();
  const { isLoaded: clerkLoaded, isSignedIn } = useUser();
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

  if (clerkLoaded && !isSignedIn) {
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
                aria-hidden="true"
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
    <div className="ledger-page">
      {/* Título centrado */}
      <header className="ledger-header">
        <h1 className="ledger-title">Libro Contable</h1>
      </header>

      {/* Mobile: Tabs */}
      <div className="ledger-tabs-mobile">
        <button
          className={`ledger-tab ${activeTab === "form" ? "active" : ""}`}
          onClick={() => setActiveTab("form")}
        >
          Formulario
        </button>
        <button
          className={`ledger-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Historial
        </button>
      </div>

      {/* Contenido principal */}
      <main className="ledger-main">
        {/* Página izquierda: Formulario */}
        <section
          className={`ledger-page-left ${activeTab !== "form" ? "mobile-hidden" : ""}`}
        >
          <DepositForm onSubmit={handleAddDeposit} isLoading={isLoading} />

          {/* User avatar - debajo del formulario */}
          <div className="ledger-user-menu">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </section>

        {/* Gutter central (solo desktop) */}
        <div className="ledger-gutter" aria-hidden="true" />

        {/* Página derecha: Historial */}
        <section
          className={`ledger-page-right ${activeTab !== "history" ? "mobile-hidden" : ""}`}
        >
          <h2 className="ledger-section-title">Depósitos Ingresados</h2>
          <p className="ledger-deposit-count">
            {deposits.length}{" "}
            {deposits.length === 1 ? "depósito" : "depósitos"}
          </p>
          <DepositTable
            deposits={deposits}
            onRemove={handleRemoveDeposit}
            onClearAll={handleClearAll}
            onEdit={handleEditDeposit}
          />
        </section>
      </main>
    </div>
  );
}
