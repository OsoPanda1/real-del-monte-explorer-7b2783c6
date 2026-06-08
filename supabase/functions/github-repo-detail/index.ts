// supabase/functions/github-repo-detail/index.ts
// Returns README (rendered as text), topics, issues/PR counts for a repo.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CACHE = new Map<string, { ts: number; payload: unknown }>();
const TTL = 10 * 60 * 1000;

async function gh(path: string, token: string, accept = "application/vnd.github+json") {
  const r = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: accept, "User-Agent": "rdm-digital-edge" },
  });
  return r;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = new URL(req.url);
    const owner = url.searchParams.get("owner") ?? "OsoPanda1";
    const repo = url.searchParams.get("repo");
    if (!repo) {
      return new Response(JSON.stringify({ error: "repo_required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const key = `${owner}/${repo}`;
    const cached = CACHE.get(key);
    if (cached && Date.now() - cached.ts < TTL) {
      return new Response(JSON.stringify(cached.payload), {
        headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "HIT" },
      });
    }

    const token = Deno.env.get("GITHUB_TOKEN");
    if (!token) {
      return new Response(JSON.stringify({ error: "github_token_missing" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [repoRes, readmeRes, prsRes] = await Promise.all([
      gh(`/repos/${owner}/${repo}`, token),
      gh(`/repos/${owner}/${repo}/readme`, token, "application/vnd.github.raw"),
      gh(`/repos/${owner}/${repo}/pulls?state=open&per_page=1`, token),
    ]);

    if (!repoRes.ok) {
      return new Response(JSON.stringify({ error: `github ${repoRes.status}` }), {
        status: repoRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const repoJson = await repoRes.json();
    const readme = readmeRes.ok ? await readmeRes.text() : "";
    const prLink = prsRes.headers.get("link") ?? "";
    const prMatch = prLink.match(/page=(\d+)>; rel="last"/);
    const openPRs = prMatch ? parseInt(prMatch[1]) : (await prsRes.json().catch(() => [])).length ?? 0;

    const payload = {
      name: repoJson.name,
      full_name: repoJson.full_name,
      description: repoJson.description ?? "",
      url: repoJson.html_url,
      homepage: repoJson.homepage,
      language: repoJson.language,
      stars: repoJson.stargazers_count,
      forks: repoJson.forks_count,
      open_issues: repoJson.open_issues_count,
      open_prs: openPRs,
      topics: repoJson.topics ?? [],
      pushed_at: repoJson.pushed_at,
      created_at: repoJson.created_at,
      default_branch: repoJson.default_branch,
      readme: readme.slice(0, 20000),
    };
    CACHE.set(key, { ts: Date.now(), payload });
    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json", "X-Cache": "MISS" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
