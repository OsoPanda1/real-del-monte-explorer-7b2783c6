import { useEffect, useMemo, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Star, GitFork, ExternalLink, GitBranch, Activity, Layers,
  Loader2, Sparkles, Search, RefreshCw, Save, Trash2, X,
  AlertCircle, GitPullRequest, Calendar, Globe, Tag,
} from "lucide-react";

type Repo = {
  name: string;
  full_name: string;
  owner: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  pushed_at: string;
  created_at: string;
  topics: string[];
  federation: string;
  hexagon: string;
  tamv_domain: string;
};

type Payload = {
  summary: {
    total: number;
    languages: { language: string; count: number }[];
    federations: { federation: string; count: number }[];
    last_push: string | null;
  };
  repos: Repo[];
  generated_at: string;
};

type RepoDetail = {
  name: string;
  full_name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  open_issues: number;
  open_prs: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  default_branch: string;
  readme: string;
};

type Filters = {
  q: string;
  federation: string;
  language: string;
  minStars: number;
  minForks: number;
  activity: "all" | "7d" | "30d" | "90d" | "365d";
};

type Preset = { name: string; filters: Filters };

const FEDERATIONS = ["Todos", "Central", "Territorio", "Infraestructura", "Cultura", "Seguridad", "Usuarios", "Operaciones"];
const PAGE_SIZE = 12;
const PRESETS_KEY = "rdm.ecosistema.presets.v1";
const CACHE_KEY = "rdm.ecosistema.cache.v1";
const CACHE_TTL = 5 * 60 * 1000;

const defaultFilters: Filters = {
  q: "", federation: "Todos", language: "", minStars: 0, minForks: 0, activity: "all",
};

