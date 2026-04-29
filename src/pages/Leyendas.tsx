import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const leyendas = [
  {
    t: "El Minero de la Veta Vizcaína",
    cuerpo:
      "Cuentan que en las noches de niebla, los mineros que aún trabajan turnos largos escuchan los pasos de un compañero al fondo del túnel. Cuando voltean, no hay nadie. Sólo el eco de un casco que cae al suelo de roca.",
  },
  {
    t: "La Llorona del Panteón Inglés",
    cuerpo:
      "Una mujer vestida de blanco recorre las 755 tumbas británicas. No llora por sus hijos, dicen — llora por el mar que separó a estos hombres de su casa. Sus lápidas miran hacia Inglaterra; ella mira hacia el bosque.",
  },
  {
    t: "Las Luces del Cerro del Hiloche",
    cuerpo:
      "En noches sin luna, luces azules ascienden por la ladera. Algunos creen que son los mineros muertos buscando el camino de regreso. Otros, que es plata pura aflorando a la superficie.",
  },
  {
    t: "El Pacto del Paste",
    cuerpo:
      "Una panadera de Cornualles juró que mientras hubiera un paste horneándose en Real del Monte, sus mineros nunca quedarían en el frío. Hoy, las pasterías abren al alba — por costumbre, por respeto o por miedo.",
  },
];

const Leyendas = () => (
  <main>
    <PageHero
      eyebrow="MEMORIA VIVA"
      title="Leyendas del Pueblo"
      subtitle="Historias que se cuentan en voz baja, entre la niebla y el humo del paste."
    />
    <section className="section-spacing pt-0">
      <div className="narrative-column">
        {leyendas.map((l, i) => (
          <motion.article
            key={l.t}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="mb-16 last:mb-0"
          >
            <h2 className="text-2xl md:text-3xl mb-4">{l.t}</h2>
            <p className="font-body text-lg leading-relaxed italic">{l.cuerpo}</p>
          </motion.article>
        ))}
      </div>
    </section>
  </main>
);

export default Leyendas;
