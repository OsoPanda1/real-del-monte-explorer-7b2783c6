// supabase/functions/github-ecosystem/index.ts
// Returns the curated OsoPanda1 RDM/TAMV ecosystem with live GitHub metadata.
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
  pushed_at: string;
  updated_at: string;
  topics: string[];
  default_branch: string;
  archived: boolean;
};

function classify(name: string): { federation: string; hexagon: string } {
  const n = name.toLowerCase();
  if (/rdm|real-del|smart-city|turism|elevated|explorer|twin|nodo-cero/.test(n))
    return { federation: "Territorio", hexagon: "Publicación" };
  if (/atlas|orchestrator|nexus|core-atlas|sentient|digital-nexus|horizon|sovereign-hub|federated-frontier|universe|civilized/.test(n))
    return { federation: "Central", hexagon: "Transformación" };
  if (/oso-|dream-weaver|data-weaver/.test(n))
    return { federation: "Infraestructura", hexagon: "Ingesta" };
  if (/metaverso|nextgen|multiverso|omniverse|tamvonline|web-4|genesis|tamvweb/.test(n))
    return { federation: "Cultura", hexagon: "Publicación" };
  if (/utamv|access-academy|citemesh|academic|campus|masterclass/.test(n))
    return { federation: "Usuarios", hexagon: "Ciencia" };
  if (/quantum|symbol-forge|digital-civ|sovereign-union|federacion|unify-nexus|proyecto-cent/.test(n))
    return { federation: "Seguridad", hexagon: "Identidad" };
  if (/documentacion|docs-hub|datostamv|alamexa|analiza|Index-html|metodo4l|Juegos|new-beginnings/i.test(n))
    return { federation: "Operaciones", hexagon: "Economía" };
  return { federation: "Central", hexagon: "Transformación" };
}

async function fetchPage(page: number, token: string) {
  const r = await fetch(
    `https://api.github.com/users/OsoPanda1/repos?per_page=100&page=${page}&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "rdm-digital-edge",
      },
    },
  );
  if (!r.ok) throw new Error(`github ${r.status}`);
  return (await r.json()) as Repo[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = Deno.env.get("GITHUB_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ error: "github_token_missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const [p1, p2] = await Promise.all([fetchPage(1, token), fetchPage(2, token)]);
    const all = [...p1, ...p2];
    const filtered = all
      .filter((r) => ECOSYSTEM_PATTERN.test(r.name) && !r.archived)
      .map((r) => {
        const c = classify(r.name);
        return {
          name: r.name,
          description: r.description ?? "",
          url: r.html_url,
          homepage: r.homepage ?? null,
          language: r.language ?? null,
          stars: r.stargazers_count,
          forks: r.forks_count,
          pushed_at: r.pushed_at,
          topics: r.topics ?? [],
          federation: c.federation,
          hexagon: c.hexagon,
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
      )
        .map(([k, v]) => ({ language: k, count: v }))
        .sort((a, b) => b.count - a.count),
      federations: Object.entries(
        filtered.reduce<Record<string, number>>((acc, r) => {
          acc[r.federation] = (acc[r.federation] ?? 0) + 1;
          return acc;
        }, {}),
      ).map(([k, v]) => ({ federation: k, count: v })),
      last_push: filtered[0]?.pushed_at ?? null,
    };

    return new Response(
      JSON.stringify({ summary, repos: filtered, generated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "public, max-age=300" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
