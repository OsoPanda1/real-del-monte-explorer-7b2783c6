import { motion } from "framer-motion";
import {
  Flame,
  Mountain,
  Ghost,
  Landmark,
  Pickaxe,
  MoonStar,
  ScrollText,
  Clock3,
  MapPinned,
  Sparkles,
  Waves,
} from "lucide-react";

import PageHero from "@/components/PageHero";

const leyendas = [
  {
    t: "El Minero de la Veta Vizcaína",
    icon: Pickaxe,
    era: "Siglo XIX",
    lugar: "Veta Vizcaína",
    ambient: "Niebla · Túneles · Carburo",
    cuerpo:
      "Los viejos trabajadores de la mina aseguraban que, durante las madrugadas cubiertas por niebla, podían escucharse pasos metálicos descendiendo hacia las profundidades de la Veta Vizcaína. Algunos juraban haber visto una lámpara de carburo avanzar lentamente entre los túneles abandonados, aunque al seguirla jamás encontraban a nadie. La leyenda dice que son los mineros atrapados tras los derrumbes históricos que continúan vigilando las entrañas de la montaña.",
  },
  {
    t: "La Dama del Panteón Inglés",
    icon: Ghost,
    era: "Tradición Popular",
    lugar: "Panteón Inglés",
    ambient: "Bosque · Lluvia · Silencio",
    cuerpo:
      "Entre las tumbas británicas cubiertas de musgo aparece, según los habitantes más antiguos, una mujer vestida de blanco que recorre silenciosamente el cementerio durante las noches húmedas. No llora por un hombre ni por un hijo: llora por la distancia, por el océano y por las vidas que jamás pudieron regresar a Cornualles. Algunos visitantes afirman escuchar cantos suaves mezclados con el viento del bosque.",
  },
  {
    t: "Las Luces del Cerro del Hiloche",
    icon: Mountain,
    era: "Fenómeno Popular",
    lugar: "Cerro del Hiloche",
    ambient: "Montaña · Oscuridad · Ecos",
    cuerpo:
      "Desde hace generaciones se habla de luces azules ascendiendo lentamente por las laderas del Hiloche durante noches sin luna. Hay quienes creen que se trata de almas mineras buscando regresar al pueblo. Otros afirman que son emisiones naturales producidas por minerales ocultos bajo la tierra. Lo cierto es que incluso hoy continúan apareciendo relatos de viajeros que aseguran haberlas visto.",
  },
  {
    t: "El Pacto del Paste",
    icon: Flame,
    era: "Memoria Cornish",
    lugar: "Real del Monte",
    ambient: "Fuego · Madrugada · Tradición",
    cuerpo:
      "Las familias descendientes de mineros británicos conservan la creencia de que mientras exista fuego encendido dentro de una pastería, el pueblo jamás quedará completamente abandonado. El paste no era sólo alimento: era supervivencia, refugio y vínculo con el hogar perdido. Por eso muchas panaderías continúan abriendo antes del amanecer como un ritual silencioso de continuidad histórica.",
  },
  {
    t: "La Campana de la Mina Acosta",
    icon: Landmark,
    era: "Leyenda Minera",
    lugar: "Mina Acosta",
    ambient: "Hierro · Eco · Profundidad",
    cuerpo:
      "Viejos relatos narran que, después de accidentes graves, podía escucharse una campana sonar desde el interior de la Mina Acosta incluso cuando no había trabajadores dentro. Algunos interpretaron aquello como advertencia; otros, como una forma de despedida entre compañeros que jamás abandonaron completamente el subsuelo.",
  },
  {
    t: "Los Guardianes de la Niebla",
    icon: MoonStar,
    era: "Tradición Oral",
    lugar: "Bosques de Real del Monte",
    ambient: "Niebla · Montaña · Sombras",
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
  <main className="bg-background text-foreground overflow-hidden relative">
    {/* ATMOSPHERIC LAYERS */}

    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_top,white,transparent_55%)]" />

      <div className="absolute top-0 left-0 w-full h-[700px] bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/[0.03] blur-3xl rounded-full" />
    </div>

    <PageHero
      eyebrow="MEMORIA VIVA · REAL DEL MONTE"
      title="Leyendas entre Niebla y Plata"
      subtitle="Historias nacidas entre túneles, montañas húmedas y generaciones que aprendieron a convivir con el eco de la mina."
    />

    <section className="section-spacing pt-0 relative z-10">
      <div className="narrative-column">
        {/* INTRO */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-32"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-border bg-card/30 backdrop-blur-sm flex items-center justify-center rounded-sm">
              <ScrollText className="w-4 h-4 text-primary" />
            </div>

            <div>
              <p className="tracking-[0.35em] text-[10px] uppercase text-primary">
                Archivo Narrativo del Pueblo
              </p>

              <p className="text-xs text-muted-foreground mt-1">
                Tradición oral · Memoria minera · Patrimonio intangible
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <p className="font-body text-2xl leading-relaxed text-foreground max-w-5xl">
              Real del Monte no sólo conserva arquitectura minera e historia industrial.
              Conserva también algo más difícil de preservar:
              la memoria emocional de un pueblo construido entre niebla, plata y montaña.
            </p>

            <p className="font-body text-lg leading-relaxed text-muted-foreground max-w-4xl">
              Durante generaciones enteras, mineros, familias y viajeros transmitieron relatos
              sobre luces que emergen desde el bosque, campanas que resuenan bajo tierra y figuras
              silenciosas que aparecen cuando la niebla cubre los antiguos caminos mineros.
            </p>

            <p className="font-body text-lg leading-relaxed text-muted-foreground max-w-4xl">
              Algunas historias nacieron como advertencias.
              Otras como formas de duelo.
              Y otras simplemente porque existen lugares donde la historia deja marcas demasiado profundas para desaparecer por completo.
            </p>
          </div>
        </motion.div>

        {/* TIMELINE */}

        <div className="mb-36">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 border border-border bg-card/30 backdrop-blur-sm flex items-center justify-center rounded-sm">
              <Clock3 className="w-5 h-5 text-primary" />
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl tracking-wide font-display">
                CONTEXTO HISTÓRICO
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                Línea histórica que dio origen a la identidad minera del pueblo.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-[11px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-border to-transparent" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-1 w-[22px] h-[22px] rounded-full border border-primary/40 bg-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  <p className="font-body text-lg text-muted-foreground leading-relaxed">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* LEGENDS */}

        <div className="space-y-28">
          {leyendas.map((l, i) => {
            const Icon = l.icon;

            return (
              <motion.article
                key={l.t}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.06 }}
                className="group relative overflow-hidden"
              >
                {/* BACKGROUND CARD */}

                <div className="absolute inset-0 border border-border bg-card/20 backdrop-blur-md rounded-sm" />

                {/* AMBIENT LIGHT */}

                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/[0.04] blur-3xl rounded-full transition-all duration-700 group-hover:scale-125" />

                {/* CONTENT */}

                <div className="relative z-10 p-8 md:p-14">
                  {/* TOP */}

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 mb-10">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-sm border border-border bg-background/40 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>

                      <div>
                        <h2 className="text-3xl md:text-4xl font-display tracking-wide leading-tight">
                          {l.t}
                        </h2>

                        <div className="flex flex-wrap gap-3 mt-5">
                          <div className="flex items-center gap-2 border border-border bg-background/30 px-3 py-2 rounded-sm">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />

                            <p className="text-[10px] tracking-[0.25em] uppercase text-primary">
                              {l.era}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 border border-border bg-background/30 px-3 py-2 rounded-sm">
                            <MapPinned className="w-3.5 h-3.5 text-primary" />

                            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                              {l.lugar}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 border border-border bg-background/30 px-3 py-2 rounded-sm">
                            <Waves className="w-3.5 h-3.5 text-primary" />

                            <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                              {l.ambient}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BODY */}

                  <div className="max-w-5xl">
                    <p className="font-body text-lg md:text-xl leading-relaxed text-muted-foreground">
                      {l.cuerpo}
                    </p>
                  </div>
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
          transition={{ duration: 1 }}
          className="mt-40 relative overflow-hidden"
        >
          <div className="absolute inset-0 border border-border bg-card/20 backdrop-blur-md rounded-sm" />

          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-transparent" />

          <div className="relative z-10 p-12 md:p-16 text-center">
            <p className="font-display text-[10px] tracking-[0.4em] text-primary mb-6">
              REAL DEL MONTE · MEMORIA MINERA
            </p>

            <p className="font-body italic text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              “Hay pueblos donde las historias se cuentan.
              Y hay pueblos donde las historias todavía parecen respirar entre la niebla.”
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Leyendas;
