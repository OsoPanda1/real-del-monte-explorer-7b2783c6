import { motion } from "framer-motion";
import {
  ShieldCheck,
  BrainCircuit,
  Database,
  Network,
  Eye,
  Activity,
  Landmark,
  LockKeyhole,
} from "lucide-react";

import PageHero from "@/components/PageHero";

const principios = [
  {
    t: "Explainable AI (XAI)",
    d: "Every recommendation is fully traceable through transparent reasoning layers, contextual weighting, and ethical arbitration logs.",
  },
  {
    t: "Stratified Memory System",
    d: "Territorial, emotional, and behavioral context is processed through layered sovereign memory structures.",
  },
  {
    t: "Triple Ethical Lock",
    d: "The system is permanently restricted from romantic, parasocial, manipulative, or sexualized behavioral modeling.",
  },
  {
    t: "Immutable BookPI™ Ledger",
    d: "Critical decisions are permanently registered for sovereign auditability and governance traceability.",
  },
];

const miniAgentes = [
  {
    t: "MiniAI Audit",
    d: "Continuous verification and transparency of algorithmic processes and decision chains.",
    icon: ShieldCheck,
  },
  {
    t: "Ethical Arbitration Layer",
    d: "Alignment engine focused on dignity, territorial values, and civic behavioral integrity.",
    icon: BrainCircuit,
  },
  {
    t: "Anubis Sentinel",
    d: "Persistent threat monitoring, sovereign defense orchestration, and post-quantum surface surveillance.",
    icon: LockKeyhole,
  },
];

const cognitiveLayers = [
  {
    t: "Citizen Interaction Layer",
    d: "Interprets human interaction signals, behavioral context, and experiential intent.",
    icon: Eye,
  },
  {
    t: "Cognitive Interpretation Core",
    d: "Processes semantic intent, emotional modulation, and adaptive response synthesis.",
    icon: BrainCircuit,
  },
  {
    t: "Ethical Governance Engine",
    d: "Applies constitutional ethical constraints before operational execution.",
    icon: Landmark,
  },
  {
    t: "Territorial Memory Matrix",
    d: "Stores contextual and historical relevance tied to local identity and continuity.",
    icon: Database,
  },
  {
    t: "Adaptive Sovereign Network",
    d: "Coordinates distributed governance agents and dynamic intelligence routing.",
    icon: Network,
  },
];

const status = [
  { label: "Ethical Governance", value: "ACTIVE" },
  { label: "Auditability", value: "VERIFIED" },
  { label: "Behavioral Monitoring", value: "ONLINE" },
  { label: "BookPI™ Integrity", value: "STABLE" },
  { label: "Sentinel Security", value: "ENABLED" },
  { label: "Cognitive Routing", value: "OPERATIONAL" },
];

const Isabella = () => (
  <main className="bg-background text-foreground">
    <PageHero
      eyebrow="ISABELLA VILLASEÑOR IA™"
      title="Cognitive Governance Infrastructure"
      subtitle="An ethical sovereign intelligence layer designed for adaptive digital ecosystems, institutional trust, and territorial cognitive governance."
    />

    <section className="section-spacing pt-0">
      <div className="narrative-column">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="font-body text-lg leading-relaxed text-muted-foreground">
            Isabella Villaseñor IA™ is not designed as a conventional chatbot.
            It operates as a sovereign cognitive mediation infrastructure focused on
            ethical governance, contextual intelligence, and adaptive institutional interaction.
          </p>

          <p className="font-body text-lg leading-relaxed text-muted-foreground mt-6">
            The system interprets behavioral intent, supervises algorithmic integrity,
            regulates immersive XR experiences, and coordinates specialized governance agents
            through auditable sovereign protocols powered by BookPI™.
          </p>
        </motion.div>

        {/* SYSTEM STATUS */}

        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-display tracking-wide">
              SYSTEM STATUS
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {status.map((s) => (
              <div
                key={s.label}
                className="border border-border bg-card/40 backdrop-blur-sm p-5 rounded-sm"
              >
                <p className="text-[10px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
                  {s.label}
                </p>

                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="font-display tracking-wide text-sm">
                    {s.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRINCIPLES */}

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-8 font-display tracking-wide">
            GOVERNANCE PRINCIPLES
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {principios.map((p) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-border bg-card/30 p-6 rounded-sm"
              >
                <h3 className="font-display text-base tracking-wide mb-3">
                  {p.t}
                </h3>

                <p className="font-body text-muted-foreground leading-relaxed">
                  {p.d}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* COGNITIVE LAYERS */}

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-8 font-display tracking-wide">
            COGNITIVE ARCHITECTURE
          </h2>

          <div className="space-y-5">
            {cognitiveLayers.map((layer) => {
              const Icon = layer.icon;

              return (
                <motion.div
                  key={layer.t}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="border border-border bg-card/20 p-6 rounded-sm flex gap-5"
                >
                  <div className="mt-1">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-display tracking-wide text-base mb-2">
                      {layer.t}
                    </h3>

                    <p className="font-body text-muted-foreground leading-relaxed">
                      {layer.d}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* MINI AGENTS */}

        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl mb-8 font-display tracking-wide">
            ACTIVE MINI-AGENTS
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {miniAgentes.map((m) => {
              const Icon = m.icon;

              return (
                <motion.div
                  key={m.t}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="border border-border bg-card/40 p-6 rounded-sm"
                >
                  <div className="mb-5">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <h3 className="font-display text-base tracking-wide mb-3">
                    {m.t}
                  </h3>

                  <p className="font-body text-muted-foreground leading-relaxed">
                    {m.d}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FINAL BLOCK */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 border border-border bg-card/20 backdrop-blur-sm p-10 rounded-sm text-center"
        >
          <p className="font-display text-[10px] tracking-[0.35em] text-primary mb-5">
            TAMV ONLINE™ — ETHICAL SOVEREIGN SYSTEMS
          </p>

          <p className="font-body italic text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            “Technology must remain subordinate to human dignity,
            territorial identity, institutional trust, and the continuity
            of collective memory.”
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default Isabella;
