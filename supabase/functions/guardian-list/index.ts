// guardian-list: paginación + filtros server-side de pdos_decisions (solo admin).
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
    const { data: isAdmin } = await service.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return json({ ok: false, error: "not admin" }, 403);

    const body = await req.json().catch(() => ({}));
    const tab = body.tab === "history" ? "history" : "pending";
    const page = Math.max(1, Number(body.page ?? 1));
    const pageSize = Math.min(5000, Math.max(1, Number(body.page_size ?? 10)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = service.from("pdos_decisions").select("*", { count: "exact" });
    if (tab === "pending") q = q.eq("status", "emitted").order("created_at", { ascending: false });
    else q = q.neq("status", "emitted").order("reviewed_at", { ascending: false });

    if (body.status && body.status !== "all" && tab === "history") q = q.eq("status", body.status);
    if (body.trace_id) q = q.ilike("trace_id::text", `%${String(body.trace_id).toLowerCase()}%`);
    if (body.query_text) q = q.ilike("query", `%${body.query_text}%`);
    if (body.from) q = q.gte("created_at", body.from);
    if (body.to) {
      const toDate = new Date(body.to); toDate.setHours(23,59,59,999);
      q = q.lte("created_at", toDate.toISOString());
    }

    const { data, count, error } = await q.range(from, to);
    if (error) return json({ ok: false, error: error.message }, 500);

    return json({ ok: true, rows: data ?? [], total: count ?? 0, page, page_size: pageSize });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(d: unknown, status = 200) {
  return new Response(JSON.stringify(d), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
