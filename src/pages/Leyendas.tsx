import { motion } from "framer-motion";
import {
  Flame,
  Mountain,
  Ghost,
  Landmark,
  Pickaxe,
  MoonStar,
  ScrollText,
} from "lucide-react";

import PageHero from "@/components/PageHero";

const leyendas = [
  {
    t: "El Minero de la Veta Vizcaína",
    icon: Pickaxe,
    era: "Siglo XIX",
    cuerpo:
      "Los viejos trabajadores de la mina aseguraban que, durante las madrugadas cubiertas por niebla, podían escucharse pasos metálicos descendiendo hacia las profundidades de la Veta Vizcaína. Algunos juraban haber visto una lámpara de carburo avanzar lentamente entre los túneles abandonados, aunque al seguirla jamás encontraban a nadie. La leyenda dice que son los mineros atrapados tras los derrumbes históricos que continúan vigilando las entrañas de la montaña.",
  },
  {
    t: "La Dama del Panteón Inglés",
    icon: Ghost,
    era: "Tradición Popular",
    cuerpo:
      "Entre las tumbas británicas cubiertas de musgo aparece, según los habitantes más antiguos, una mujer vestida de blanco que recorre silenciosamente el cementerio durante las noches húmedas. No llora por un hombre ni por un hijo: llora por la distancia, por el océano y por las vidas que jamás pudieron regresar a Cornualles. Algunos visitantes afirman escuchar cantos suaves mezclados con el viento del bosque.",
  },
  {
    t: "Las Luces del Cerro del Hiloche",
    icon: Mountain,
    era: "Fenómeno Popular",
    cuerpo:
      "Desde hace generaciones se habla de luces azules ascendiendo lentamente por las laderas del Hiloche durante noches sin luna. Hay quienes creen que se trata de almas mineras buscando regresar al pueblo. Otros afirman que son emisiones naturales producidas por minerales ocultos bajo la tierra. Lo cierto es que incluso hoy continúan apareciendo relatos de viajeros que aseguran haberlas visto.",
  },
  {
    t: "El Pacto del Paste",
    icon: Flame,
    era: "Memoria Cornish",
    cuerpo:
      "Las familias descendientes de mineros británicos conservan la creencia de que mientras exista fuego encendido dentro de una pastería, el pueblo jamás quedará completamente abandonado. El paste no era sólo alimento: era supervivencia, refugio y vínculo con el hogar perdido. Por eso muchas panaderías continúan abriendo antes del amanecer como un ritual silencioso de continuidad histórica.",
  },
  {
    t: "La Campana de la Mina Acosta",
    icon: Landmark,
    era: "Leyenda Minera",
    cuerpo:
      "Viejos relatos narran que, después de accidentes graves, podía escucharse una campana sonar desde el interior de la Mina Acosta incluso cuando no había trabajadores dentro. Algunos interpretaron aquello como advertencia; otros, como una forma de despedida entre compañeros que jamás abandonaron completamente el subsuelo.",
  },
  {
    t: "Los Guardianes de la Niebla",
    icon: MoonStar,
    era: "Tradición Oral",
    cuerpo:
      "Existe la creencia de que Real del Monte posee una niebla distinta a cualquier otra de Hidalgo. Los ancianos decían que ciertas madrugadas la montaña parecía observar al pueblo. Bajo esa neblina, algunos aseguran haber visto siluetas inmóviles cerca de antiguos caminos mineros, figuras que desaparecen en cuanto alguien intenta acercarse.",
  },
];

const timeline = [
  "1527 — Primeros registros mineros en la región.",
  "1760 — Auge de la plata y expansión minera.",
  "1824 — Llegada de los mineros de Cornualles.",
  "1865 — Consolidación de Real del Monte como centro minero.",
  "1900+ — Nacimiento de las leyendas modernas del pueblo.",
];

const Leyendas = () => (
  <main className="bg-background text-foreground overflow-hidden">
    <PageHero
      eyebrow="MEMORIA VIVA · REAL DEL MONTE"
      title="Leyendas entre Niebla y Plata"
      subtitle="Historias nacidas entre túneles, montañas húmedas y generaciones que aprendieron a convivir con el eco de la mina."
    />

    <section className="section-spacing pt-0 relative">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_top,white,transparent_60%)] pointer-events-none" />

      <div className="narrative-column relative z-10">
        {/* INTRO */}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-6">
            <ScrollText className="w-5 h-5 text-primary" />
            <p className="tracking-[0.25em] text-[11px] uppercase text-primary">
              Archivo Narrativo del Pueblo
            </p>
          </div>

          <p className="font-body text-xl leading-relaxed text-muted-foreground max-w-4xl">
            Real del Monte no sólo conserva arquitectura minera y memoria histórica.
            Conserva también relatos transmitidos por generaciones enteras:
            historias de túneles donde aún resuenan herramientas invisibles,
            luces que emergen desde la montaña y figuras que aparecen entre la niebla.
          </p>

          <p className="font-body text-lg leading-relaxed text-muted-foreground mt-6 max-w-4xl">
            Algunas leyendas nacieron como advertencias. Otras como consuelo.
            Y otras simplemente surgieron porque hay lugares donde la historia
            deja marcas demasiado profundas para desaparecer por completo.
          </p>
        </motion.div>

        {/* TIMELINE */}

        <div className="mb-28">
          <div className="flex items-center gap-3 mb-8">
            <Landmark className="w-5 h-5 text-primary" />
            <h2 className="text-2xl md:text-3xl tracking-wide font-display">
              CONTEXTO HISTÓRICO
            </h2>
          </div>

          <div className="border-l border-border pl-6 space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative"
              >
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-primary" />

                <p className="font-body text-muted-foreground leading-relaxed">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* LEGENDS */}

        <div className="space-y-24">
          {leyendas.map((l, i) => {
            const Icon = l.icon;

            return (
              <motion.article
                key={l.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08 }}
                className="relative border border-border bg-card/20 backdrop-blur-sm rounded-sm p-8 md:p-12 overflow-hidden"
              >
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm border border-border flex items-center justify-center bg-background/50">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <h2 className="text-2xl md:text-3xl font-display tracking-wide">
                          {l.t}
                        </h2>

                        <p className="text-[11px] uppercase tracking-[0.25em] text-primary mt-2">
                          {l.era}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="font-body text-lg leading-relaxed text-muted-foreground">
                    {l.cuerpo}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* FINAL BLOCK */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 border border-border bg-card/20 backdrop-blur-sm p-10 rounded-sm text-center"
        >
          <p className="font-display text-[10px] tracking-[0.35em] text-primary mb-5">
            REAL DEL MONTE · MEMORIA MINERA
          </p>

          <p className="font-body italic text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            “Hay pueblos donde las historias se cuentan.
            Y hay pueblos donde las historias todavía parecen respirar
            entre la niebla.”
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Leyendas;
