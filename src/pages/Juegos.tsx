import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Gamepad2, Brain, Map, Coins, Trophy, Lock, Sparkles, Timer, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMembership } from "@/hooks/useMembership";
import { useCoins } from "@/hooks/useCoins";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Game = "memoria" | "trivia" | "ruta";

const GAMES: { id: Game; name: string; desc: string; icon: any; color: string; }[] = [
  { id: "memoria", name: "Memoria de las Minas", desc: "Empareja símbolos del patrimonio. Gana monedas por velocidad.", icon: Brain, color: "from-rdm-copper to-rdm-gold" },
  { id: "trivia", name: "Niebla de Real del Monte", desc: "Trivia cronometrada sobre historia, gastronomía y leyendas.", icon: Sparkles, color: "from-rdm-pine to-rdm-data" },
  { id: "ruta", name: "Ruta del Paste", desc: "Traza la ruta más corta por las panaderías antes que se enfríe.", icon: Map, color: "from-rdm-amber to-rdm-community" },
];

const MEMO_SYMBOLS = ["⛰️","⛏️","🥟","☕","🕯️","✝️","🌫️","🪙"];

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function MemoryGame({ onScore }: { onScore: (s: number) => void }) {
  const [deck, setDeck] = useState<{ sym: string; flipped: boolean; matched: boolean }[]>([]);
  const [picks, setPicks] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDeck(shuffle([...MEMO_SYMBOLS, ...MEMO_SYMBOLS]).map(sym => ({ sym, flipped: false, matched: false })));
    setStarted(Date.now()); setMoves(0); setDone(false); setPicks([]);
  }, []);

  const flip = (i: number) => {
    if (done || deck[i].flipped || deck[i].matched || picks.length === 2) return;
    const nd = deck.map((c, j) => j === i ? { ...c, flipped: true } : c);
    const np = [...picks, i];
    setDeck(nd); setPicks(np);
    if (np.length === 2) {
      setMoves(m => m + 1);
      setTimeout(() => {
        setDeck(d => {
          const [a, b] = np;
          if (d[a].sym === d[b].sym) {
            const updated = d.map((c, j) => j === a || j === b ? { ...c, matched: true } : c);
            if (updated.every(c => c.matched)) {
              const elapsed = Math.round((Date.now() - started) / 1000);
              const score = Math.max(50, 500 - elapsed * 3 - moves * 5);
              setDone(true);
              onScore(score);
            }
            return updated;
          }
          return d.map((c, j) => j === a || j === b ? { ...c, flipped: false } : c);
        });
        setPicks([]);
      }, 700);
    }
  };

  const reset = () => {
    setDeck(shuffle([...MEMO_SYMBOLS, ...MEMO_SYMBOLS]).map(sym => ({ sym, flipped: false, matched: false })));
    setStarted(Date.now()); setMoves(0); setDone(false); setPicks([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-rdm-fog/70">
        <span>Movimientos: <strong className="text-rdm-gold">{moves}</strong></span>
        <Button size="sm" variant="ghost" onClick={reset}><RotateCcw className="h-3 w-3 mr-1"/>Reiniciar</Button>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((c, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            onClick={() => flip(i)}
            className={`aspect-square rounded-xl text-2xl sm:text-3xl flex items-center justify-center transition-all ${
              c.matched ? "bg-rdm-pine/30 border border-rdm-pine/50" :
              c.flipped ? "bg-rdm-gold/15 border border-rdm-gold/40" :
              "bg-white/5 border border-white/10 hover:border-rdm-gold/30"
            }`}
          >{(c.flipped || c.matched) ? c.sym : "❔"}</motion.button>
        ))}
      </div>
    </div>
  );
}

