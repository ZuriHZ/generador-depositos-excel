import { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import DepositForm from '@/components/DepositForm';
import DepositTable from '@/components/DepositTable';
import { useDeposits, DepositFormData, ValidationErrors } from '@/hooks/useDeposits';
import { toast } from 'sonner';
import { DollarSign, LogOut } from 'lucide-react';
import { getLoginUrl } from '@/const';

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
  const { deposits, addDeposit, removeDeposit, clearAllDeposits, editDeposit } = useDeposits();
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg bg-primary flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: 'var(--font-poppins)' }}>
            Generador de Depósitos
          </h1>
          <p className="text-muted-foreground mb-8">Inicia sesión para continuar</p>
          <a
            href={getLoginUrl()}
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            style={{ fontFamily: 'var(--font-poppins)' }}
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  const handleAddDeposit = (data: DepositFormData) => {
    setIsLoading(true);
    
    // Simular pequeño delay para feedback visual
    setTimeout(() => {
      const result = addDeposit(data);
      
      if (result.success) {
        toast.success('Depósito agregado exitosamente');
      } else if (result.errors) {
        // Mostrar primer error
        const firstError = Object.values(result.errors)[0];
        if (firstError) {
          toast.error(firstError);
        }
      }
      
      setIsLoading(false);
    }, 300);
  };

  const handleRemoveDeposit = (id: string) => {
    removeDeposit(id);
    toast.success('Depósito eliminado');
  };

  const handleClearAll = () => {
    if (deposits.length === 0) {
      toast.info('No hay depósitos para limpiar');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los depósitos?')) {
      clearAllDeposits();
      toast.success('Todos los depósitos han sido eliminados');
    }
  };

  const handleEditDeposit = (id: string, data: DepositFormData) => {
    const result = editDeposit(id, data);
    if (!result.success && result.errors) {
      const firstError = Object.values(result.errors)[0];
      if (firstError) {
        toast.error(firstError);
      }
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
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-poppins)' }}>
                  Generador de Depósitos
                </h1>
                <p className="text-sm text-muted-foreground">
                  Crea y exporta depósitos bancarios a Excel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.name || user?.email}</span>
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
          <div className="lg:col-span-3">
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
            © {new Date().getFullYear()} Generador de Depósitos Bancarios. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
