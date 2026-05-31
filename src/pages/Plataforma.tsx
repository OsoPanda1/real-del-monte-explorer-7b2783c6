import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Compass,
  Shield,
  Sparkles,
  Map,
  Network,
  Landmark,
  Store,
  Bot,
  BookOpen,
  Globe,
  Layers3,
  LayoutGrid,
  Star,
  Radio,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SectionItem = {
  label: string;
  path: string;
  note?: string;
  accent?: string;
};

type SectionBlock = {
  title: string;
  subtitle: string;
  body: string;
  eyebrow: string;
  variant: "territory" | "ecosystem" | "governance";
  icon: any;
  metrics: { label: string; value: string }[];
  items: SectionItem[];
  featured?: SectionItem;
  chip?: string;
};

const sections: SectionBlock[] = [
  {
    title: "Territorio",
    subtitle: "El pueblo que se camina",
    eyebrow: "01 · CAPA FÍSICA",
    variant: "territory",
    icon: Compass,
    chip: "Memoria + movilidad + patrimonio",
    body: "Pastes, minas, panteón inglés, calles empedradas, rutas, leyendas y la agenda viva del Pueblo Mágico convergen aquí en una capa territorial legible, navegable y sensorial.",
    metrics: [
      { label: "Capas", value: "7" },
      { label: "Recorridos", value: "Vivos" },
      { label: "Estado", value: "Activo" },
    ],
    featured: { label: "Explorar territorio", path: "/mapa", note: "Vista general" },
    items: [
      { label: "Pastes", path: "/pastes", note: "Cultura gastronómica" },
      { label: "Minas", path: "/minas", note: "Memoria extractiva" },
      { label: "Cementerio", path: "/cementerio", note: "Patrimonio simbólico" },
      { label: "Calles", path: "/calles", note: "Trazado urbano" },
      { label: "Rutas turísticas", path: "/rutas", note: "Circuitos de visita" },
      { label: "Leyendas", path: "/leyendas", note: "Narrativa oral" },
      { label: "Eventos", path: "/eventos", note: "Agenda territorial" },
    ],
  },
  {
    title: "Ecosistema",
    subtitle: "TAMV Online · 7 Federaciones · IA",
    eyebrow: "02 · CAPA DIGITAL",
    variant: "ecosystem",
    icon: Network,
    chip: "Infraestructura + federación + inteligencia",
    body: "La arquitectura heptafederada, Isabella IA, BookPI, el catálogo de repositorios y el directorio de comercios soberanos se organizan como un sistema operativo digital del territorio.",
    metrics: [
      { label: "Federaciones", value: "7" },
      { label: "IA", value: "1" },
      { label: "Kernel", value: "Online" },
    ],
    featured: { label: "Entrar al ecosistema", path: "/ecosistema", note: "Núcleo digital" },
    items: [
      { label: "Plataforma RDM Digital", path: "/plataforma", note: "Nodo central" },
      { label: "Las 7 Federaciones", path: "/federaciones", note: "Estructura distribuida" },
      { label: "Isabella Villaseñor IA", path: "/isabella", note: "Capa cognitiva" },
      { label: "Ecosistema GitHub", path: "/ecosistema", note: "Repositorio vivo" },
      { label: "Directorio comercial", path: "/directorio", note: "Red local" },
      { label: "Mapa interactivo", path: "/mapa", note: "Visualización territorial" },
    ],
  },
  {
    title: "Gobernanza",
    subtitle: "Soberanía digital del territorio",
    eyebrow: "03 · CAPA INSTITUCIONAL",
    variant: "governance",
    icon: Shield,
    chip: "Confianza + trazabilidad + legitimidad",
    body: "Nodo Cero, sello criptográfico BookPI™, auditoría DOF y propuesta formal al cabildo de Mineral del Monte consolidan la capa de gobierno digital con trazabilidad y blindaje documental.",
    metrics: [
      { label: "Nodos", value: "0→∞" },
      { label: "Auditoría", value: "BookPI" },
      { label: "Acceso", value: "Seguro" },
    ],
    featured: { label: "Abrir gobernanza", path: "/nodo-cero", note: "Centro de control" },
    items: [
      { label: "Nodo Cero", path: "/nodo-cero", note: "Marco raíz" },
      { label: "Auditoría · BookPI", path: "/auditoria", note: "Blindaje y validación" },
      { label: "Propuesta Municipal", path: "/propuesta", note: "Ruta institucional" },
      { label: "Acceso institucional", path: "/auth", note: "Entrada segura" },
    ],
  },
];

const variantMeta: Record<
  SectionBlock["variant"],
  { ring: string; glow: string; card: string; badge: string }
> = {
  territory: {
    ring: "border-rdm-gold/25",
    glow: "shadow-[0_0_40px_rgba(212,178,106,0.12)]",
    card: "bg-gradient-to-br from-rdm-night/80 via-rdm-night/60 to-rdm-night/80",
    badge: "bg-rdm-gold/10 text-rdm-gold border-rdm-gold/30",
  },
  ecosystem: {
    ring: "border-rdm-oxygen/25",
    glow: "shadow-[0_0_40px_rgba(0,160,255,0.12)]",
    card: "bg-gradient-to-br from-rdm-night/80 via-rdm-night/55 to-rdm-night/80",
    badge: "bg-rdm-oxygen/10 text-rdm-oxygen border-rdm-oxygen/30",
  },
  governance: {
    ring: "border-rdm-candle/25",
    glow: "shadow-[0_0_40px_rgba(255,193,7,0.12)]",
    card: "bg-gradient-to-br from-rdm-night/80 via-rdm-night/55 to-rdm-night/80",
    badge: "bg-rdm-candle/10 text-rdm-candle border-rdm-candle/30",
  },
};

