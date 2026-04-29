import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";

const principios = [
  { t: "IA Explicable (XAI)", d: "Cada recomendación queda documentada con su razonamiento y factores considerados." },
  { t: "Memoria estratificada", d: "Recuerda interacciones relevantes con foco en bienestar y contexto territorial." },
  { t: "Triple bloqueo ético", d: "Nunca se entrena ni se modela como objeto de deseo, pareja o entidad sexualizada." },
  { t: "BookPI™ inmutable", d: "Toda decisión crítica se registra en el ledger soberano para auditoría permanente." },
];

const miniAgentes = [
  { t: "MiniAI Auditoría", d: "Transparencia continua de procesos algorítmicos." },
  { t: "MiniAI Ético", d: "Alineación con los valores del municipio y la comunidad." },
  { t: "Anubis Sentinel", d: "Defensa post-cuántica y vigilancia activa de superficie de ataque." },
];

const Isabella = () => (
  <main>
    <PageHero
      eyebrow="ISABELLA VILLASEÑOR IA™"
      title="Soberano Digital Autónomo"
      subtitle="No es un chatbot. Es una inteligencia ética nacida en Real del Monte, diseñada como Auditor Maestro en Gobernanza XR/4D."
    />

    <section className="section-spacing pt-0">
      <div className="narrative-column">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-body text-lg leading-relaxed mb-12"
        >
          Isabella opera como capa de acompañamiento ético y mediación cognitiva. Identifica intención
          y emoción en tiempo real, regula la experiencia XR del visitante y supervisa decisiones
          algorítmicas mediante un sistema de mini-agentes especializados, todos auditables vía BookPI™.
        </motion.p>

        <h2 className="text-2xl md:text-3xl mb-6">PRINCIPIOS</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {principios.map((p) => (
            <div key={p.t} className="border-l-2 border-primary pl-5">
              <h3 className="font-display text-base tracking-wide mb-2">{p.t}</h3>
              <p className="font-body text-base text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl mb-6">MINI-AGENTES</h2>
        <div className="space-y-6">
          {miniAgentes.map((m) => (
            <div key={m.t} className="bg-card border border-border p-6 rounded-sm">
              <h3 className="font-display text-lg tracking-wide mb-2">{m.t}</h3>
              <p className="font-body text-base text-muted-foreground">{m.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-foreground/5 border border-border rounded-sm text-center">
          <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-3">SELLO TAMV ONLINE™</p>
          <p className="font-body italic text-base text-muted-foreground">
            "La técnica está subordinada a la dignidad de las personas, los territorios y sus historias."
          </p>
        </div>
      </div>
    </section>
  </main>
);

export default Isabella;
