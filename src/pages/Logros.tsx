import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/useGamification";
import { supabase } from "@/integrations/supabase/client";
import Confetti from "@/components/Confetti";
import {
  Sparkles,
  Store,
  Shield,
  Heart,
  Compass,
  Crown,
  Flame,
  Trophy,
  Zap,
  TrendingUp,
  Award,
  Star,
  Medal,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const ICONS: Record<string, any> = {
  sparkles: Sparkles,
  store: Store,
  shield: Shield,
  heart: Heart,
  compass: Compass,
  crown: Crown,
  flame: Flame,
  award: Award,
  star: Star,
  medal: Medal,
};

const RARITY_STYLES: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  common: {
    bg: "bg-rdm-fog/10",
    border: "border-rdm-fog/30",
    glow: "shadow-[0_0_15px_rgba(255,255,255,0.1)]",
    text: "text-rdm-fog/70",
  },
  rare: {
    bg: "bg-rdm-oxygen/10",
    border: "border-rdm-oxygen/40",
    glow: "shadow-[0_0_20px_rgba(0,160,255,0.3)]",
    text: "text-rdm-oxygen",
  },
  epic: {
    bg: "bg-rdm-gold/10",
    border: "border-rdm-gold/50",
    glow: "shadow-[0_0_25px_rgba(212,178,106,0.4)]",
    text: "text-rdm-gold",
  },
  legendary: {
    bg: "bg-gradient-to-br from-rdm-gold/20 via-rdm-candle/20 to-rdm-copper/20",
    border: "border-rdm-gold/70",
    glow: "shadow-[0_0_30px_rgba(212,178,106,0.5)] animate-pulse",
    text: "bg-gradient-to-r from-rdm-gold via-rdm-candle to-rdm-gold bg-clip-text text-transparent",
  },
};

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  required_xp: number;
  rarity: string;
}

interface LeaderRow {
  user_id: string;
  xp: number;
  level: number;
  display_name: string | null;
}

const CircularProgress = ({ progress, level }: { progress: number; level: number }) => (
  <div className="relative w-48 h-48 mx-auto">
    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
      <circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        className="text-rdm-night/50"
      />
      <motion.circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={534}
        initial={{ strokeDashoffset: 534 }}
        animate={{ strokeDashoffset: 534 - (534 * progress) / 100 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(212, 178, 106)" />
          <stop offset="50%" stopColor="rgb(0, 160, 255)" />
          <stop offset="100%" stopColor="rgb(255, 193, 7)" />
        </linearGradient>
      </defs>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-6xl font-display font-bold bg-gradient-to-br from-rdm-gold via-rdm-oxygen to-rdm-candle bg-clip-text text-transparent"
        >
          {level}
        </motion.div>
        <p className="text-xs text-rdm-fog/60 uppercase tracking-widest mt-1">Nivel</p>
      </div>
    </div>
  </div>
);

const BadgeTile = ({
  badge,
  owned,
  index,
}: {
  badge: BadgeData;
  owned: boolean;
  index: number;
}) => {
  const Icon = ICONS[badge.icon] ?? Sparkles;
  const rarity = RARITY_STYLES[badge.rarity.toLowerCase()] ?? RARITY_STYLES.common;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={owned ? { scale: 1.05, y: -4 } : {}}
      className={cn(
        "relative group p-4 rounded-2xl border-2 backdrop-blur-sm transition-all duration-300",
        "flex flex-col items-center justify-center gap-2 aspect-square",
        owned
          ? cn(rarity.bg, rarity.border, rarity.glow, "cursor-pointer")
          : "bg-rdm-night/30 border-rdm-night/50 opacity-40 grayscale",
      )}
      title={owned ? `${badge.name} — ${badge.description}` : "Bloqueado"}
    >
      {owned && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.05 + 0.2, type: "spring", stiffness: 200 }}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rdm-gold flex items-center justify-center shadow-lg"
        >
          <Award className="w-3 h-3 text-rdm-night" />
        </motion.div>
      )}

      <Icon className={cn("w-10 h-10 transition-transform duration-300", owned && "group-hover:scale-110")} />

      <div className="text-center space-y-1">
        <p className="text-xs font-semibold leading-tight line-clamp-2">{badge.name}</p>
        <Badge variant="outline" className={cn("text-[9px] uppercase", rarity.text)}>
          {badge.rarity}
        </Badge>
      </div>

      {!owned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Shield className="w-8 h-8 text-rdm-fog/20" />
        </div>
      )}
    </motion.div>
  );
};

const LeaderboardRow = ({ leader, index, isCurrentUser }: { leader: LeaderRow; index: number; isCurrentUser: boolean }) => {
  const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        "flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-300",
        isCurrentUser
          ? "bg-gradient-to-r from-rdm-gold/20 to-rdm-oxygen/20 border-2 border-rdm-gold/40 shadow-lg"
          : "bg-rdm-night/30 hover:bg-rdm-night/50",
        index < 3 && "relative overflow-hidden",
      )}
    >
      {index < 3 && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rdm-gold/5 to-transparent animate-shimmer" />
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full font-display text-lg font-bold",
            index < 3
              ? "bg-gradient-to-br from-rdm-gold to-rdm-copper text-rdm-night shadow-md"
              : "bg-rdm-night/50 text-rdm-fog/60",
          )}
        >
          {medal || index + 1}
        </div>

        <div>
          <p className="font-semibold text-sm flex items-center gap-2">
            {leader.display_name ?? leader.user_id.slice(0, 8)}
            {isCurrentUser && (
              <Badge variant="outline" className="text-[9px] bg-rdm-gold/20 border-rdm-gold/40">
                TÚ
              </Badge>
            )}
          </p>
          <p className="text-xs text-rdm-fog/60 flex items-center gap-2">
            <Target className="w-3 h-3" />
            Nivel {leader.level}
          </p>
        </div>
      </div>

      <div className="text-right relative z-10">
        <p className="font-mono text-lg font-bold bg-gradient-to-r from-rdm-gold to-rdm-oxygen bg-clip-text text-transparent">
          {leader.xp.toLocaleString()}
        </p>
        <p className="text-[10px] text-rdm-fog/50 uppercase tracking-wider">XP</p>
      </div>
    </motion.div>
  );
};

