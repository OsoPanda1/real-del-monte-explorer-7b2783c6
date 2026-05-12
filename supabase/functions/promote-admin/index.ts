// promote-admin: idempotente, audita en admin_audit_log, normaliza email.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace(/^Bearer\s+/i, "");
    if (!token) return json({ ok: false, error: "no auth" }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user?.email) return json({ ok: false, error: "invalid token" }, 401);

    const email = user.email.trim().toLowerCase();

    const audit = async (action: string, reason: string, metadata: Record<string, unknown> = {}) => {
      const { data } = await service.from("admin_audit_log").insert({
        actor_id: user.id, target_user_id: user.id, target_email: email,
        action, reason, metadata,
      }).select("id").single();
      return data?.id;
    };

    // Idempotente: ya admin?
    const { data: existing } = await service.from("user_roles")
      .select("id").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (existing) {
      const audit_id = await audit("granted", "already_admin");
      return json({ ok: true, reason: "already_admin", email, audit_id });
    }

    const { count: adminCount } = await service
      .from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");

    let action: "granted" | "denied" = "denied";
    let reason = "not_authorized";

    if ((adminCount ?? 0) === 0) {
      action = "granted"; reason = "bootstrap_first_admin";
    } else {
      const { data: allow } = await service.rpc("is_email_allowlisted", { _email: email });
      if (allow === true) { action = "granted"; reason = "allowlisted"; }
    }

    if (action === "denied") {
      const audit_id = await audit("denied", reason, { admin_count: adminCount ?? 0 });
      return json({ ok: false, error: "email no autorizado", email, audit_id }, 403);
    }

    const { error } = await service.from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
    if (error) return json({ ok: false, error: error.message }, 500);

    if (reason === "bootstrap_first_admin") {
      await service.from("admin_allowlist").upsert({ email, added_by: user.id });
      const audit_id = await audit("bootstrap", reason);
      return json({ ok: true, reason, email, audit_id });
    }

    const audit_id = await audit("granted", reason);
    return json({ ok: true, reason, email, audit_id });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
