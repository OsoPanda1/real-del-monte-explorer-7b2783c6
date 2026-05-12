// revoke-admin: solo admin, idempotente, auditado.
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
    if (!user) return json({ ok: false, error: "invalid token" }, 401);

    const { data: actorIsAdmin } = await service.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!actorIsAdmin) return json({ ok: false, error: "not admin" }, 403);

    const body = await req.json().catch(() => ({}));
    const targetEmail = String(body.email ?? "").trim().toLowerCase();
    if (!targetEmail) return json({ ok: false, error: "email requerido" }, 400);

    // Resolver user_id
    const { data: list } = await service.auth.admin.listUsers();
    const target = list?.users?.find((u) => u.email?.toLowerCase() === targetEmail);
    if (!target) return json({ ok: false, error: "usuario no encontrado" }, 404);

    if (target.id === user.id) {
      // evitar auto-revocación si es el único admin
      const { count } = await service.from("user_roles").select("*", { count: "exact", head: true }).eq("role","admin");
      if ((count ?? 0) <= 1) return json({ ok: false, error: "no puedes revocarte: eres el único admin" }, 400);
    }

    await service.from("user_roles").delete().eq("user_id", target.id).eq("role", "admin");
    await service.from("admin_allowlist").delete().eq("email", targetEmail);

    const { data: audit } = await service.from("admin_audit_log").insert({
      actor_id: user.id, target_user_id: target.id, target_email: targetEmail,
      action: "revoked", reason: "admin_action",
    }).select("id").single();

    return json({ ok: true, audit_id: audit?.id });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
