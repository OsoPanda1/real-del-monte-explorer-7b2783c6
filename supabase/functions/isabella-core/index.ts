// Isabella Core — Decision Engine con XAI + ledger en pdos_decisions
// Integra Lovable AI Gateway (google/gemini-2.5-flash) cuando la query lo amerita.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query = "", op = "query" } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (op === "test") {
      return json({ ok: true, status: "ALIVE", model: "google/gemini-2.5-flash" });
    }

    // 1) Recuperar contexto desde el knowledge graph
    const [{ data: nodes }, { data: repos }] = await Promise.all([
      supabase.from("pdos_nodes").select("slug,title,importance,description").order("importance", { ascending: false }).limit(8),
      supabase.from("pdos_repos").select("name,category,score,role").order("score", { ascending: false }).limit(5),
    ]);

    // 2) Decisión heurística base
    const decisions: Array<Record<string, unknown>> = [
      { type: "highlight", target: nodes?.[0]?.slug ?? "tamv-core", priority: 95, reason: "Nodo de mayor importancia en el grafo" },
      repos?.[0]
        ? { type: "optimize_repo", repo: repos[0].name, action: "feature", priority: 85, reason: `Score ${repos[0].score}` }
        : { type: "alert", message: "Catálogo PDOS vacío", priority: 80 },
      { type: "info", message: "Sistema operativo activo", priority: 60 },
    ];

    // 3) Si hay query no-trivial, enriquecer con LLM (Lovable AI)
    let llmInsight: string | null = null;
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (query && query.length > 8 && apiKey) {
      try {
        const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "Eres Isabella, IA cívica del ecosistema TAMV/RDM. Responde en español, breve, con razonamiento explícito." },
              { role: "user", content: `Contexto:\nNodos top: ${nodes?.map((n) => n.slug).join(", ")}.\nRepos top: ${repos?.map((r) => r.name).join(", ")}.\n\nQuery: ${query}` },
            ],
          }),
        });
        if (r.ok) {
          const j = await r.json();
          llmInsight = j?.choices?.[0]?.message?.content ?? null;
          if (llmInsight) {
            decisions.unshift({ type: "insight", message: llmInsight, priority: 90, source: "isabella-llm" });
          }
        }
      } catch (_) { /* LLM opcional */ }
    }

    const confidence = Math.min(0.55 + (nodes?.length ?? 0) * 0.05 + (llmInsight ? 0.15 : 0), 0.97);
    const explanation = {
      rule_version: "v1.0",
      factors: { graph_depth: nodes?.length ?? 0, repos_known: repos?.length ?? 0, llm_used: !!llmInsight },
      seed: "tamv-os-deterministic",
    };

    // 4) Persistir decisión en ledger (auditable)
    const { data: saved } = await supabase
      .from("pdos_decisions")
      .insert({
        query,
        context: { nodes, repos },
        decisions,
        confidence,
        rule_version: "v1.0",
        explanation,
        status: "emitted",
      })
      .select()
      .single();

    return json({
      ok: true,
      trace_id: saved?.trace_id,
      decisions,
      confidence,
      explanation,
      context: { nodes, repos },
    });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
