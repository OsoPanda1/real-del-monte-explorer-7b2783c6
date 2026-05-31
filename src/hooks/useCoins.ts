import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCoins() {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBalance(0); setLoading(false); return; }
    const { data } = await supabase
      .from("rdm_coins_wallet")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    setBalance(data?.balance ?? 0);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { balance, loading, refresh: load };
}
