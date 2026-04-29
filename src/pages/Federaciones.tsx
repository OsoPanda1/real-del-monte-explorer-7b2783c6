import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const federaciones = [
  {
    n: "01",
    nombre: "Hospedaje",
    desc: "Hoteles, posadas, hostales y rentas cortas. Inventario en tiempo real, reservas y reputación verificada.",
    base: "20 establecimientos",
  },
  {
    n: "02",
    nombre: "Gastronómica",
    desc: "Restaurantes, cafés y las emblemáticas pasterías. Menús, agenda y rutas gastronómicas curadas.",
    base: "20 negocios",
  },
  {
    n: "03",
    nombre: "Platería y Artesanía",
    desc: "Talleres de autor y puntos de venta directa, con trazabilidad de origen y certificación local.",
    base: "70 talleres",
  },
  {
    n: "04",
    nombre: "Comercio y Servicios",
    desc: "Bares, tiendas, servicios locales. Catálogo digital con geolocalización y micropagos.",
    base: "100+ comercios",
  },
  {
    n: "05",
    nombre: "Guías y Experiencias",
    desc: "Rutas mineras, senderismo y recorridos históricos certificados por la propia comunidad.",
    base: "Guías locales",
  },
  {
    n: "06",
    nombre: "Cultura y Memoria",
    desc: "Panteón Inglés, museos y archivo vivo de leyendas. Patrimonio inmaterial inscrito en BookPI™.",
    base: "Memoria viva",
  },
  {
    n: "07",
    nombre: "Inteligencia (Isabella IA)",
    desc: "Capa cognitiva soberana 24/7. Recomendaciones contextuales, auditoría ética y mediación XR.",
    base: "Soberano digital",
  },
];

const Federaciones = () => (
  <main>
    <PageHero
      eyebrow="ARQUITECTURA HEPTAFEDERADA"
      title="Las 7 Federaciones"
      subtitle="Siete subsistemas autónomos que sostienen el Sistema Operativo Territorial. Si uno falla, el conjunto no se cae."
    />

    <section className="section-spacing pt-0">
      <div className="narrative-column max-w-5xl">
        <div className="grid md:grid-cols-2 gap-6">
          {federaciones.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-card border border-border p-6 rounded-sm"
            >
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-display text-3xl text-primary">{f.n}</span>
                <h3 className="font-display text-xl tracking-wide">{f.nombre}</h3>
              </div>
              <p className="font-body text-base leading-relaxed text-muted-foreground mb-3">
                {f.desc}
              </p>
              <p className="font-display text-[10px] tracking-[0.3em] text-primary/80">
                {f.base}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Federaciones;
