import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
  displayName: z.string().trim().min(2).max(60).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/directorio");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const parsed = schema.safeParse({ email, password, displayName: mode === "signup" ? displayName : undefined });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: displayName },
          },
        });
        if (error) throw error;
        toast.success("Cuenta creada. Revisa tu correo para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bienvenido al Nodo Cero");
        navigate("/directorio");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Error de autenticación");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <PageHero
        eyebrow="ACCESO INSTITUCIONAL"
        title={mode === "signin" ? "Entrar al Nodo Cero" : "Crear cuenta soberana"}
        subtitle="Comerciantes, ciudadanos y administradores municipales acceden al sistema operativo del territorio."
      />
      <section className="pb-32">
        <div className="narrative-column max-w-md">
          <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border p-8 rounded-sm">
            {mode === "signup" && (
              <div>
                <Label htmlFor="display_name">Nombre</Label>
                <Input
                  id="display_name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre o el de tu negocio"
                  required
                  maxLength={60}
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={72}
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "…" : mode === "signin" ? "Entrar" : "Crear cuenta"}
            </Button>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="block w-full text-center font-body italic text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {mode === "signin"
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Entra"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Auth;
