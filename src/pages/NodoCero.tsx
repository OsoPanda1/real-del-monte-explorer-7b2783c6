import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { heptaNuclei, ecosystemMeta, repos } from "@/data/tamvEcosystem";

const statusColor: Record<string, string> = {
  óptimo: "text-primary",
  operativo: "text-foreground",
  vigilancia: "text-muted-foreground",
};

const NodoCero = () => {
  const avg =
    heptaNuclei.reduce((a, n) => a + n.resistance, 0) / heptaNuclei.length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-6 md:px-16 pt-24 pb-12 border-b border-border">
        <Link to="/" className="font-display text-xs tracking-widest text-muted-foreground hover:text-primary">
          ← REAL DEL MONTE
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-7xl mt-6 leading-none"
        >
          Nodo <span className="text-primary">Cero</span>
        </motion.h1>
        <p className="font-body text-lg mt-6 max-w-3xl text-foreground/80">
          Dashboard institucional del sistema RDM Smart City OS. Estado de los siete núcleos
          heptafederados, métricas operativas y trazabilidad inmutable.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 font-display text-xs tracking-widest">
          <Stat label="CALIFICACIÓN" value="ANTI-FRÁGIL" accent />
          <Stat label="RESISTENCIA MEDIA" value={`${avg.toFixed(2)}%`} accent />
          <Stat label="LATENCIA P95" value="85 ms" />
          <Stat label="USUARIOS PICO" value="65,000" />
          <Stat label="UPTIME" value="99.97%" />
          <Stat label="THROUGHPUT" value="260 tx/s" />
          <Stat label="REPOSITORIOS" value={String(repos.length)} />
          <Stat label="ORCID" value={ecosystemMeta.orcid} />
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 border-b border-border">
        <h2 className="font-display text-2xl mb-8">
          Núcleos <span className="text-primary">heptafederados</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heptaNuclei.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="p-6 bg-card border border-border"
            >
              <div className="flex items-baseline justify-between mb-2">
                <h3 className="font-display text-lg">{n.name}</h3>
                <span className={`font-display text-[10px] tracking-widest ${statusColor[n.status]}`}>
                  {n.status.toUpperCase()}
                </span>
              </div>
              <p className="font-display text-[10px] tracking-widest text-primary mb-4">
                {n.domain}
              </p>
              <p className="font-body text-sm text-foreground/70 mb-5 leading-relaxed">
                {n.description}
              </p>
              <div className="h-1 bg-muted">
                <div
                  className="h-1 bg-primary"
                  style={{ width: `${n.resistance}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between font-display text-[10px] tracking-widest text-muted-foreground">
                <span>RESISTENCIA</span>
                <span className="text-foreground">{n.resistance.toFixed(1)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 border-b border-border">
        <h2 className="font-display text-2xl mb-6">
          Sellado <span className="text-primary">BookPI™</span>
        </h2>
        <div className="bg-card border border-border p-6 font-mono text-xs md:text-sm break-all leading-relaxed">
          <div className="text-muted-foreground">SHA-256</div>
          <div className="mt-1">
            9c4f2a1b8e7d6c5f4a3b2e1d0c9b8a7f6e5d4c3b2a190f8e7d6c5b4a3f2e1d0c9
          </div>
          <div className="text-muted-foreground mt-4">URI</div>
          <div className="mt-1">bpi://rdm-2026/audit/dof-v2#sealed</div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-12 grid md:grid-cols-2 gap-6">
        <Link
          to="/ecosistema"
          className="block p-8 bg-card border border-border hover:border-primary transition-colors group"
        >
          <p className="font-display text-[10px] tracking-widest text-primary mb-3">EXPLORAR</p>
          <h3 className="font-display text-2xl group-hover:text-primary transition-colors">
            Ecosistema TAMV →
          </h3>
          <p className="font-body text-sm text-foreground/70 mt-3">
            {repos.length} repositorios categorizados del universo OsoPanda1.
          </p>
        </Link>
        <Link
          to="/directorio"
          className="block p-8 bg-card border border-border hover:border-primary transition-colors group"
        >
          <p className="font-display text-[10px] tracking-widest text-primary mb-3">TERRITORIO</p>
          <h3 className="font-display text-2xl group-hover:text-primary transition-colors">
            Directorio del pueblo →
          </h3>
          <p className="font-body text-sm text-foreground/70 mt-3">
            Comercios, oficios y servicios de Real del Monte.
          </p>
        </Link>
      </section>
    </main>
  );
};

const Stat = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <div className="text-muted-foreground mb-1">{label}</div>
    <div className={`text-sm ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
  </div>
);

export default NodoCero;
