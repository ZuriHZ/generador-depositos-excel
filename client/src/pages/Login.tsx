import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.success("Sesión iniciada correctamente");
      setLocation("/");
      window.location.href = "/";
    },
    onError: error => {
      toast.error(error.message || "Error al iniciar sesión");
      setIsLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    setIsLoading(true);
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="login-page">
      {/* ---- Brand Panel ---- */}
      <div className="login-brand-panel">
        <div className="login-brand-logo">
          <div className="login-brand-logo-mark">
            <div className="login-brand-logo-icon">$</div>
            <span className="login-brand-logo-text">Depósitos</span>
          </div>
        </div>

        <div className="login-brand-content">
          <h1 className="login-brand-headline">
            Automatiza la gestión de tus <em>depósitos bancarios</em>
          </h1>
          <p className="login-brand-description">
            Genera archivos Excel listos para el banco en segundos. Sin errores
            manuales, sin demoras.
          </p>
        </div>

        <div className="login-brand-footer">
          © {new Date().getFullYear()} Generador de Depósitos
        </div>
      </div>

      {/* ---- Form Panel ---- */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          {/* Mobile brand */}
          <div className="login-mobile-brand">
            <div className="login-mobile-brand-icon">$</div>
            <span className="login-mobile-brand-text">Depósitos</span>
          </div>

          <header className="login-form-header">
            <h2 className="login-form-greeting">Bienvenido de nuevo</h2>
            <p className="login-form-subtitle">
              Ingresa tus credenciales para continuar
            </p>
          </header>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field-group">
              <label htmlFor="email" className="login-field-label">
                Correo electrónico
              </label>
              <div className="login-field-input-wrap">
                <input
                  id="email"
                  type="email"
                  placeholder="admin@ejemplo.com"
                  className="login-field-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
                <div
                  className="login-field-focus-line"
                  data-focused={focusedField === "email"}
                />
              </div>
            </div>

            <div className="login-field-group">
              <label htmlFor="password" className="login-field-label">
                Contraseña
              </label>
              <div className="login-field-input-wrap">
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="login-field-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                />
                <div
                  className="login-field-focus-line"
                  data-focused={focusedField === "password"}
                />
              </div>
            </div>

            <div className="login-submit-wrap">
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
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </div>
          </form>

          <footer className="login-form-footer">
            <span className="login-form-footer-sep" />
            <p style={{ margin: 0 }}>
              © {new Date().getFullYear()} Generador de Depósitos
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
