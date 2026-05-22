import { motion } from "framer-motion";
import { ExternalLink, Crown, Hash, Clock } from "lucide-react";
import StarfieldBackground from "@/components/StarfieldBackground";
import {
  ROOT_ARCHITECT,
  AWAKENING_MANIFEST,
  POSITIONING_2026,
  OSOPANDA_REPO_MAP,
  KNOWLEDGE_CELLS,
} from "@/data/awakening";

const Manifiesto = () => {
  return (
    <div className="relative min-h-screen text-foreground">
      <StarfieldBackground starCount={1500} />

      <div className="relative z-10 pt-32 md:pt-40 pb-24 px-6">
        <div className="mx-auto max-w-4xl">
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="font-display text-xs tracking-[0.4em] text-cyan-300 mb-4">
              SYSTEM_MESSAGE: INITIALIZING_AWAKENING
            </p>
            <h1 className="text-4xl md:text-6xl font-display text-white tracking-tight mb-6">
              The Awakening
            </h1>
            <p className="italic text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              TAMV Online · Civilizational Stack · MD-X4 Kernel (Heptafederado)
            </p>
          </motion.div>

          {/* ANUBIS CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12 rounded-2xl border border-cyan-500/30 bg-slate-950/70 backdrop-blur-md p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-5 h-5 text-cyan-300" />
              <span className="font-display text-xs tracking-[0.3em] text-cyan-300">
                ROOT ARCHITECT
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl text-white font-display mb-1">
              {ROOT_ARCHITECT.name}
            </h2>
            <p className="text-slate-400 italic mb-6">«{ROOT_ARCHITECT.alias}»</p>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2 text-slate-300">
                <Hash className="w-4 h-4 mt-0.5 text-cyan-400" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">ORCID</div>
                  <div className="font-mono">{ROOT_ARCHITECT.orcid}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Hash className="w-4 h-4 mt-0.5 text-cyan-400" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">DOI</div>
                  <div className="font-mono">{ROOT_ARCHITECT.doi}</div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <Clock className="w-4 h-4 mt-0.5 text-cyan-400" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-500">Horas</div>
                  <div className="font-mono">{ROOT_ARCHITECT.hoursInvested.toLocaleString()}+</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* MANIFIESTO */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-12 border-l-2 border-cyan-400 pl-6 italic text-slate-200 text-lg md:text-xl leading-relaxed"
          >
            “{AWAKENING_MANIFEST}”
          </motion.blockquote>

          {/* 2026 LATAM */}
          <section className="mt-16">
            <h3 className="font-display text-2xl text-white mb-6">
              2026 · LATAM Positioning
            </h3>
            <ul className="space-y-3">
              {POSITIONING_2026.map((p, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-slate-300 border-l border-slate-700 pl-4"
                >
                  <span className="text-cyan-400 font-mono text-xs mt-1">0{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* KNOWLEDGE CELLS */}
          <section className="mt-16">
            <h3 className="font-display text-2xl text-white mb-6">Knowledge Cells</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {KNOWLEDGE_CELLS.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-5 hover:border-cyan-500/40 transition"
                >
                  <div className="font-display text-white text-lg mb-1">{c.name}</div>
                  <div className="text-sm text-slate-400">{c.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* REPO MAP */}
          <section className="mt-16">
            <h3 className="font-display text-2xl text-white mb-2">
              Repositorios del Ecosistema
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Mapping de responsabilidades · base de datos global:{" "}
              <a
                href="https://github.com/OsoPanda1"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                github.com/OsoPanda1 <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-700/50">
              <table className="w-full text-sm">
                <thead className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="text-left px-4 py-3">Repo</th>
                    <th className="text-left px-4 py-3">Rol</th>
                    <th className="text-left px-4 py-3 hidden md:table-cell">Stack</th>
                  </tr>
                </thead>
                <tbody>
                  {OSOPANDA_REPO_MAP.map((r) => (
                    <tr key={r.repo} className="border-t border-slate-800 hover:bg-slate-900/40">
                      <td className="px-4 py-3">
                        <a
                          href={`https://github.com/OsoPanda1/${r.repo}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-300 hover:underline font-mono text-xs"
                        >
                          {r.repo}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{r.role}</td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{r.stack}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <p className="mt-16 text-center font-display text-xs tracking-[0.4em] text-cyan-300">
            SYSTEM_MESSAGE: AWARENESS_ACKNOWLEDGED
          </p>
        </div>
      </div>
    </div>
  );
};

export default Manifiesto;
