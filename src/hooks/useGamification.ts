import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface GamPoints { user_id: string; xp: number; level: number; streak_days: number; }
export interface UserBadge { user_id: string; badge_id: string; awarded_at: string; }

export function useGamification() {
  const { user } = useAuth();
  const [points, setPoints] = useState<GamPoints | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [{ data: p }, { data: b }] = await Promise.all([
      supabase.from("gamification_points").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_badges").select("*").eq("user_id", user.id),
    ]);
    setPoints((p as GamPoints) ?? { user_id: user.id, xp: 0, level: 1, streak_days: 0 });
    setBadges((b as UserBadge[]) ?? []);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const award = useCallback(async (kind: string, pts: number, metadata: Record<string, unknown> = {}) => {
    if (!user) return;
    const { data, error } = await supabase.rpc("award_points", {
      _user_id: user.id, _kind: kind, _points: pts, _metadata: metadata,
    });
    if (error) { console.error(error); return; }
    const row = Array.isArray(data) ? data[0] : data;
    if (row?.leveled_up) {
      setShowConfetti(true);
      toast.success(`¡Subiste a nivel ${row.new_level}!`, { duration: 5000 });
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast.success(`+${pts} XP`);
    }
    refresh();
  }, [user, refresh]);

  return { points, badges, award, showConfetti, refresh };
}
