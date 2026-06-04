import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, GitFork, ExternalLink, GitBranch, Activity, Layers, Loader2, Sparkles } from "lucide-react";

type Repo = {
  name: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  pushed_at: string;
  topics: string[];
  federation: string;
  hexagon: string;
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

const FEDERATIONS = ["Todos", "Central", "Territorio", "Infraestructura", "Cultura", "Seguridad", "Usuarios", "Operaciones"];

const Ecosistema = () => {
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("Todos");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("github-ecosystem");
        if (error) throw error;
        if (!cancel) setData(data as Payload);
      } catch (e: any) {
        if (!cancel) setError(e?.message ?? "Error cargando ecosistema");
      }
    })();
    return () => { cancel = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.repos.filter((r) => {
      if (filter !== "Todos" && r.federation !== filter) return false;
      if (q && !(`${r.name} ${r.description}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [data, filter, q]);

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-rdm-gold/80 mb-3">
          <Sparkles className="h-3 w-3" /> Heptafederación · OsoPanda1
        </div>
        <h1 className="font-heritage text-4xl sm:text-5xl text-rdm-platinum">Ecosistema RDM · TAMV</h1>
        <p className="mt-3 text-rdm-fog/70 max-w-3xl">
          Catálogo vivo del kernel heptafederado: repositorios reales del autor sincronizados desde GitHub,
          clasificados por dominio y hexágono operativo del modelo ELITE HeHep.
        </p>
      </header>

      {/* Summary */}
      {data && (
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Stat icon={Layers} label="Repos activos" value={data.summary.total} />
          <Stat icon={GitBranch} label="Federaciones" value={data.summary.federations.length} />
          <Stat icon={Activity} label="Lenguajes" value={data.summary.languages.length} />
          <Stat icon={Sparkles} label="Último push" value={data.summary.last_push ? new Date(data.summary.last_push).toLocaleDateString("es-MX") : "—"} />
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar repo…"
          className="flex-1 h-10 px-4 rounded-md bg-white/5 border border-white/10 text-sm text-rdm-platinum placeholder:text-rdm-fog/40 focus:outline-none focus:border-rdm-gold/50"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {FEDERATIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 h-10 rounded-md text-xs font-mono uppercase tracking-wider border transition-colors ${
                filter === f
                  ? "bg-rdm-gold/15 border-rdm-gold/40 text-rdm-gold"
                  : "bg-white/5 border-white/10 text-rdm-fog/70 hover:text-rdm-platinum"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {!data && !error && (
        <div className="flex items-center gap-2 text-rdm-fog/60 py-20 justify-center">
          <Loader2 className="h-4 w-4 animate-spin" /> Sincronizando con GitHub…
        </div>
      )}
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Grid */}
      {data && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-xl border border-white/8 bg-gradient-to-br from-white/[0.04] to-transparent p-5 hover:border-rdm-gold/40 hover:bg-white/[0.06] transition-all"
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
            </a>
          ))}
        </div>
      )}

      {data && filtered.length === 0 && (
        <p className="text-center text-rdm-fog/50 py-12 text-sm">Sin coincidencias.</p>
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

export default Ecosistema;
