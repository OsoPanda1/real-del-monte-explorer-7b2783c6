// executions-list: paginación + filtros server-side de pdos_executions.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const body = await req.json().catch(() => ({}));
    const page = Math.max(1, Number(body.page ?? 1));
    const pageSize = Math.min(500, Math.max(1, Number(body.page_size ?? 25)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let q = service.from("pdos_executions").select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (body.trace_id) q = q.ilike("trace_id::text", `%${String(body.trace_id).toLowerCase()}%`);
    if (body.task) q = q.ilike("task", `%${body.task}%`);
    if (body.stream_id) q = q.ilike("stream_id", `%${body.stream_id}%`);
    if (body.status && body.status !== "all") q = q.eq("status", body.status);
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