const FeatureCard = ({ item, index }: { item: SectionItem; index: number }) => (
  <motion.li
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-20% 0px" }}
    transition={{ duration: 0.45, delay: index * 0.05 }}
    className="group"
  >
    <Link
      to={item.path}
      className={cn(
        "flex items-start justify-between gap-4 rounded-2xl border border-white/8 bg-white/3 px-4 py-4",
        "transition-all duration-300 hover:bg-white/6 hover:border-white/12 hover:-translate-y-0.5",
      )}
    >
      <div className="min-w-0">
        <p className="font-display text-sm md:text-base tracking-wide text-white/90 group-hover:text-white">
          {item.label}
        </p>
        {item.note && (
          <p className="mt-1 text-xs text-white/45 group-hover:text-white/60">
            {item.note}
          </p>
        )}
      </div>
      <ArrowRight className="w-4 h-4 flex-none text-white/30 group-hover:text-white/80 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  </motion.li>
);

const PlatformMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3">
    <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</p>
    <p className="mt-1 font-display text-xl md:text-2xl text-white">{value}</p>
  </div>
);

const SectionCard = ({ section, index }: { section: SectionBlock; index: number }) => {
  const Icon = section.icon;
  const meta = variantMeta[section.variant];

  return (
    <motion.article
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.65, delay: index * 0.08 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border backdrop-blur-xl",
        meta.ring,
        meta.card,
        meta.glow,
      )}
    >
      <div className="absolute inset-0 pointer-events-none opacity-80">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/4 blur-3xl" />
      </div>

      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-4">
            <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.34em] text-white/55">
              {section.eyebrow}
            </p>

            <div className="flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border", meta.badge)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-display tracking-tight text-white">
                  {section.title}
                </h2>
                <p className="mt-1 italic text-sm md:text-base text-white/60">
                  {section.subtitle}
                </p>
              </div>
            </div>
          </div>

          <Badge variant="outline" className={cn("rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]", meta.badge)}>
            {section.chip}
          </Badge>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <p className="max-w-2xl text-sm md:text-base leading-relaxed text-white/72">
              {section.body}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {section.metrics.map((metric) => (
                <PlatformMetric key={metric.label} {...metric} />
              ))}
            </div>

            {section.featured && (
              <Link
                to={section.featured.path}
                className={cn(
                  "group inline-flex items-center gap-3 rounded-full border px-5 py-3",
                  "bg-white/6 border-white/12 text-white transition-all duration-300",
                  "hover:bg-white/10 hover:border-white/20 hover:translate-x-0.5",
                )}
              >
                <span className="font-display text-sm tracking-wide">{section.featured.label}</span>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
                  {section.featured.note}
                </span>
                <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            )}
          </div>

          <div className="rounded-[24px] border border-white/8 bg-black/10 p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/40">Accesos</p>
              <span className="text-[10px] uppercase tracking-[0.26em] text-white/35">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <ul className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <FeatureCard key={item.path} item={item} index={itemIndex} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const Plataforma = () => (
  <main className="relative overflow-hidden">
    <PageHero
      eyebrow="RDM DIGITAL · TAMV ONLINE"
      title="Sistema Operativo Territorial"
      subtitle="Tres mundos articulados sobre una misma infraestructura soberana, nacida en Real del Monte."
      variant="immersive"
      layout="cinematic"
      backgroundEffect="constellation"
      image="/assets/hero-platform.jpg"
      overlay="gradient"
      parallaxIntensity={0.55}
    >
      <Button asChild size="lg" className="rounded-full">
        <Link to="/mapa">Ver mapa maestro</Link>
      </Button>
      <Button asChild variant="outline" size="lg" className="rounded-full border-white/15 bg-white/5 hover:bg-white/10">
        <Link to="/nodo-cero">Entrar a Nodo Cero</Link>
      </Button>
    </PageHero>

    <section className="section-spacing pt-0">
      <div className="narrative-column max-w-7xl">
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Lectura</p>
            <p className="mt-2 text-sm text-white/70">La plataforma está organizada como un mapa de navegación, no como una lista.</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Estado</p>
            <p className="mt-2 text-sm text-white/70">Cada bloque comunica una capa distinta con acceso inmediato y jerarquía visual real.</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Escala</p>
            <p className="mt-2 text-sm text-white/70">El sistema crece sin perder coherencia gracias a variantes territoriales consistentes.</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionCard section={sections[0]} index={0} />
          </div>
          <div className="lg:col-span-5">
            <SectionCard section={sections[1]} index={1} />
          </div>
          <div className="lg:col-span-12">
            <SectionCard section={sections[2]} index={2} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Link
            to="/plataforma"
            className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md hover:bg-white/6 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Centro</p>
            <p className="mt-2 font-display text-lg text-white">Plataforma</p>
          </Link>
          <Link
            to="/federaciones"
            className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md hover:bg-white/6 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Red</p>
            <p className="mt-2 font-display text-lg text-white">Federaciones</p>
          </Link>
          <Link
            to="/isabella"
            className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md hover:bg-white/6 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">IA</p>
            <p className="mt-2 font-display text-lg text-white">Isabella</p>
          </Link>
          <Link
            to="/guardian"
            className="rounded-3xl border border-white/8 bg-white/4 p-5 backdrop-blur-md hover:bg-white/6 transition-colors"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Control</p>
            <p className="mt-2 font-display text-lg text-white">Guardian</p>
          </Link>
        </div>
      </div>
    </section>
  </main>
);

export default Plataforma;
