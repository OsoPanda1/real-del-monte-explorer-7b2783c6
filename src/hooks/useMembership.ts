import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MembershipState {
  loading: boolean;
  isActive: boolean;
  status: string;
  currentPeriodEnd: string | null;
  refresh: () => Promise<void>;
}

export function useMembership(): MembershipState {
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("inactive");
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsActive(false); setStatus("inactive"); setLoading(false); return;
    }
    const { data } = await supabase
      .from("memberships")
      .select("status,current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      const active = data.status === "active" &&
        (!data.current_period_end || new Date(data.current_period_end) > new Date());
      setIsActive(active);
      setStatus(data.status);
      setCurrentPeriodEnd(data.current_period_end);
    } else {
      setIsActive(false); setStatus("inactive");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { loading, isActive, status, currentPeriodEnd, refresh: load };
}
