import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { copyToClipboard } from "@/lib/copy-text";
import { useClerk } from "@clerk/react";
import { useSignIn } from "@clerk/react/legacy";
import { type FormEvent, useState } from "react";

export default function Login() {
  const { isLoaded, signIn } = useSignIn();
  const { setActive } = useClerk();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopyingPassword, setIsCopyingPassword] = useState(false);
  const [isCopyingEmail, setIsCopyingEmail] = useState(false);

  const handleCredentials = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || isSubmitting || !signIn) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        window.location.href = "/";
      } else if (result.status === "needs_first_factor") {
        const attempt = await signIn.attemptFirstFactor({
          strategy: "password",
          password,
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

  const textToCopyPassword = "52qq82j9";
  const textToCopyEmail = "admin@example.com";

  const handleCopyPassword = () =>
    copyToClipboard(textToCopyPassword, setIsCopyingPassword);

  const handleCopyEmail = () =>
    copyToClipboard(textToCopyEmail, setIsCopyingEmail);

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
                <div
                  onCopy={() =>
                    navigator.clipboard.writeText("admin@example.com")
                  }
                  className="gap-2 flex items-center"
                >
                  admin@example.com
                  <button
                    type="button"
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 transition"
                    onClick={handleCopyEmail}
                  >
                    {isCopyingEmail ? "copiado" : "copiar"}
                  </button>
                </div>
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
                <div className="flex items-center gap-2">
                  <code className="rounded bg-gray-100 px-2 py-1 font-mono">
                    {textToCopyPassword}
                  </code>

                  <button
                    type="button"
                    onClick={handleCopyPassword}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700 transition"
                  >
                    {isCopyingPassword ? "copiado" : "copiar"}
                  </button>
                </div>
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
