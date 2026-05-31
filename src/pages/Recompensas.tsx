import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Coins, Check, Lock, Sparkles, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useMembership } from "@/hooks/useMembership";
import { useCoins } from "@/hooks/useCoins";
import { toast } from "sonner";

type Reward = { id: string; name: string; description: string; cost_coins: number; category: string; partner: string; };
type Redemption = { id: string; reward_id: string; status: string; redemption_code: string; created_at: string; };

const CATEGORY_LABEL: Record<string, string> = {
  gastronomia: "Gastronomía", hospedaje: "Hospedaje", experiencia: "Experiencia",
};

export default function Recompensas() {
  const { isActive } = useMembership();
  const { balance, refresh } = useCoins();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [confirm, setConfirm] = useState<Reward | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const loadAll = async () => {
    const [{ data: r }, { data: red }] = await Promise.all([
      supabase.from("rewards").select("*").eq("active", true).order("cost_coins"),
      supabase.from("reward_redemptions").select("id,reward_id,status,redemption_code,created_at").order("created_at", { ascending: false }).limit(10),
    ]);
    setRewards(r ?? []); setRedemptions(red ?? []);
  };
  useEffect(() => { loadAll(); }, []);

  const redeem = async (r: Reward) => {
    const { data, error } = await supabase.rpc("redeem_reward", { _reward_id: r.id });
    if (error) {
      const msg = error.message.includes("membership_required") ? "Necesitas membresía activa." :
                  error.message.includes("insufficient_coins") ? "Monedas insuficientes." :
                  error.message;
      toast.error(msg); setConfirm(null); return;
    }
    const result = data as any;
    setCode(result.code); setConfirm(null);
    refresh(); loadAll();
    toast.success(`Canje exitoso: ${result.reward}`);
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-3">
        <Badge className="bg-rdm-gold/15 text-rdm-gold border-rdm-gold/30">RECOMPENSAS REALES</Badge>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heritage text-4xl sm:text-5xl text-rdm-platinum">Canjea tus monedas RDM</h1>
            <p className="text-rdm-fog/70 mt-2 max-w-2xl">Pastes, café, comidas y noches en Real del Monte por jugar.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-rdm-gold/20 to-rdm-copper/10 border border-rdm-gold/30">
            <Coins className="h-5 w-5 text-rdm-gold"/>
            <div>
              <div className="text-xs text-rdm-fog/60 uppercase tracking-wider">Saldo</div>
              <div className="text-xl font-bold text-rdm-gold">{balance} monedas</div>
            </div>
          </div>
        </div>
      </header>

      {!isActive && (
        <Card className="border-rdm-gold/30 bg-gradient-to-br from-rdm-gold/8 to-transparent">
          <CardContent className="p-5 flex items-center gap-4">
            <Lock className="h-6 w-6 text-rdm-gold"/>
            <p className="flex-1 text-sm text-rdm-fog/80">Necesitas membresía activa para canjear recompensas.</p>
            <Button asChild size="sm"><Link to="/membresia">Activar</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((r, i) => {
          const affordable = balance >= r.cost_coins;
          return (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className="discovery-card h-full flex flex-col border-white/10 bg-white/3">
                <CardHeader>
                  <Badge variant="outline" className="w-fit text-[10px] uppercase tracking-wider text-rdm-amber border-rdm-amber/30">{CATEGORY_LABEL[r.category] ?? r.category}</Badge>
                  <CardTitle className="font-heritage text-xl text-rdm-platinum mt-2">{r.name}</CardTitle>
                  <CardDescription className="text-rdm-fog/70">{r.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-xs text-rdm-fog/55">Aliado: <span className="text-rdm-fog/80">{r.partner}</span></p>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-rdm-gold font-bold">
                    <Coins className="h-4 w-4"/>{r.cost_coins}
                  </div>
                  <Button
                    size="sm"
                    disabled={!isActive || !affordable}
                    onClick={() => setConfirm(r)}
                    variant={affordable && isActive ? "default" : "outline"}
                  >
                    {!isActive ? "Bloqueado" : affordable ? "Canjear" : "Faltan monedas"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {redemptions.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heritage text-2xl text-rdm-platinum flex items-center gap-2"><Clock className="h-5 w-5 text-rdm-fog/60"/>Mis canjes recientes</h2>
          <div className="space-y-2">
            {redemptions.map(rd => {
              const reward = rewards.find(r => r.id === rd.reward_id);
              return (
                <div key={rd.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/8">
                  <div>
                    <p className="text-sm text-rdm-platinum">{reward?.name ?? "Recompensa"}</p>
                    <p className="text-xs text-rdm-fog/50">{new Date(rd.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-xs font-mono px-2 py-1 rounded bg-rdm-gold/10 text-rdm-gold">{rd.redemption_code}</code>
                    <Badge variant={rd.status === "fulfilled" ? "default" : "outline"}>{rd.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heritage text-2xl">Confirmar canje</DialogTitle>
            <DialogDescription>
              ¿Canjear <strong className="text-rdm-gold">{confirm?.name}</strong> por {confirm?.cost_coins} monedas?
              Tu saldo quedará en {balance - (confirm?.cost_coins ?? 0)}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirm(null)}>Cancelar</Button>
            <Button onClick={() => confirm && redeem(confirm)}>Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!code} onOpenChange={(o) => !o && setCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heritage text-2xl flex items-center gap-2"><Sparkles className="h-5 w-5 text-rdm-gold"/>¡Canje exitoso!</DialogTitle>
            <DialogDescription>Muestra este código al aliado para reclamar tu recompensa:</DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="text-3xl font-mono font-bold text-rdm-gold tracking-widest">{code}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
