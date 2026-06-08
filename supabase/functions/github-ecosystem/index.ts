// supabase/functions/github-ecosystem/index.ts
// Returns curated OsoPanda1 RDM/TAMV ecosystem with live GitHub metadata.
// In-memory cache (5 min) to avoid GitHub rate limits during live browsing.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ECOSYSTEM_PATTERN =
  /^(rdm-|real-del-|tamv|TAMV|ECOSISTEMA|ecosistema|metaverso|oso-|dream-|digital-civ|genesis|NEWTAMV|sovereign|web-4|multiverso|omniverse|federacion|proyecto-cent|quantum-system|symbol-forge|unify-nexus|utamv|access-academy|citemesh|tamvweb|tamvonline|datostamv|DOCUMENTACION|documentacion-total|repo-docs|Index-html|alamexa|Juegos|metodo4l|analiza-este|new-beginnings|OsoPanda1)/i;

type Repo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  updated_at: string;
  created_at: string;
  topics: string[];
  default_branch: string;
  archived: boolean;
  owner: { login: string };
};

function classify(name: string): { federation: string; hexagon: string; tamvDomain: string } {
  const n = name.toLowerCase();
  if (/rdm|real-del|smart-city|turism|elevated|explorer|twin|nodo-cero/.test(n))
    return { federation: "Territorio", hexagon: "Publicación", tamvDomain: "territorio.tamv.os" };
  if (/atlas|orchestrator|nexus|core-atlas|sentient|digital-nexus|horizon|sovereign-hub|federated-frontier|universe|civilized/.test(n))
    return { federation: "Central", hexagon: "Transformación", tamvDomain: "kernel.tamv.os" };
  if (/oso-|dream-weaver|data-weaver/.test(n))
    return { federation: "Infraestructura", hexagon: "Ingesta", tamvDomain: "infra.tamv.os" };
  if (/metaverso|nextgen|multiverso|omniverse|tamvonline|web-4|genesis|tamvweb/.test(n))
    return { federation: "Cultura", hexagon: "Publicación", tamvDomain: "cultura.tamv.os" };
  if (/utamv|access-academy|citemesh|academic|campus|masterclass/.test(n))
    return { federation: "Usuarios", hexagon: "Ciencia", tamvDomain: "usuarios.tamv.os" };
  if (/quantum|symbol-forge|digital-civ|sovereign-union|federacion|unify-nexus|proyecto-cent/.test(n))
    return { federation: "Seguridad", hexagon: "Identidad", tamvDomain: "seguridad.tamv.os" };
  if (/documentacion|docs-hub|datostamv|alamexa|analiza|Index-html|metodo4l|Juegos|new-beginnings/i.test(n))
    return { federation: "Operaciones", hexagon: "Economía", tamvDomain: "operaciones.tamv.os" };
  return { federation: "Central", hexagon: "Transformación", tamvDomain: "kernel.tamv.os" };
}

async function fetchPage(page: number, token: string) {
  const r = await fetch(
    `https://api.github.com/users/OsoPanda1/repos?per_page=100&page=${page}&sort=updated`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "User-Agent": "rdm-digital-edge" } },
  );
  if (!r.ok) throw new Error(`github ${r.status}`);
  return (await r.json()) as Repo[];
}

let CACHE: { ts: number; payload: unknown } | null = null;
const TTL_MS = 5 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("refresh") === "1";

    if (!force && CACHE && Date.now() - CACHE.ts < TTL_MS) {
      return new Response(JSON.stringify(CACHE.payload), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
      });
    }

    const token = Deno.env.get("GITHUB_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ error: "github_token_missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const [p1, p2, p3] = await Promise.all([fetchPage(1, token), fetchPage(2, token), fetchPage(3, token).catch(() => [])]);
    const all = [...p1, ...p2, ...p3];
    const filtered = all
      .filter((r) => ECOSYSTEM_PATTERN.test(r.name) && !r.archived)
      .map((r) => {
        const c = classify(r.name);
        return {
          name: r.name,
          full_name: r.full_name,
          owner: r.owner?.login ?? "OsoPanda1",
          description: r.description ?? "",
          url: r.html_url,
          homepage: r.homepage ?? null,
          language: r.language ?? null,
          stars: r.stargazers_count,
          forks: r.forks_count,
          open_issues: r.open_issues_count ?? 0,
          pushed_at: r.pushed_at,
          created_at: r.created_at,
          topics: r.topics ?? [],
          default_branch: r.default_branch,
          federation: c.federation,
          hexagon: c.hexagon,
          tamv_domain: c.tamvDomain,
        };
      })
      .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());

    const summary = {
      total: filtered.length,
      languages: Object.entries(
        filtered.reduce<Record<string, number>>((acc, r) => {
          if (r.language) acc[r.language] = (acc[r.language] ?? 0) + 1;
          return acc;
        }, {}),
      ).map(([k, v]) => ({ language: k, count: v })).sort((a, b) => b.count - a.count),
      federations: Object.entries(
        filtered.reduce<Record<string, number>>((acc, r) => {
          acc[r.federation] = (acc[r.federation] ?? 0) + 1;
          return acc;
        }, {}),
      ).map(([k, v]) => ({ federation: k, count: v })),
      last_push: filtered[0]?.pushed_at ?? null,
    };

    const payload = { summary, repos: filtered, generated_at: new Date().toISOString() };
    CACHE = { ts: Date.now(), payload };
    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS", "Cache-Control": "public, max-age=300" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