export default function Logros() {
  const { user } = useAuth();
  const { points, badges, award, showConfetti } = useGamification();
  const [catalog, setCatalog] = useState<BadgeData[]>([]);
  const [leaders, setLeaders] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: badgeData } = await supabase
        .from("gamification_badges")
        .select("*")
        .order("required_xp");
      setCatalog((badgeData as BadgeData[]) ?? []);

      const { data: pointsData } = await supabase
        .from("gamification_points")
        .select("user_id,xp,level")
        .order("xp", { ascending: false })
        .limit(20);

      if (pointsData) {
        const ids = pointsData.map((p) => p.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id,display_name")
          .in("id", ids);

        const profileMap = new Map(profiles?.map((p) => [p.id, p.display_name]));
        setLeaders(
          pointsData.map((p) => ({
            ...p,
            display_name: profileMap.get(p.user_id) ?? null,
          })),
        );
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const xp = points?.xp ?? 0;
  const level = points?.level ?? 1;
  const xpInLevel = xp % 500;
  const progressPercent = Math.min(100, (xpInLevel / 500) * 100);
  const ownedSet = new Set(badges.map((b) => b.badge_id));

  const unlockedCount = catalog.filter((b) => ownedSet.has(b.id)).length;
  const totalCount = catalog.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      <PageHero
        eyebrow="GAMIFICACIÓN · NODO CERO"
        title="Logros y Experiencia"
        subtitle="Tu progreso en el territorio inteligente de Real del Monte"
        variant="governance"
        backgroundEffect="constellation"
        layout="minimal"
      />

      <div className="container mx-auto px-4 mt-12 space-y-10">
        {!user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="backdrop-blur-xl bg-rdm-night/50 border-rdm-gold/30">
              <CardContent className="py-16 text-center space-y-6">
                <Trophy className="h-16 w-16 mx-auto text-rdm-gold/60" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-bold">Acceso requerido</h3>
                  <p className="text-rdm-fog/70 max-w-md mx-auto">
                    Inicia sesión para desbloquear tu panel de logros y participar en el leaderboard territorial.
                  </p>
                </div>
                <Button asChild size="lg" className="bg-gradient-to-r from-rdm-gold to-rdm-copper hover:opacity-90">
                  <Link to="/auth">Entrar al Nodo Cero</Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* XP Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="backdrop-blur-xl bg-gradient-to-br from-rdm-night/80 via-rdm-night/60 to-rdm-night/80 border-rdm-gold/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rdm-gold/5 via-transparent to-rdm-oxygen/5 pointer-events-none" />
                <CardContent className="py-12 px-8 relative">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-rdm-gold/80 mb-2">
                          Nivel actual
                        </p>
                        <h2 className="text-6xl md:text-7xl font-display font-bold bg-gradient-to-r from-rdm-gold via-rdm-oxygen to-rdm-candle bg-clip-text text-transparent">
                          {xp.toLocaleString()}
                        </h2>
                        <p className="text-rdm-fog/60 text-sm mt-1">puntos de experiencia totales</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-rdm-fog/70">Progreso al nivel {level + 1}</span>
                          <span className="font-mono text-rdm-gold">{xpInLevel} / 500</span>
                        </div>
                        <div className="relative h-3 bg-rdm-night/50 rounded-full overflow-hidden border border-rdm-gold/20">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-rdm-gold via-rdm-oxygen to-rdm-candle rounded-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => award("test_action", 25)}
                        className="w-full md:w-auto border-rdm-oxygen/40 hover:bg-rdm-oxygen/10"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        +25 XP Demo
                      </Button>
                    </div>

                    <CircularProgress progress={progressPercent} level={level} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Card className="backdrop-blur-xl bg-rdm-night/50 border-rdm-gold/20">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <CardTitle className="flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-rdm-gold" />
                      <span>Medallas Territoriales</span>
                    </CardTitle>
                    <Badge variant="outline" className="text-sm">
                      {unlockedCount} / {totalCount} desbloqueadas
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-rdm-night/30 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {catalog.map((badge, i) => (
                        <BadgeTile key={badge.id} badge={badge} owned={ownedSet.has(badge.id)} index={i} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="backdrop-blur-xl bg-rdm-night/50 border-rdm-oxygen/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-rdm-oxygen" />
                    <span>Ranking Territorial</span>
                  </CardTitle>
                  <p className="text-sm text-rdm-fog/60 mt-2">
                    Top 20 usuarios con mayor experiencia en el Nodo Cero
                  </p>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 bg-rdm-night/30 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : leaders.length === 0 ? (
                    <div className="py-12 text-center">
                      <Star className="h-12 w-12 mx-auto text-rdm-fog/30 mb-4" />
                      <p className="text-rdm-fog/60">Aún no hay puntajes registrados.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leaders.map((leader, i) => (
                        <LeaderboardRow
                          key={leader.user_id}
                          leader={leader}
                          index={i}
                          isCurrentUser={leader.user_id === user?.id}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
