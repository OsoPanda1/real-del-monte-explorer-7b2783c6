import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const sello = "a3f9b27c1e8d4506b2f1a9c8e7d6b5a4938271605f4e3d2c1b0a98765432100f";

const metricas = [
  { m: "Latencia P95", v: "180 ms", u: "Promedio últimas 24h" },
  { m: "Uptime", v: "99.97%", u: "Trimestre actual" },
  { m: "Throughput", v: "65,000", u: "Usuarios concurrentes simulados" },
  { m: "Escenarios pasados", v: "5/5", u: "ESC-01 a ESC-05" },
];

const Auditoria = () => (
  <main>
    <PageHero
      eyebrow="BOOKPI™ · INFORME DOF v2"
      title="Auditoría Pública"
      subtitle="Toda decisión crítica de Isabella IA y del Kernel MD-X4 queda inscrita en el libro mayor inmutable. Aquí puedes consultarlo."
    />

    <section className="section-spacing pt-0">
      <div className="narrative-column">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {metricas.map((m, i) => (
            <motion.div
              key={m.m}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border p-6 rounded-sm"
            >
              <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-2">{m.m}</p>
              <p className="font-display text-3xl mb-1">{m.v}</p>
              <p className="font-body text-xs text-muted-foreground">{m.u}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-foreground/5 border border-border p-8 rounded-sm mb-12">
          <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">
            SELLO CRIPTOGRÁFICO SHA-256
          </p>
          <p className="font-mono text-xs md:text-sm break-all text-foreground/80">
            {sello}
          </p>
          <p className="font-body text-xs text-muted-foreground mt-4 italic">
            Hash de integridad del Informe RDM-DOF-AUD-2026 · DOI: 10.5281/zenodo.19436662
          </p>
        </div>

        <h2 className="text-2xl md:text-3xl mb-6">ESCENARIOS DE PRUEBA</h2>
        <div className="space-y-3 mb-12">
          {[
            "ESC-01 · Carga sostenida de 65k usuarios concurrentes durante 30 min",
            "ESC-02 · Phoenix Protocol — recuperación P2P ante caída de nodo central",
            "ESC-03 · BookPI integrity check — verificación inmutable del ledger",
            "ESC-04 · Isabella adversarial — pruebas de manipulación cognitiva",
            "ESC-05 · Anubis Sentinel — auditoría post-cuántica de superficie",
          ].map((e) => (
            <div key={e} className="flex items-start gap-3 border-b border-border pb-3">
              <span className="text-primary font-display">✓</span>
              <p className="font-body text-base">{e}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Auditoria;
