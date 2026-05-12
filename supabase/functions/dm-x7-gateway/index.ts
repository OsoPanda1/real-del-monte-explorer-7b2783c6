// DM-X7 Unified Gateway — enruta acciones del kernel + soporte de replay auditado.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GatewayRequest {
  action: string;
  payload?: Record<string, unknown>;
  replay_of?: string; // trace_id original cuando es replay
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = (await req.json()) as GatewayRequest;
    if (!body?.action || typeof body.action !== "string") {
      return json({ ok: false, error: "action requerida" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Identificar al actor (si viene JWT) — opcional
    let actorId: string | null = null;
    const auth = req.headers.get("Authorization") ?? "";
    if (auth) {
      const token = auth.replace(/^Bearer\s+/i, "");
      try {
        const userClient = createClient(
          Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: `Bearer ${token}` } } },
        );
        const { data } = await userClient.auth.getUser();
        actorId = data.user?.id ?? null;
      } catch (_) { /* anónimo */ }
    }

    const [domain, module, op] = body.action.split(".");
    const start = Date.now();
    let result: unknown = null;

    if (domain === "kernel" && module === "isabella") {
      const r = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/isabella-core`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! },
        body: JSON.stringify({ query: body.payload?.query ?? "", op }),
      });
      result = await r.json();
    } else if (domain === "kernel" && module === "event") {
      const stream = (body.payload?.stream_id as string) ?? "default";
      const { data: last } = await supabase
        .from("pdos_executions").select("stream_version")
        .eq("stream_id", stream).order("stream_version", { ascending: false }).limit(1).maybeSingle();
      const version = (last?.stream_version ?? 0) + 1;
      const meta: Record<string, unknown> = {};
      if (body.replay_of) meta.replay_of = body.replay_of;
      const { data: inserted, error } = await supabase
        .from("pdos_executions").insert({
          stream_id: stream, stream_version: version,
          task: (body.payload?.task as string) ?? op ?? "event",
          domain: "kernel",
          payload: { ...(body.payload ?? {}), ...meta },
          result: { accepted: true, replay: !!body.replay_of },
          status: "completed",
          duration_ms: Date.now() - start,
          event_hash: await sha256(JSON.stringify(body.payload ?? {})),
          created_by: actorId,
        }).select().single();
      if (error) throw error;
      result = inserted;
    } else if (domain === "security" && module === "sentinel" && op === "status") {
      const { count } = await supabase.from("pdos_executions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(Date.now() - 86400000).toISOString());
      result = { status: "OPERATIONAL", recent_threats: [], events_24h: count ?? 0 };
    } else if (domain === "kernel" && module === "graph" && op === "snapshot") {
      const [{ data: nodes }, { data: edges }] = await Promise.all([
        supabase.from("pdos_nodes").select("*").order("importance", { ascending: false }),
        supabase.from("pdos_edges").select("*"),
      ]);
      result = { nodes: nodes ?? [], edges: edges ?? [] };
    } else if (domain === "kernel" && module === "repos" && op === "list") {
      const { data } = await supabase.from("pdos_repos").select("*").order("score", { ascending: false });
      result = data ?? [];
    } else {
      return json({ ok: false, error: `acción no soportada: ${body.action}` }, 404);
    }

    // Si es replay, generar siempre traza nueva en pdos_executions (independiente del action)
    let new_trace_id: string | undefined;
    if (body.replay_of) {
      const { data: traceRow } = await supabase.from("pdos_executions").insert({
        stream_id: "dm-x7-replay",
        stream_version: 1,
        task: body.action, domain: "kernel",
        payload: { ...(body.payload ?? {}), replay_of: body.replay_of },
        result: { ok: true, action: body.action },
        status: "completed",
        duration_ms: Date.now() - start,
        event_hash: await sha256(`${body.replay_of}:${body.action}:${Date.now()}`),
        created_by: actorId,
      }).select("trace_id").single();
      new_trace_id = traceRow?.trace_id;
    }

    return json({ ok: true, action: body.action, result, duration_ms: Date.now() - start, new_trace_id, replay_of: body.replay_of });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
