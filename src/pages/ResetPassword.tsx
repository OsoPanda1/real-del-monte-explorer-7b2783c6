import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // El usuario llega con type=recovery en hash; supabase-js lo procesa automáticamente.
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => { if (session) setReady(true); });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    if (password !== confirm) { toast.error("Las contraseñas no coinciden"); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Contraseña actualizada");
    navigate("/auth");
  };

  return (
    <main>
      <PageHero eyebrow="SEGURIDAD" title="Restablecer contraseña" subtitle="Define una nueva contraseña para tu cuenta." />
      <section className="pb-32">
        <div className="narrative-column max-w-md">
          {!ready ? (
            <p className="text-center text-muted-foreground">Validando enlace…</p>
          ) : (
            <form onSubmit={submit} className="space-y-5 bg-card border border-border p-8 rounded-sm">
              <div>
                <Label htmlFor="pw">Nueva contraseña</Label>
                <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <div>
                <Label htmlFor="pw2">Confirmar</Label>
                <Input id="pw2" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "…" : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
