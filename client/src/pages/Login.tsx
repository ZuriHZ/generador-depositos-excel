import { useState, type FormEvent } from "react";
import { useSignIn } from "@clerk/react/legacy";
import { useClerk } from "@clerk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

type Step = "credentials" | "verify";

export default function Login() {
  const { isLoaded, signIn } = useSignIn();
  const { setActive } = useClerk();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<Step>("credentials");

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
          await sendVerificationCode();
        } else {
          setFormError("Verificacion de contrasena fallida.");
        }
      } else if (result.status === "needs_client_trust") {
        await sendVerificationCode();
      } else if (result.status === "needs_second_factor") {
        setFormError("Se requiere verificacion en dos pasos. Contacta al administrador.");
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

  const sendVerificationCode = async () => {
    if (!signIn) return;
    try {
      const emailCodeFactor = signIn.supportedSecondFactors?.find(
        (f: any) => f.strategy === "email_code"
      );
      if (emailCodeFactor) {
        await signIn.prepareSecondFactor({ strategy: "email_code" });
        setStep("verify");
        setFormError(null);
      } else {
        setFormError("La verificacion por email no esta disponible.");
      }
    } catch (err: any) {
      setFormError(
        err?.errors?.[0]?.message ?? "No se pudo enviar el codigo de verificacion."
      );
    }
    setIsSubmitting(false);
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!signIn || isSubmitting || !code) return;
    setIsSubmitting(true);
    setFormError(null);

    try {
      const attempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });
      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        window.location.href = "/";
      } else {
        setFormError("Codigo de verificacion incorrecto.");
      }
    } catch (err: any) {
      setFormError(
        err?.errors?.[0]?.message ?? "Codigo de verificacion invalido."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="login-page">
        <div className="login-form-panel" style={{ flex: 1 }}>
          <div className="login-form-wrapper" style={{ alignItems: "center", justifyContent: "center" }}>
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

          {step === "credentials" ? (
            <>
              <div className="login-form-header">
                <h2 className="login-form-greeting">Iniciar sesion</h2>
                <p className="login-form-subtitle">
                  Accede al generador de depositos
                </p>
              </div>

              <form onSubmit={handleCredentials} className="login-form">
                <div className="login-field-group">
                  <label htmlFor="email" className="login-field-label">Email</label>
                  <div className="login-field-input-wrap">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      autoComplete="email"
                      disabled={isSubmitting}
                      className="login-field-input"
                    />
                    <span className="login-field-focus-line" data-focused={email ? "true" : undefined} />
                  </div>
                </div>

                <div className="login-field-group">
                  <label htmlFor="password" className="login-field-label">Contrasena</label>
                  <div className="login-field-input-wrap">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      required
                      autoComplete="current-password"
                      disabled={isSubmitting}
                      className="login-field-input"
                    />
                    <span className="login-field-focus-line" data-focused={password ? "true" : undefined} />
                  </div>
                </div>

                {formError && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-destructive text-sm">
                    {formError}
                  </div>
                )}

                <div className="login-submit-wrap">
                  <Button type="submit" disabled={isSubmitting || !email || !password} className="login-submit-btn">
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
            </>
          ) : (
            <>
              <div className="login-form-header">
                <h2 className="login-form-greeting">Verificar identidad</h2>
                <p className="login-form-subtitle">
                  Ingresa el codigo enviado a <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerify} className="login-form">
                <div className="login-field-group">
                  <label htmlFor="code" className="login-field-label">Codigo de verificacion</label>
                  <div className="login-field-input-wrap">
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="000000"
                      required
                      autoComplete="one-time-code"
                      disabled={isSubmitting}
                      className="login-field-input"
                    />
                    <span className="login-field-focus-line" data-focused={code ? "true" : undefined} />
                  </div>
                </div>

                {formError && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-destructive text-sm">
                    {formError}
                  </div>
                )}

                <div className="login-submit-wrap">
                  <Button type="submit" disabled={isSubmitting || !code} className="login-submit-btn">
                    {isSubmitting ? (
                      <>
                        <Spinner className="size-4" />
                        <span>Verificando...</span>
                      </>
                    ) : (
                      <span>Verificar</span>
                    )}
                  </Button>
                </div>

                <p style={{ textAlign: "center", marginTop: 12 }}>
                  <button
                    type="button"
                    onClick={() => { setStep("credentials"); setFormError(null); }}
                    style={{ color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
                  >
                    Volver al inicio de sesion
                  </button>
                </p>
              </form>
            </>
          )}

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
