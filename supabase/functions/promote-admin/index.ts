// Promote-admin: bootstrap-first o por allowlist de email
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

    // ¿Ya hay algún admin?
    const { count: adminCount } = await service
      .from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");

    let authorized = false;
    let reason = "";

    if ((adminCount ?? 0) === 0) {
      authorized = true;
      reason = "bootstrap_first_admin";
    } else {
      const { data: row } = await service
        .from("admin_allowlist").select("email").eq("email", user.email).maybeSingle();
      if (row) { authorized = true; reason = "allowlisted"; }
    }

    if (!authorized) return json({ ok: false, error: "email no autorizado", email: user.email }, 403);

    const { error } = await service
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
    if (error) return json({ ok: false, error: error.message }, 500);

    // Si fue bootstrap, agregar el email al allowlist también
    if (reason === "bootstrap_first_admin") {
      await service.from("admin_allowlist").upsert({ email: user.email, added_by: user.id });
    }

    return json({ ok: true, reason, email: user.email });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
