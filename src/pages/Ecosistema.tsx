import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories, repos, ecosystemMeta, type RepoCategory } from "@/data/tamvEcosystem";

const Ecosistema = () => {
  const [filter, setFilter] = useState<RepoCategory | "all">("all");

  const visible = filter === "all" ? repos : repos.filter((r) => r.category === filter);

  const counts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c.id] = repos.filter((r) => r.category === c.id).length;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative px-6 md:px-16 pt-24 pb-12 border-b border-border">
        <Link
          to="/"
          className="font-display text-xs tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          ← REAL DEL MONTE
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl mt-6 leading-none"
        >
          Ecosistema <span className="text-primary">TAMV</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="font-body text-lg md:text-xl mt-6 max-w-3xl text-foreground/80 italic"
        >
          “{ecosystemMeta.motto}”
        </motion.p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl font-display text-xs tracking-widest">
          <Stat label="REPOSITORIOS" value={String(repos.length)} />
          <Stat label="NÚCLEOS" value="7" />
          <Stat label="HQ" value="REAL DEL MONTE" />
          <Stat label="ORCID" value={ecosystemMeta.orcid} />
        </div>
      </section>

      {/* Filtros */}
      <section className="px-6 md:px-16 py-10 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label={`Todos · ${repos.length}`}
          />
          {categories.map((c) => (
            <FilterChip
              key={c.id}
              active={filter === c.id}
              onClick={() => setFilter(c.id)}
              label={`${c.title} · ${counts[c.id]}`}
            />
          ))}
        </div>
      </section>

      {/* Grid de repos */}
      <section className="px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((repo, i) => {
            const cat = categories.find((c) => c.id === repo.category)!;
            return (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.4), duration: 0.4 }}
                className={`group relative block p-6 bg-card border border-border hover:border-primary transition-all duration-300 ${
                  repo.highlight ? "ring-1 ring-primary/40" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="font-display text-[10px] tracking-widest text-primary">
                    {cat.glyph} · {cat.title.toUpperCase()}
                  </span>
                  {repo.language && (
                    <span className="font-display text-[10px] tracking-widest text-muted-foreground">
                      {repo.language}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-lg mb-3 group-hover:text-primary transition-colors break-words">
                  {repo.name}
                </h3>

                <p className="font-body text-sm text-foreground/70 leading-relaxed">
                  {repo.description}
                </p>

                <div className="mt-6 font-display text-[10px] tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                  ABRIR EN GITHUB →
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* Footer manifiesto */}
      <section className="px-6 md:px-16 py-16 border-t border-border bg-card">
        <div className="max-w-3xl">
          <p className="font-display text-xs tracking-widest text-primary mb-4">MANIFIESTO</p>
          <p className="font-body text-base md:text-lg text-foreground/80 leading-relaxed">
            Real del Monte es la sede operativa de un proyecto civilizatorio que articula
            soberanía digital, economía creativa y resiliencia territorial. El ecosistema TAMV
            es la urdimbre técnica de esa visión: {repos.length} repositorios públicos que
            convergen en un único nodo de inteligencia heptafederada.
          </p>
          <p className="font-body text-sm text-muted-foreground mt-6">
            {ecosystemMeta.author} · {ecosystemMeta.org} · {ecosystemMeta.hq}
          </p>
          <a
            href={ecosystemMeta.profile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 font-display text-xs tracking-widest text-primary hover:underline"
          >
            VER PERFIL OSOPANDA1 →
          </a>
        </div>
      </section>
    </main>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-muted-foreground mb-1">{label}</div>
    <div className="text-foreground text-sm">{value}</div>
  </div>
);

const FilterChip = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-display text-[11px] tracking-widest border transition-colors ${
      active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-transparent text-foreground border-border hover:border-primary hover:text-primary"
    }`}
  >
    {label}
  </button>
);

export default Ecosistema;
