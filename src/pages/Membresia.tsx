import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Crown, Check, Gamepad2, Gift, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMembership } from "@/hooks/useMembership";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BENEFITS = [
  { icon: Gamepad2, text: "Acceso a los 3 juegos territoriales" },
  { icon: Gift, text: "Canje de pastes, café, comidas y hospedaje" },
  { icon: Sparkles, text: "Insignias exclusivas de habitante digital" },
  { icon: Crown, text: "Prioridad en sorteos de fin de semana" },
];

export default function Membresia() {
  const { isActive, status, currentPeriodEnd, refresh } = useMembership();
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();

  useEffect(() => {
    const s = params.get("status");
    if (s === "success") {
      toast.success("Procesando suscripción…");
      supabase.functions.invoke("membership-status").then(() => refresh());
    } else if (s === "cancel") {
      toast.info("Pago cancelado.");
    }
  }, [params, refresh]);

  const checkout = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("membership-checkout");
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    const url = (data as any)?.url;
    if (url) window.location.href = url;
  };

  const sync = async () => {
    setLoading(true);
    await supabase.functions.invoke("membership-status");
    await refresh();
    setLoading(false);
    toast.success("Estado actualizado");
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-3 text-center">
        <Badge className="bg-rdm-gold/15 text-rdm-gold border-rdm-gold/30 mx-auto">MEMBRESÍA HABITANTE DIGITAL</Badge>
        <h1 className="font-heritage text-4xl sm:text-5xl text-rdm-platinum">Conviértete en habitante digital</h1>
        <p className="text-rdm-fog/70 max-w-2xl mx-auto">Tu membresía sostiene el ecosistema RDM y te abre las puertas a juegos, recompensas y experiencias del territorio.</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="heritage-panel overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-rdm-copper via-rdm-gold to-rdm-silver"/>
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-heritage text-3xl text-rdm-platinum flex items-center justify-center gap-2">
              <Crown className="h-7 w-7 text-rdm-gold"/>Habitante Digital RDM
            </CardTitle>
            <CardDescription>Acceso completo · Cancela cuando quieras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-heritage text-rdm-gold">$129<span className="text-lg text-rdm-fog/60"> MXN</span></div>
              <div className="text-sm text-rdm-fog/60 mt-1">por mes</div>
            </div>

            <ul className="space-y-2.5">
              {BENEFITS.map(b => {
                const Icon = b.icon;
                return (
                  <li key={b.text} className="flex items-center gap-3 text-rdm-fog/85">
                    <span className="w-7 h-7 rounded-full bg-rdm-gold/15 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-rdm-gold"/>
                    </span>
                    <span className="text-sm">{b.text}</span>
                  </li>
                );
              })}
            </ul>

            {isActive ? (
              <div className="p-4 rounded-xl bg-rdm-pine/15 border border-rdm-pine/30 text-center">
                <Check className="h-6 w-6 text-rdm-warm mx-auto mb-1"/>
                <p className="text-rdm-warm font-semibold">Membresía activa</p>
                {currentPeriodEnd && <p className="text-xs text-rdm-fog/60 mt-1">Renueva el {new Date(currentPeriodEnd).toLocaleDateString()}</p>}
                <Button variant="outline" size="sm" className="mt-3" onClick={sync} disabled={loading}>
                  {loading ? <Loader2 className="h-3 w-3 animate-spin"/> : "Sincronizar estado"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button onClick={checkout} disabled={loading} className="w-full h-12 text-base btn-discover">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <>Activar por $129 MXN/mes</>}
                </Button>
                {status === "pending" && (
                  <Button variant="outline" size="sm" className="w-full" onClick={sync}>
                    Ya pagué · sincronizar
                  </Button>
                )}
                <p className="text-xs text-center text-rdm-fog/55">Pago seguro vía Stripe · puedes cancelar en cualquier momento.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