function TriviaGame({ onScore }: { onScore: (s: number) => void }) {
  const [qs, setQs] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(15);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  useEffect(() => {
    supabase.from("trivia_questions").select("*").eq("active", true).limit(8)
      .then(({ data }) => setQs(shuffle(data ?? [])));
  }, []);

  useEffect(() => {
    if (done || qs.length === 0) return;
    setTime(15); setPicked(null);
    const t = setInterval(() => setTime(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [idx, qs.length, done]);

  useEffect(() => { if (time <= 0 && !picked) advance(false, 0); }, [time]);

  const advance = (correct: boolean, t: number) => {
    const gained = correct ? Math.round(50 + t * 5) : 0;
    setScore(s => s + gained);
    setTimeout(() => {
      if (idx + 1 >= qs.length) { setDone(true); onScore(score + gained); }
      else setIdx(i => i + 1);
    }, 600);
  };

  if (qs.length === 0) return <p className="text-rdm-fog/60">Cargando preguntas…</p>;
  if (done) return <div className="text-center py-8"><Trophy className="h-12 w-12 text-rdm-gold mx-auto mb-3"/><p className="text-2xl font-heritage text-rdm-platinum">Puntaje: {score}</p></div>;

  const q = qs[idx];
  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm">
        <span className="text-rdm-fog/70">Pregunta {idx + 1}/{qs.length}</span>
        <span className="text-rdm-candle font-semibold flex items-center gap-1"><Timer className="h-3.5 w-3.5"/>{time}s</span>
      </div>
      <p className="text-lg font-heritage text-rdm-platinum">{q.question}</p>
      <div className="grid gap-2">
        {(q.options as string[]).map((opt, i) => (
          <button
            key={i}
            disabled={picked !== null}
            onClick={() => { setPicked(i); advance(i === q.correct_index, time); }}
            className={`text-left px-4 py-3 rounded-xl border transition-all ${
              picked === null ? "bg-white/5 border-white/10 hover:border-rdm-gold/40 hover:bg-rdm-gold/5" :
              i === q.correct_index ? "bg-rdm-pine/25 border-rdm-pine/60 text-rdm-warm" :
              i === picked ? "bg-destructive/20 border-destructive/40" : "bg-white/3 border-white/10 opacity-50"
            }`}
          >{opt}</button>
        ))}
      </div>
    </div>
  );
}

function RouteGame({ onScore }: { onScore: (s: number) => void }) {
  const [stops, setStops] = useState<{ x: number; y: number; n: number; visited: boolean }[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [start] = useState(Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    const ps = Array.from({ length: 6 }, (_, i) => ({
      x: 40 + Math.random() * 260, y: 40 + Math.random() * 220, n: i + 1, visited: false,
    }));
    setStops(ps);
  }, []);

  const visit = (i: number) => {
    if (done) return;
    if (path.length && path[path.length - 1] === i) return;
    const next = [...path, i];
    setStops(s => s.map((p, j) => j === i ? { ...p, visited: true } : p));
    setPath(next);
    if (next.length === stops.length) {
      const t = Math.round((Date.now() - start) / 1000);
      const sc = Math.max(80, 600 - t * 8);
      setDone(true); onScore(sc);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-rdm-fog/70">Visita las {stops.length} panaderías en el menor tiempo posible.</p>
      <svg viewBox="0 0 340 280" className="w-full rounded-xl bg-rdm-night/60 border border-white/10">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,160,255,0.06)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="340" height="280" fill="url(#grid)"/>
        {path.length > 1 && (
          <polyline
            points={path.map(i => `${stops[i].x},${stops[i].y}`).join(" ")}
            fill="none" stroke="hsl(42 95% 70%)" strokeWidth="2" strokeDasharray="4 3" opacity="0.7"
          />
        )}
        {stops.map((p, i) => (
          <g key={i} onClick={() => visit(i)} className="cursor-pointer">
            <circle cx={p.x} cy={p.y} r="14" fill={p.visited ? "hsl(148 32% 24%)" : "hsl(220 20% 8%)"} stroke={p.visited ? "hsl(148 32% 50%)" : "hsl(42 68% 58%)"} strokeWidth="2"/>
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">{p.n}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Juegos() {
  const { isActive, loading: memLoading } = useMembership();
  const { refresh: refreshCoins } = useCoins();
  const [active, setActive] = useState<Game | null>(null);
  const [lastReward, setLastReward] = useState<{ coins: number; xp: number } | null>(null);

  const submit = async (game: Game, score: number) => {
    const { data, error } = await supabase.rpc("submit_game_score", { _game: game, _score: score });
    if (error) { toast.error(error.message); return; }
    const r = data as any;
    setLastReward({ coins: r.coins_earned, xp: r.xp_earned });
    refreshCoins();
    toast.success(`+${r.coins_earned} monedas RDM · +${r.xp_earned} XP`);
  };

  if (memLoading) return <div className="p-8 text-rdm-fog/60">Cargando…</div>;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-3">
        <Badge className="bg-rdm-gold/15 text-rdm-gold border-rdm-gold/30">JUEGOS TERRITORIALES</Badge>
        <h1 className="font-heritage text-4xl sm:text-5xl text-rdm-platinum">Juega · Gana monedas RDM</h1>
        <p className="text-rdm-fog/70 max-w-2xl">Cada partida te otorga monedas que canjeas por pastes, café, comidas o noches de hospedaje en Real del Monte.</p>
      </header>

      {!isActive && (
        <Card className="border-rdm-gold/30 bg-gradient-to-br from-rdm-gold/10 to-transparent">
          <CardContent className="p-6 flex items-center gap-4">
            <Lock className="h-8 w-8 text-rdm-gold shrink-0"/>
            <div className="flex-1">
              <p className="font-heritage text-xl text-rdm-platinum">Solo para habitantes digitales</p>
              <p className="text-sm text-rdm-fog/70">Activa tu membresía ($129 MXN/mes) para jugar y canjear premios reales.</p>
            </div>
            <Button asChild><Link to="/membresia">Activar membresía</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GAMES.map(g => {
          const Icon = g.icon;
          return (
            <motion.div key={g.id} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className={`overflow-hidden border-white/10 bg-white/3 backdrop-blur-sm cursor-pointer h-full ${!isActive && "opacity-60"}`}
                onClick={() => isActive && setActive(g.id)}>
                <div className={`h-2 bg-gradient-to-r ${g.color}`}/>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} flex items-center justify-center mb-2`}>
                    <Icon className="h-6 w-6 text-rdm-night"/>
                  </div>
                  <CardTitle className="font-heritage text-rdm-platinum">{g.name}</CardTitle>
                  <CardDescription className="text-rdm-fog/70">{g.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button disabled={!isActive} className="w-full" variant={active === g.id ? "default" : "outline"}>
                    {!isActive ? <><Lock className="h-3 w-3 mr-1"/>Bloqueado</> : "Jugar"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && isActive && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-rdm-gold/20 bg-rdm-night/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="font-heritage text-rdm-gold flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5"/>{GAMES.find(g => g.id === active)!.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {active === "memoria" && <MemoryGame onScore={(s) => submit("memoria", s)}/>}
                {active === "trivia" && <TriviaGame onScore={(s) => submit("trivia", s)}/>}
                {active === "ruta" && <RouteGame onScore={(s) => submit("ruta", s)}/>}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastReward && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-rdm-gold to-rdm-copper text-rdm-night px-6 py-4 rounded-2xl shadow-invitation"
            onAnimationComplete={() => setTimeout(() => setLastReward(null), 2500)}
          >
            <div className="flex items-center gap-3">
              <Coins className="h-6 w-6"/>
              <div>
                <div className="font-bold text-lg">+{lastReward.coins} monedas</div>
                <div className="text-xs opacity-80">+{lastReward.xp} XP</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
