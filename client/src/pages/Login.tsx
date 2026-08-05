import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useClerk, useUser } from "@clerk/react";
import { useSignIn } from "@clerk/react/legacy";
import { type FormEvent, useEffect, useState } from "react";

// Credenciales de la cuenta demo (creada en Clerk solo para que
// reclutadores prueben la app). La cuenta admin real no se expone.
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "DemoAcceso2026!";

export default function Login() {
  const { isLoaded, signIn } = useSignIn();
  const { setActive } = useClerk();
  const { isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.href = "/";
    }
  }, [isLoaded, isSignedIn]);

  const doLogin = async (identifier: string, pwd: string) => {
    if (!isLoaded || isSubmitting || !signIn) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await signIn.create({
        identifier,
        password: pwd,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      } else if (result.status === "needs_first_factor") {
        const attempt = await signIn.attemptFirstFactor({
          strategy: "password",
          password: pwd,
        });
        if (attempt.status === "complete") {
          await setActive({ session: attempt.createdSessionId });
          window.location.href = "/";
        } else if (attempt.status === "needs_client_trust") {
          setFormError(
            "Se requiere verificacion adicional. Contacta al administrador para desactivar la verificacion por email en Clerk."
          );
        } else {
          setFormError("Verificacion de contrasena fallida.");
        }
      } else if (result.status === "needs_client_trust") {
        setFormError(
          "Se requiere verificacion adicional. Contacta al administrador para desactivar la verificacion por email en Clerk."
        );
      } else if (result.status === "needs_second_factor") {
        setFormError(
          "Se requiere verificacion en dos pasos. Contacta al administrador."
        );
      } else {
        setFormError(
          `Estado inesperado: ${result.status}. Contacta al administrador.`
        );
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        err?.message ??
        "Error al iniciar sesion. Verifica tus credenciales.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCredentials = (e: FormEvent) => {
    e.preventDefault();
    doLogin(email, password);
  };

  const handleDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    doLogin(DEMO_EMAIL, DEMO_PASSWORD);
  };

  if (!isLoaded) {
    return (
      <div className="login-page">
        <div className="login-form-panel" style={{ flex: 1 }}>
          <div
            className="login-form-wrapper"
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Spinner className="size-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {/* ---- Brand Panel ---- */}
      <div className="login-brand-panel">
        <div className="login-brand-logo">
          <div className="login-brand-logo-mark">
            <div className="login-brand-logo-icon">$</div>
            <span className="login-brand-logo-text">Depositos</span>
          </div>
        </div>

        <div className="login-brand-content">
          <h1 className="login-brand-headline">
            Automatiza la gestion de tus <em>depositos bancarios</em>
          </h1>
          <p className="login-brand-description">
            Genera archivos Excel listos para el banco en segundos. Sin errores
            manuales, sin demoras.
          </p>

          <div className="login-brand-ledger" aria-hidden="true">
            <div className="login-brand-ledger-row">
              <span>DEP. 001</span>
              <span>$ 1.250,00</span>
            </div>
            <div className="login-brand-ledger-row">
              <span>DEP. 002</span>
              <span>$ 3.400,00</span>
            </div>
            <div className="login-brand-ledger-row">
              <span>DEP. 003</span>
              <span>$ 2.800,00</span>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          &copy; {new Date().getFullYear()} Generador de Depositos
        </div>
      </div>

      {/* ---- Form Panel ---- */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-mobile-brand">
            <div className="login-mobile-brand-icon">$</div>
            <span className="login-mobile-brand-text">Depositos</span>
          </div>

          <div className="login-form-header">
            <h2 className="login-form-greeting">Iniciar sesion</h2>
            <p className="login-form-subtitle">
              Accede al generador de depositos
            </p>
          </div>

          <form onSubmit={handleCredentials} className="login-form">
            <div className="login-field-group">
              <label htmlFor="email" className="login-field-label">
                Email
              </label>
              <div className="login-field-input-wrap">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Escribe tu correo electronico"
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="login-field-input"
                />
                <span
                  className="login-field-focus-line"
                  data-focused={email ? "true" : undefined}
                />
              </div>
            </div>

            <div className="login-field-group">
              <label htmlFor="password" className="login-field-label">
                Contraseña
              </label>
              <div className="login-field-input-wrap">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Escribe tu contrasena"
                  required
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="login-field-input"
                />
                <span
                  className="login-field-focus-line"
                  data-focused={password ? "true" : undefined}
                />
              </div>
            </div>

            {formError && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-destructive text-sm">
                {formError}
              </div>
            )}

            <div className="login-submit-wrap">
              <Button
                type="submit"
                disabled={isSubmitting || !email || !password}
                className="login-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Spinner className="size-4" />
                    <span>Ingresando...</span>
                  </>
                ) : (
                  <span>Ingresar</span>
                )}
              </Button>
            </div>
          </form>

          <div className="login-demo-sep">
            <span>o</span>
          </div>

          <Button
            type="button"
            onClick={handleDemo}
            disabled={isSubmitting}
            className="login-demo-btn"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                <span>Entrando como demo...</span>
              </>
            ) : (
              <span>Probar como demo</span>
            )}
          </Button>
          <p className="login-demo-hint">
            Accede sin registrarte para explorar la app
          </p>

          <footer className="login-form-footer">
            <span className="login-form-footer-sep" />
            <p style={{ margin: 0 }}>
              &copy; {new Date().getFullYear()} Generador de Depositos
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
