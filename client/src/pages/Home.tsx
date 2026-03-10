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
import { DollarSign, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";

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
  const { user, isAuthenticated, logout } = useAuth();
  const {
    deposits,
    addDeposit,
    removeDeposit,
    clearAllDeposits,
    editDeposit,
    isLoading,
  } = useDepositsWithDB();

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
    <div className="min-h-screen bg-background">
      {/* Encabezado */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Generador de Depósitos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Crea y exporta depósitos bancarios a Excel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Columna izquierda: Formulario (40%) */}
          <div className="lg:col-span-2">
            <DepositForm onSubmit={handleAddDeposit} isLoading={isLoading} />
          </div>

          {/* Columna derecha: Tabla (60%) */}
          <div className="flex">
            <DepositTable
              deposits={deposits}
              onRemove={handleRemoveDeposit}
              onClearAll={handleClearAll}
              onEdit={handleEditDeposit}
            />
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="bg-secondary border-t border-border mt-16">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Generador de Depósitos Bancarios. Todos
            los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
