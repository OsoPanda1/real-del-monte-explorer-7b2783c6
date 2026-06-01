import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ISABELLA_MODULES, ATLAS_BACKEND_ENDPOINTS, HE_HEXAGONS, HEP_DOMAINS } from "@/data/eliteHeHep";

export interface LiveSignals {
  altitude: string;
  hexagons: string;
  domains: string;
  modules: string;
  endpoints: string;
  habitantes: number;
  decisiones24h: number;
  partidas24h: number;
  comercios: number;
  loading: boolean;
}

const initial: LiveSignals = {
  altitude: "2,660 m",
  hexagons: `${HE_HEXAGONS.length} / 6`,
  domains: `${HEP_DOMAINS.length} / 7`,
  modules: `${ISABELLA_MODULES.length}`,
  endpoints: `${ATLAS_BACKEND_ENDPOINTS.length}+`,
  habitantes: 0,
  decisiones24h: 0,
  partidas24h: 0,
  comercios: 0,
  loading: true,
};

export function useLiveSignals(refreshMs = 45_000): LiveSignals {
  const [state, setState] = useState<LiveSignals>(initial);

  useEffect(() => {
    let cancelled = false;
    const since = () => new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const load = async () => {
      try {
        const [hab, dec, gam, com] = await Promise.all([
          supabase.from("memberships").select("user_id", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("pdos_decisions").select("id", { count: "exact", head: true }).gte("created_at", since()),
          supabase.from("game_sessions").select("id", { count: "exact", head: true }).gte("played_at", since()),
          supabase.from("comercios").select("id", { count: "exact", head: true }).eq("activo", true),
        ]);
        if (cancelled) return;
        setState((s) => ({
          ...s,
          habitantes: hab.count ?? 0,
          decisiones24h: dec.count ?? 0,
          partidas24h: gam.count ?? 0,
          comercios: com.count ?? 0,
          loading: false,
        }));
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    };

    load();
    const id = setInterval(load, refreshMs);

    const ch = supabase
      .channel("live-signals")
      .on("postgres_changes", { event: "*", schema: "public", table: "memberships" }, load)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pdos_decisions" }, load)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "game_sessions" }, load)
      .subscribe();

    return () => { cancelled = true; clearInterval(id); supabase.removeChannel(ch); };
  }, [refreshMs]);

  return state;
}
