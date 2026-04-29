import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const sections = [
  {
    title: "TERRITORIO",
    subtitle: "El pueblo que se camina",
    body: "Pastes, minas, panteón inglés, calles empedradas, rutas, leyendas y la agenda viva del Pueblo Mágico.",
    items: [
      { label: "Pastes", path: "/pastes" },
      { label: "Minas", path: "/minas" },
      { label: "Cementerio", path: "/cementerio" },
      { label: "Calles", path: "/calles" },
      { label: "Rutas turísticas", path: "/rutas" },
      { label: "Leyendas", path: "/leyendas" },
      { label: "Eventos", path: "/eventos" },
    ],
  },
  {
    title: "ECOSISTEMA",
    subtitle: "TAMV Online · 7 Federaciones · IA",
    body: "La arquitectura heptafederada, Isabella IA, BookPI, el catálogo de repositorios y el directorio de comercios soberanos.",
    items: [
      { label: "Plataforma RDM Digital", path: "/plataforma" },
      { label: "Las 7 Federaciones", path: "/federaciones" },
      { label: "Isabella Villaseñor IA", path: "/isabella" },
      { label: "Ecosistema GitHub", path: "/ecosistema" },
      { label: "Directorio comercial", path: "/directorio" },
      { label: "Mapa interactivo", path: "/mapa" },
    ],
  },
  {
    title: "GOBERNANZA",
    subtitle: "Soberanía digital del territorio",
    body: "Nodo Cero, sello criptográfico BookPI™, auditoría DOF y propuesta formal al cabildo de Mineral del Monte.",
    items: [
      { label: "Nodo Cero", path: "/nodo-cero" },
      { label: "Auditoría · BookPI", path: "/auditoria" },
      { label: "Propuesta Municipal", path: "/propuesta" },
      { label: "Acceso institucional", path: "/auth" },
    ],
  },
];

const Plataforma = () => (
  <main>
    <PageHero
      eyebrow="RDM DIGITAL · TAMV ONLINE"
      title="Sistema Operativo Territorial"
      subtitle="Tres mundos articulados sobre una misma infraestructura soberana, nacida en Real del Monte."
    />

    <section className="section-spacing pt-0">
      <div className="narrative-column max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-card border border-border p-8 rounded-sm flex flex-col"
            >
              <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="text-2xl mb-2">{s.title}</h2>
              <p className="font-body italic text-sm text-muted-foreground mb-4">
                {s.subtitle}
              </p>
              <p className="font-body text-base leading-relaxed mb-6 flex-1">
                {s.body}
              </p>
              <ul className="space-y-2 border-t border-border pt-4">
                {s.items.map((it) => (
                  <li key={it.path}>
                    <Link
                      to={it.path}
                      className="font-display text-sm tracking-wide text-foreground hover:text-primary transition-colors"
                    >
                      → {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default Plataforma;
