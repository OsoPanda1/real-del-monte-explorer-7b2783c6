import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";
import { supabase } from "@/integrations/supabase/client";
import Confetti from "@/components/Confetti";
import { Sparkles, Store, Shield, Heart, Compass, Crown, Flame, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const ICONS: Record<string, any> = { sparkles: Sparkles, store: Store, shield: Shield, heart: Heart, compass: Compass, crown: Crown, flame: Flame };

interface Badge { id: string; name: string; description: string; icon: string; required_xp: number; rarity: string; }
interface LeaderRow { user_id: string; xp: number; level: number; display_name: string | null; }

export default function Logros() {
  const { user } = useAuth();
  const { points, badges, award, showConfetti } = useGamification();
  const [catalog, setCatalog] = useState<Badge[]>([]);
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);

  useEffect(() => {
    supabase.from("gamification_badges").select("*").order("required_xp").then(({ data }) => setCatalog((data as Badge[]) ?? []));
    (async () => {
      const { data: pts } = await supabase.from("gamification_points").select("user_id,xp,level").order("xp", { ascending: false }).limit(20);
      if (!pts) return;
      const ids = pts.map((p) => p.user_id);
      const { data: profs } = await supabase.from("profiles").select("id,display_name").in("id", ids);
      const map = new Map(profs?.map((p) => [p.id, p.display_name]));
      setLeaders(pts.map((p) => ({ ...p, display_name: map.get(p.user_id) ?? null })));
    })();
  }, []);

  const xp = points?.xp ?? 0;
  const level = points?.level ?? 1;
  const xpInLevel = xp % 500;
  const pct = Math.min(100, (xpInLevel / 500) * 100);
  const ownedSet = new Set(badges.map((b) => b.badge_id));

  return (
    <div className="min-h-screen bg-background pb-24">
      {showConfetti && <Confetti />}
      <PageHero eyebrow="GAMIFICACIÓN" title="Logros y nivel" subtitle="Tu progreso en el Nodo Cero." />

      <div className="container mx-auto px-4 mt-8 space-y-8">
        {!user ? (
          <Card><CardContent className="py-10 text-center space-y-3">
            <Trophy className="h-10 w-10 mx-auto text-muted-foreground" />
            <p>Inicia sesión para ver tu progreso.</p>
            <Button asChild><Link to="/auth">Entrar</Link></Button>
          </CardContent></Card>
        ) : (
          <>
            <Card className="overflow-hidden">
              <CardContent className="py-8 px-6 relative">
                <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Tu nivel</p>
                    <h2 className="text-5xl font-display flex items-center gap-3">
                      <span className="animate-glow inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground">
                        {level}
                      </span>
                      <span className="text-2xl text-muted-foreground">{xp} XP totales</span>
                    </h2>
                  </div>
                  <Button variant="outline" onClick={() => award("test_action", 25)}>
                    <Zap className="h-4 w-4 mr-1" /> +25 XP demo
                  </Button>
                </div>
                <div className="xp-bar" style={{ ["--progress-target" as any]: `${pct}%` }}>
                  <div className="xp-fill" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{xpInLevel} / 500 al nivel {level + 1}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary" />Medallas</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {catalog.map((b, i) => {
                  const Icon = ICONS[b.icon] ?? Sparkles;
                  const owned = ownedSet.has(b.id);
                  return (
                    <div key={b.id}
                      className={`badge-tile ${owned ? "unlocked" : "locked"}`}
                      style={{ animationDelay: `${i * 60}ms`, animation: owned ? "badge-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" : undefined }}
                      title={`${b.name} — ${b.description}`}>
                      <Icon className="h-8 w-8 mb-1 text-primary" />
                      <p className="text-[10px] text-center font-medium leading-tight">{b.name}</p>
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{b.rarity}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                {leaders.length === 0 ? (
                  <p className="py-6 text-center text-muted-foreground">Aún no hay puntajes registrados.</p>
                ) : leaders.map((l, i) => (
                  <div key={l.user_id} className="flex items-center justify-between py-3 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl w-6 text-muted-foreground">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium">{l.display_name ?? l.user_id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">Nivel {l.level}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm">{l.xp} XP</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
