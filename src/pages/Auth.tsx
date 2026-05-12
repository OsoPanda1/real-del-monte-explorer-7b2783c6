import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Correo inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
  displayName: z.string().trim().min(2, "Nombre muy corto").max(60).optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/directorio");
    });
  }, [navigate]);

  const signInGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/directorio` },
    });
    if (error) toast.error(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "forgot") {
        const ok = z.string().email().safeParse(email);
        if (!ok.success) { toast.error("Correo inválido"); return; }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Te enviamos un enlace para restablecer la contraseña.");
        setMode("signin");
        return;
      }

      const parsed = schema.safeParse({
        email, password, displayName: mode === "signup" ? displayName : undefined,
      });
      if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
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
    } finally { setSubmitting(false); }
  };

  return (
    <main>
      <PageHero
        eyebrow="ACCESO INSTITUCIONAL"
        title={mode === "signin" ? "Entrar al Nodo Cero" : mode === "signup" ? "Crear cuenta soberana" : "Recuperar contraseña"}
        subtitle="Comerciantes, ciudadanos y administradores municipales acceden al sistema operativo del territorio."
      />
      <section className="pb-32">
        <div className="narrative-column max-w-md">
          <Tabs value={mode === "forgot" ? "signin" : mode} onValueChange={(v) => setMode(v as any)} className="mb-4">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border p-8 rounded-sm">
            {mode === "signup" && (
              <div>
                <Label htmlFor="display_name">Nombre</Label>
                <Input id="display_name" value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Tu nombre o el de tu negocio" required maxLength={60} />
              </div>
            )}
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} required maxLength={255} />
            </div>
            {mode !== "forgot" && (
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={72} />
              </div>
            )}
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "…" : mode === "signin" ? "Entrar" : mode === "signup" ? "Crear cuenta" : "Enviar enlace"}
            </Button>

            {mode !== "forgot" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">o</span>
                  </div>
                </div>
                <Button type="button" variant="outline" onClick={signInGoogle} className="w-full">
                  Continuar con Google
                </Button>
              </>
            )}

            <button type="button" onClick={() => setMode("forgot")}
              className="block w-full text-center font-body italic text-sm text-muted-foreground hover:text-primary transition-colors">
              {mode === "forgot" ? "← Volver" : "¿Olvidaste tu contraseña?"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Auth;