const Ecosistema = () => {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [presets, setPresets] = useState<Preset[]>(() => {
    try { return JSON.parse(localStorage.getItem(PRESETS_KEY) || "[]"); } catch { return []; }
  });
  const [selected, setSelected] = useState<Repo | null>(null);
  const [detail, setDetail] = useState<RepoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const load = useCallback(async (force = false) => {
    setError(null);
    if (!force) {
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
        if (cached && Date.now() - cached.ts < CACHE_TTL) {
          setData(cached.payload);
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }
    if (force) setRefreshing(true); else setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke(
        "github-ecosystem" + (force ? "?refresh=1" : ""),
      );
      if (error) throw error;
      setData(res as Payload);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), payload: res }));
    } catch (e: any) {
      setError(e?.message ?? "Error cargando ecosistema");
    } finally {
      setLoading(false); setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(false); }, [load]);

  useEffect(() => { setPage(1); }, [filters]);

  const allLanguages = useMemo(
    () => data?.summary.languages.map((l) => l.language) ?? [],
    [data],
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    const now = Date.now();
    const activityMs: Record<Filters["activity"], number> = {
      all: Infinity, "7d": 7, "30d": 30, "90d": 90, "365d": 365,
    } as any;
    const activityCutoff = filters.activity === "all"
      ? 0
      : now - (activityMs[filters.activity] as number) * 24 * 60 * 60 * 1000;
    return data.repos.filter((r) => {
      if (filters.federation !== "Todos" && r.federation !== filters.federation) return false;
      if (filters.language && r.language !== filters.language) return false;
      if (r.stars < filters.minStars) return false;
      if (r.forks < filters.minForks) return false;
      if (activityCutoff && new Date(r.pushed_at).getTime() < activityCutoff) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const hay = `${r.name} ${r.owner} ${r.description} ${r.topics.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [data, filters]);

  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const savePreset = () => {
    const name = window.prompt("Nombre del preset:");
    if (!name) return;
    const next = [...presets.filter((p) => p.name !== name), { name, filters }];
    setPresets(next);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
  };
  const applyPreset = (p: Preset) => setFilters(p.filters);
  const deletePreset = (name: string) => {
    const next = presets.filter((p) => p.name !== name);
    setPresets(next);
    localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
  };

  const openDetail = useCallback(async (r: Repo) => {
    setSelected(r); setDetail(null); setDetailLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        `github-repo-detail?owner=${r.owner}&repo=${r.name}`,
      );
      if (error) throw error;
      setDetail(data as RepoDetail);
    } catch (e) {
      setDetail({
        name: r.name, full_name: r.full_name, description: r.description, url: r.url,
        homepage: r.homepage, language: r.language, stars: r.stars, forks: r.forks,
        open_issues: r.open_issues, open_prs: 0, topics: r.topics, pushed_at: r.pushed_at,
        created_at: r.created_at, default_branch: "main", readme: "",
      });
    } finally {
      setDetailLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-rdm-gold/80 mb-3">
            <Sparkles className="h-3 w-3" /> Heptafederación · OsoPanda1
          </div>
          <h1 className="font-heritage text-4xl sm:text-5xl text-rdm-platinum">Ecosistema RDM · TAMV</h1>
          <p className="mt-3 text-rdm-fog/70 max-w-3xl">
            Catálogo vivo del kernel heptafederado: repositorios reales sincronizados desde GitHub,
            clasificados por dominio TAMV y hexágono operativo ELITE HeHep.
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-md bg-white/5 border border-white/10 hover:border-rdm-gold/40 text-xs uppercase tracking-wider text-rdm-fog/80 hover:text-rdm-gold transition"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Sincronizando…" : "Refrescar"}
        </button>
      </header>

      {data && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Stat icon={Layers} label="Repos activos" value={data.summary.total} />
          <Stat icon={GitBranch} label="Federaciones" value={data.summary.federations.length} />
          <Stat icon={Activity} label="Lenguajes" value={data.summary.languages.length} />
          <Stat icon={Sparkles} label="Último push" value={data.summary.last_push ? new Date(data.summary.last_push).toLocaleDateString("es-MX") : "—"} />
        </section>
      )}

      {/* Advanced filters */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 mb-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-rdm-fog/40" />
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Buscar por nombre, owner, topic, descripción…"
              className="w-full h-10 pl-10 pr-4 rounded-md bg-white/5 border border-white/10 text-sm text-rdm-platinum placeholder:text-rdm-fog/40 focus:outline-none focus:border-rdm-gold/50"
            />
          </div>
          <select
            value={filters.language}
            onChange={(e) => setFilters({ ...filters, language: e.target.value })}
            className="h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm text-rdm-platinum focus:outline-none focus:border-rdm-gold/50 min-w-[160px]"
          >
            <option value="">Todos los lenguajes</option>
            {allLanguages.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            value={filters.activity}
            onChange={(e) => setFilters({ ...filters, activity: e.target.value as any })}
            className="h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm text-rdm-platinum focus:outline-none focus:border-rdm-gold/50"
          >
            <option value="all">Cualquier actividad</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="365d">Último año</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <NumberField label="★ min" value={filters.minStars} onChange={(v) => setFilters({ ...filters, minStars: v })} />
          <NumberField label="⑂ min" value={filters.minForks} onChange={(v) => setFilters({ ...filters, minForks: v })} />
          <div className="flex gap-1.5 overflow-x-auto flex-1">
            {FEDERATIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFilters({ ...filters, federation: f })}
                className={`shrink-0 px-3 h-8 rounded-md text-[11px] font-mono uppercase tracking-wider border transition-colors ${
                  filters.federation === f
                    ? "bg-rdm-gold/15 border-rdm-gold/40 text-rdm-gold"
                    : "bg-white/5 border-white/10 text-rdm-fog/70 hover:text-rdm-platinum"
                }`}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          <span className="text-[10px] uppercase tracking-widest text-rdm-fog/50">Presets:</span>
          {presets.length === 0 && (
            <span className="text-[11px] text-rdm-fog/40 italic">Sin presets guardados</span>
          )}
          {presets.map((p) => (
            <span key={p.name} className="inline-flex items-center gap-1 rounded-md bg-white/5 border border-white/10 pl-2 pr-1 h-7 text-[11px]">
              <button onClick={() => applyPreset(p)} className="text-rdm-platinum/80 hover:text-rdm-gold">{p.name}</button>
              <button onClick={() => deletePreset(p.name)} className="text-rdm-fog/40 hover:text-red-400 p-1">
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button onClick={savePreset} className="ml-auto inline-flex items-center gap-1 h-7 px-2 rounded-md bg-rdm-gold/10 border border-rdm-gold/30 text-[11px] text-rdm-gold hover:bg-rdm-gold/20">
            <Save className="h-3 w-3" /> Guardar preset
          </button>
          <button
            onClick={() => setFilters(defaultFilters)}
            className="h-7 px-2 rounded-md border border-white/10 text-[11px] text-rdm-fog/60 hover:text-rdm-platinum"
          >Limpiar</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 text-xs text-rdm-fog/60">
        <span>{filtered.length} resultados</span>
        {totalPages > 1 && <span>Página {page} de {totalPages}</span>}
      </div>

      {loading && !data && (
        <div className="flex items-center gap-2 text-rdm-fog/60 py-20 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" /> Sincronizando con GitHub…
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-300">{error}</div>
      )}

      {data && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paged.map((r) => (
              <button
                key={r.name}
                onClick={() => openDetail(r)}
                className="text-left group relative rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-5 hover:border-rdm-gold/40 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-rdm-gold/70">{r.federation} · {r.hexagon}</div>
                  <ExternalLink className="h-3.5 w-3.5 text-rdm-fog/40 group-hover:text-rdm-gold" />
                </div>
                <div className="font-heritage text-lg text-rdm-platinum leading-tight mb-1.5 truncate">{r.name}</div>
                <p className="text-xs text-rdm-fog/65 line-clamp-2 min-h-[2.5rem]">{r.description || "Sin descripción."}</p>
                <div className="flex items-center gap-3 mt-4 text-[11px] text-rdm-fog/55 font-mono">
                  {r.language && <span className="text-rdm-data">{r.language}</span>}
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" />{r.stars}</span>
                  <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{r.forks}</span>
                  <span className="ml-auto">{new Date(r.pushed_at).toLocaleDateString("es-MX")}</span>
                </div>
                <div className="mt-2 text-[10px] text-rdm-fog/40 font-mono truncate">{r.tamv_domain}</div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-rdm-fog/50 py-12 text-sm">Sin coincidencias con los filtros actuales.</p>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <PgBtn onClick={() => setPage(1)} disabled={page === 1}>«</PgBtn>
              <PgBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PgBtn>
              {pageWindow(page, totalPages).map((n, i) =>
                n === "..." ? (
                  <span key={i} className="text-rdm-fog/40 px-1">…</span>
                ) : (
                  <PgBtn key={i} onClick={() => setPage(n as number)} active={n === page}>{n}</PgBtn>
                ),
              )}
              <PgBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PgBtn>
              <PgBtn onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PgBtn>
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-8 overflow-y-auto"
          onClick={() => { setSelected(null); setDetail(null); }}
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-white/10 bg-rdm-night/95 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-white/10">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-widest text-rdm-gold/70 mb-1">
                  {selected.federation} · {selected.hexagon} · {selected.tamv_domain}
                </div>
                <h2 className="font-heritage text-2xl text-rdm-platinum truncate">{selected.name}</h2>
                <div className="text-xs text-rdm-fog/50 mt-0.5">{selected.full_name}</div>
              </div>
              <button onClick={() => { setSelected(null); setDetail(null); }} className="text-rdm-fog/60 hover:text-rdm-platinum p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {detailLoading && (
                <div className="flex items-center gap-2 text-rdm-fog/60 py-8 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Cargando detalle…
                </div>
              )}
              {detail && (
                <>
                  {detail.description && (
                    <p className="text-sm text-rdm-platinum/80 leading-relaxed">{detail.description}</p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <Mini icon={Star} label="stars" value={detail.stars} />
                    <Mini icon={GitFork} label="forks" value={detail.forks} />
                    <Mini icon={AlertCircle} label="issues" value={detail.open_issues} />
                    <Mini icon={GitPullRequest} label="open PRs" value={detail.open_prs} />
                  </div>

                  {detail.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {detail.topics.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 h-6 rounded-md bg-rdm-gold/10 border border-rdm-gold/30 text-[10px] text-rdm-gold font-mono">
                          <Tag className="h-2.5 w-2.5" />{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 text-[11px] text-rdm-fog/60">
                    <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Creado {new Date(detail.created_at).toLocaleDateString("es-MX")}</span>
                    <span className="inline-flex items-center gap-1"><Activity className="h-3 w-3" /> Actualizado {new Date(detail.pushed_at).toLocaleDateString("es-MX")}</span>
                    {detail.language && <span className="text-rdm-data">{detail.language}</span>}
                  </div>

                  {detail.readme && (
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-rdm-fog/50 mb-2">README</div>
                      <pre className="text-xs text-rdm-fog/80 whitespace-pre-wrap font-sans bg-black/30 rounded-md p-4 border border-white/5 max-h-72 overflow-y-auto leading-relaxed">
                        {detail.readme.slice(0, 4000)}
                        {detail.readme.length > 4000 && "\n\n… (truncado)"}
                      </pre>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <a href={detail.url} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-rdm-gold/15 border border-rdm-gold/40 text-xs text-rdm-gold hover:bg-rdm-gold/25">
                      <ExternalLink className="h-3.5 w-3.5" /> GitHub
                    </a>
                    {detail.homepage && (
                      <a href={detail.homepage} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-xs text-rdm-platinum hover:border-rdm-gold/40">
                        <Globe className="h-3.5 w-3.5" /> Sitio
                      </a>
                    )}
                    <a href={`https://github.com/${selected.owner}/${selected.name}/issues`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-xs text-rdm-platinum hover:border-rdm-gold/40">
                      <AlertCircle className="h-3.5 w-3.5" /> Issues
                    </a>
                    <a href={`https://github.com/${selected.owner}/${selected.name}/pulls`} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-xs text-rdm-platinum hover:border-rdm-gold/40">
                      <GitPullRequest className="h-3.5 w-3.5" /> Pull Requests
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
      <Icon className="h-4 w-4 text-rdm-gold/70 mb-2" />
      <div className="text-2xl font-heritage text-rdm-platinum">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-rdm-fog/55 mt-1">{label}</div>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="inline-flex items-center gap-2 h-8 px-2 rounded-md bg-white/5 border border-white/10 text-[11px] text-rdm-fog/70">
      <span className="font-mono">{label}</span>
      <input
        type="number" min={0} value={value}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className="w-14 bg-transparent text-rdm-platinum text-xs focus:outline-none"
      />
    </label>
  );
}

function Mini({ icon: Icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="rounded-md border border-white/8 bg-white/[0.03] p-3">
      <div className="flex items-center gap-1.5 text-rdm-fog/60">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-lg text-rdm-platinum font-heritage mt-1">{value}</div>
    </div>
  );
}

function PgBtn({ children, onClick, disabled, active }: any) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`h-8 min-w-8 px-2 rounded-md border text-xs font-mono transition-colors ${
        active
          ? "bg-rdm-gold/15 border-rdm-gold/40 text-rdm-gold"
          : "bg-white/5 border-white/10 text-rdm-fog/70 hover:text-rdm-platinum disabled:opacity-30 disabled:cursor-not-allowed"
      }`}
    >{children}</button>
  );
}

function pageWindow(current: number, total: number): (number | "...")[] {
  const out: (number | "...")[] = [];
  const add = (n: number) => out.push(n);
  if (total <= 7) { for (let i = 1; i <= total; i++) add(i); return out; }
  add(1);
  if (current > 3) out.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) add(i);
  if (current < total - 2) out.push("...");
  add(total);
  return out;
}

export default Ecosistema;
