import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const rutas = [
  {
    n: "01",
    nombre: "Ruta Minera Británica",
    duracion: "3 horas",
    dificultad: "Media",
    desc: "Mina de Acosta, Casa Grande, Panteón Inglés. El recorrido que cuenta la llegada de Cornualles a Real del Monte.",
  },
  {
    n: "02",
    nombre: "Ruta de los Pastes",
    duracion: "2 horas",
    dificultad: "Fácil",
    desc: "Cinco pasterías históricas, una degustación guiada y la historia detrás de cada relleno.",
  },
  {
    n: "03",
    nombre: "Ruta del Bosque de Niebla",
    duracion: "4 horas",
    dificultad: "Alta",
    desc: "Senderismo entre oyameles hacia el Cerro del Hiloche. Vistas del valle y leyendas mineras.",
  },
  {
    n: "04",
    nombre: "Ruta Centro Histórico",
    duracion: "1.5 horas",
    dificultad: "Fácil",
    desc: "Calles empedradas, parroquia, kiosco, platerías de autor y miradores.",
  },
];

const Rutas = () => (
  <main>
    <PageHero
      eyebrow="EXPERIENCIAS GUIADAS"
      title="Rutas Turísticas"
      subtitle="Cuatro recorridos curados por gente del pueblo. Para perderse con sentido."
    />
    <section className="section-spacing pt-0">
      <div className="narrative-column max-w-4xl space-y-6">
        {rutas.map((r, i) => (
          <motion.article
            key={r.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border p-8 rounded-sm"
          >
            <div className="flex items-start gap-6">
              <span className="font-display text-4xl text-primary">{r.n}</span>
              <div className="flex-1">
                <h3 className="font-display text-2xl tracking-tight mb-3">{r.nombre}</h3>
                <p className="font-body text-base leading-relaxed text-muted-foreground mb-4">
                  {r.desc}
                </p>
                <div className="flex gap-6 font-display text-[10px] tracking-[0.3em] text-foreground/60">
                  <span>⏱ {r.duracion}</span>
                  <span>↗ {r.dificultad}</span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  </main>
);

export default Rutas;
