import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, Hexagon, Network, Coins, Crown, Shield,
  Mountain, Compass, Cpu, Radio, BookOpen, Trophy, MapPin, Gem,
  Activity, Layers, Wand2, Users,
} from "lucide-react";
import heroCalles from "@/assets/hero-calles.jpg";
import panoramica from "@/assets/panoramica-rdm.jpg";
import pastesImg from "@/assets/pastes-closeup.jpg";
import panteonImg from "@/assets/panteon-ingles.jpg";
import minaImg from "@/assets/mina-interior.jpg";
import rdmLogo from "@/assets/rdm-logo.png";
import {
  HE_HEXAGONS, HEP_DOMAINS, ISABELLA_MODULES, ATLAS_BACKEND_ENDPOINTS, ELITE_HEHEP_MANIFEST,
} from "@/data/eliteHeHep";
import { useLiveSignals } from "@/hooks/useLiveSignals";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] as const },
};

const worlds = [
  { to: "/mapa",        icon: Mountain,  title: "Territorio",   desc: "Mapa vivo, calles, rutas, minas y cementerio inglés.",                tag: "6 capas", grad: "from-rdm-pine/30 to-rdm-stone/10" },
  { to: "/manifiesto",  icon: BookOpen,  title: "Patrimonio",   desc: "Manifiesto de despertar, leyendas y blueprint MD-X4.",                tag: "260+ docs", grad: "from-rdm-copper/30 to-rdm-gold/10" },
  { to: "/directorio",  icon: Users,     title: "Comunidad",    desc: "Directorio, eventos, pastes y nuevos comercios certificados.",        tag: "Live", grad: "from-rdm-community/25 to-rdm-paste/10" },
  { to: "/isabella",    icon: Cpu,       title: "Inteligencia", desc: "Isabella AI · 14 módulos · Atlas · Nexus · DM-X7 · PDOS Core.",       tag: "14 mod", grad: "from-rdm-data/30 to-rdm-oxygen/10" },
  { to: "/nodo-cero",   icon: Shield,    title: "Gobernanza",   desc: "Nodo Cero, Guardian, Auditoría y federaciones SDMD-7.",               tag: "7 dominios", grad: "from-rdm-grid/25 to-rdm-slate/10" },
  { to: "/juegos",      icon: Trophy,    title: "Juego",        desc: "3 mini-juegos territoriales, RDM Coins y recompensas reales.",        tag: "$129/mes", grad: "from-rdm-candle/30 to-rdm-amber/10" },
];

const Index = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const live = useLiveSignals();
  const signals = [
    { label: "Altitud",          value: live.altitude,                 icon: Mountain },
    { label: "Habitantes",       value: String(live.habitantes),       icon: Users },
    { label: "Decisiones · 24h", value: String(live.decisiones24h),    icon: Activity },
    { label: "Partidas · 24h",   value: String(live.partidas24h),      icon: Trophy },
    { label: "Comercios",        value: String(live.comercios),        icon: MapPin },
    { label: "Módulos",          value: live.modules,                  icon: Cpu },
  ];

  return (
    <div ref={ref} className="relative">
      {/* HERO — territorio + datos */}
      <section className="relative min-h-[92vh] overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img src={heroCalles} alt="Calles empedradas de Real del Monte entre la niebla" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-rdm-night/40 via-rdm-night/55 to-rdm-night" />
          <div className="absolute inset-0 territory-grid opacity-40 mix-blend-screen" />
        </motion.div>

        <div className="fog-layer absolute inset-x-0 top-1/2" />

        <div className="relative z-10 content-width section-pad pt-24 md:pt-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rdm-gold/30 bg-rdm-gold/5 text-rdm-gold text-xs font-mono uppercase tracking-[0.3em] mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-rdm-candle animate-pulse" />
            Sovereign Urban OS · ELITE HeHep · v{ELITE_HEHEP_MANIFEST.doctrine}
          </motion.div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <div>
              <motion.img src={rdmLogo} alt="RDM Digital" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2 }} className="w-20 h-20 md:w-24 md:h-24 mb-6 object-contain drop-shadow-2xl" />
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15 }}
                className="font-heritage text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-tight">
                <span className="block heritage-gold">Real del Monte</span>
                <span className="block text-rdm-fog/80 font-territory text-[clamp(0.9rem,1.4vw,1.2rem)] uppercase tracking-[0.5em] mt-4">
                  Territorio Inteligente Vivo
                </span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
                className="font-heritage italic text-xl md:text-2xl text-rdm-fog/85 max-w-2xl mt-8 leading-relaxed">
                Donde la niebla guarda secretos, la piedra recuerda y los datos respiran.
                Un pueblo mágico que opera como sistema operativo soberano.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap gap-3 mt-10">
                <Link to="/mapa" className="btn-discover"><Compass className="h-4 w-4" /> Explorar el territorio</Link>
                <Link to="/membresia" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-rdm-gold/30 text-rdm-gold hover:bg-rdm-gold/10 transition-colors font-semibold">
                  <Crown className="h-4 w-4" /> Habitante Digital · $129 MXN
                </Link>
                <Link to="/nexus" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-rdm-fog hover:border-rdm-data/40 hover:text-rdm-data transition-colors font-semibold">
                  <Hexagon className="h-4 w-4" /> Ver arquitectura
                </Link>
              </motion.div>
            </div>

            {/* signals panel */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.7 }}
              className="territory-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-[0.3em] text-rdm-fog/60 font-mono">Señales del territorio</span>
                <span className="h-2 w-2 rounded-full bg-rdm-candle animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {signals.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-3">
                    <div className="flex items-center gap-2 text-rdm-fog/60 text-[10px] uppercase tracking-wider font-mono">
                      <s.icon className="h-3 w-3" /> {s.label}
                    </div>
                    <div className="text-2xl font-heritage text-rdm-platinum mt-1">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] text-rdm-fog/55 font-mono">
                <span>BookPI · sha256</span>
                <span>ORCID 0009-0008-5050-1539</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MANIFIESTO INTRO */}
      <section className="section-pad relative">
        <div className="content-width">
          <motion.div {...fadeUp} className="grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-rdm-gold/80 font-mono">01 · Manifiesto</span>
              <h2 className="font-heritage text-4xl md:text-5xl mt-3 heritage-gold">No es una web. Es un territorio.</h2>
            </div>
            <div className="space-y-5 text-lg text-rdm-fog/85 leading-relaxed font-heritage">
              <p>
                A 2,660 metros sobre el mar, donde los bosques de oyamel se encuentran con vetas de plata,
                Real del Monte se transforma en algo que ningún Pueblo Mágico ha intentado: un
                <em className="text-rdm-gold"> sistema operativo civilizatorio</em> con identidad soberana,
                economía propia, gamificación real y arquitectura federada.
              </p>
              <p className="text-base text-rdm-fog/65 font-territory">
                Fusión de 9 repositorios · 22,000+ horas de investigación · 260+ documentos canónicos ·
                arquitecto raíz: Edwin Oswaldo Castillo Trejo.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {["MD-X4", "BookPI™", "Dekateotl", "Anubis Sentinel", "Phoenix Protocol", "Isabella Core", "SDMD-7"].map((t) => (
                  <span key={t} className="signal-chip text-xs">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6 MUNDOS */}
      <section className="section-pad relative">
        <div className="content-width">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.4em] text-rdm-gold/80 font-mono">02 · Los seis mundos</span>
              <h2 className="font-heritage text-4xl md:text-5xl mt-3">Una sola experiencia.</h2>
            </div>
            <Link to="/tutorial" className="text-rdm-fog/70 hover:text-rdm-gold transition-colors inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest">
              Cómo recorrer <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {worlds.map((w, i) => (
              <motion.div key={w.to} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
                <Link to={w.to} className={`block discovery-card p-6 h-full bg-gradient-to-br ${w.grad}`}>
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="h-11 w-11 rounded-2xl bg-rdm-night/60 border border-white/10 grid place-items-center text-rdm-gold">
                      <w.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-rdm-fog/60">{w.tag}</span>
                  </div>
                  <h3 className="font-heritage text-2xl text-rdm-platinum mb-2 relative z-10">{w.title}</h3>
                  <p className="text-sm text-rdm-fog/75 leading-relaxed relative z-10">{w.desc}</p>
                  <div className="flex items-center gap-1 text-rdm-gold text-sm mt-5 relative z-10 font-mono uppercase tracking-widest">
                    Entrar <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PANORÁMICA + PATRIMONIO */}
      <div className="relative overflow-hidden">
        <motion.img {...fadeUp} src={panoramica} alt="Panorámica de Real del Monte" className="w-full h-[55vh] md:h-[75vh] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-rdm-night via-transparent to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 content-width">
          <h3 className="font-heritage text-3xl md:text-5xl heritage-gold max-w-2xl">La historia está en las piedras.</h3>
        </div>
      </div>

      {/* PATRIMONIO TRIPTYCH */}
      <section className="section-pad">
        <div className="content-width grid md:grid-cols-3 gap-6">
          {[
            { img: pastesImg, title: "Pastes", desc: "Cornish meets Hidalgo. Cada mordida, memoria.", to: "/pastes" },
            { img: minaImg,   title: "Minas",  desc: "400 m bajo tierra. Mina de Acosta.",            to: "/minas" },
            { img: panteonImg,title: "Panteón Inglés", desc: "755 tumbas mirando hacia Cornualles.",  to: "/cementerio" },
          ].map((it, i) => (
            <motion.div key={it.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}>
              <Link to={it.to} className="discovery-card block group h-full">
                <div className="relative h-72 overflow-hidden">
                  <img src={it.img} alt={it.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-5 relative z-10">
                  <h4 className="font-heritage text-2xl mb-1">{it.title}</h4>
                  <p className="text-sm text-rdm-fog/70">{it.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ELITE HeHep ARCHITECTURE LIVE */}
      <section className="section-pad relative">
        <div className="content-width">
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.4em] text-rdm-data font-mono">03 · Núcleo soberano</span>
            <h2 className="font-heritage text-4xl md:text-5xl mt-3">
              Arquitectura <span className="heritage-gold">ELITE HeHep</span>
            </h2>
            <p className="text-rdm-fog/75 mt-4 text-lg">
              6 hexágonos operativos + 7 dominios federados + 14 módulos Isabella + BookPI™ inmutable.
            </p>
          </motion.div>

          {/* Hexagons */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {HE_HEXAGONS.map((h, i) => (
              <motion.div key={h.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.04 }}>
                <Link to={`/nexus#${h.id}`} className="territory-panel p-5 group hover:border-rdm-data/40 transition-colors block h-full">
                  <div className="flex items-center justify-between mb-3">
                    <Hexagon className="h-5 w-5 text-rdm-data" />
                    <code className="text-[10px] text-rdm-fog/50 font-mono">{h.id}</code>
                  </div>
                  <div className="font-heritage text-xl text-rdm-platinum group-hover:text-rdm-data transition-colors">{h.name}</div>
                  <p className="text-xs text-rdm-fog/65 mt-2 leading-relaxed">{h.role}</p>
                  <div className="mt-3 text-[10px] font-mono uppercase tracking-widest text-rdm-gold/70">
                    evt: {h.eventPrefix}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Domains pills */}
          <motion.div {...fadeUp} className="flex flex-wrap gap-2 justify-center mb-10">
            {HEP_DOMAINS.map((d) => (
              <Link key={d.id} to={`/federaciones#${d.id}`} className="signal-chip border-rdm-grid/20 hover:border-rdm-grid/50 transition-colors">
                <Network className="h-3 w-3 text-rdm-grid" />
                <span className="font-mono text-[10px] text-rdm-fog/60">{d.id}</span>
                <span className="text-rdm-platinum">{d.name}</span>
              </Link>
            ))}
          </motion.div>

          {/* Isabella ticker */}
          <motion.div {...fadeUp} className="heritage-panel p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Wand2 className="h-5 w-5 text-rdm-gold" />
                <h3 className="font-heritage text-2xl">Isabella · módulos vivos</h3>
              </div>
              <Link to="/isabella" className="text-xs font-mono uppercase tracking-widest text-rdm-gold hover:underline">
                ver todos →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {ISABELLA_MODULES.slice(0, 12).map((m) => (
                <Link key={m.module} to={`/isabella#${encodeURIComponent(m.module)}`}
                  className="rounded-xl border border-rdm-gold/15 bg-rdm-night/40 p-3 hover:border-rdm-gold/40 hover:bg-rdm-night/60 transition-colors block">
                  <div className="text-sm font-semibold text-rdm-platinum">{m.module}</div>
                  <div className="text-[10px] font-mono text-rdm-fog/50 mt-1">{m.hexagon} · {m.domain}</div>
                  <div className="text-[11px] text-rdm-fog/70 mt-2 line-clamp-2">{m.input} → {m.output}</div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Atlas API */}
          <motion.div {...fadeUp} className="mt-8 territory-panel p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-rdm-data" />
                <h3 className="font-heritage text-2xl">Atlas Backend · endpoints federados</h3>
              </div>
              <Link to="/atlas" className="text-xs font-mono uppercase tracking-widest text-rdm-data hover:underline">
                inspector atlas →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-2 font-mono text-xs">
              {ATLAS_BACKEND_ENDPOINTS.slice(0, 10).map((e) => (
                <div key={e.path} className="flex items-center gap-3 py-2 border-b border-white/5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    e.method === "GET" ? "bg-rdm-pine/30 text-emerald-300" : "bg-rdm-copper/25 text-rdm-amber"
                  }`}>{e.method}</span>
                  <code className="text-rdm-fog/85">{e.path}</code>
                  <span className="text-rdm-fog/45 ml-auto hidden md:inline">{e.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GAMIFICATION + MEMBERSHIP CTA */}
      <section className="section-pad relative">
        <div className="content-width grid md:grid-cols-2 gap-6">
          <motion.div {...fadeUp} className="heritage-panel p-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-rdm-gold/20 blur-3xl" />
            <Trophy className="h-8 w-8 text-rdm-gold mb-4 relative" />
            <h3 className="font-heritage text-3xl mb-3 relative">Juega el territorio.</h3>
            <p className="text-rdm-fog/80 relative mb-6 leading-relaxed">
              Memoria de las Minas · Niebla de Real del Monte · Ruta del Paste.
              Gana RDM Coins reales canjeables por pastes, café, cenas y noches de hotel en el pueblo.
            </p>
            <div className="flex flex-wrap gap-3 relative">
              <Link to="/juegos" className="btn-discover"><Trophy className="h-4 w-4" /> Jugar ahora</Link>
              <Link to="/recompensas" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-rdm-gold/40 text-rdm-gold hover:bg-rdm-gold/10 transition-colors font-semibold text-sm">
                <Coins className="h-4 w-4" /> Catálogo de premios
              </Link>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="territory-panel p-8 relative overflow-hidden">
            <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-rdm-data/15 blur-3xl" />
            <Crown className="h-8 w-8 text-rdm-platinum mb-4 relative" />
            <h3 className="font-heritage text-3xl mb-3 relative">Habitante Digital</h3>
            <p className="text-rdm-fog/80 relative mb-6 leading-relaxed">
              $129 MXN al mes. Desbloquea juegos, canje de recompensas, eventos privados,
              y voz en la gobernanza del Nodo Cero.
            </p>
            <Link to="/membresia" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rdm-platinum/95 text-rdm-night font-semibold hover:bg-white transition-colors">
              Activar membresía <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM LINKS */}
      <section className="section-pad relative border-t border-white/5">
        <div className="content-width">
          <motion.div {...fadeUp} className="grid md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-3 text-rdm-gold">
                <Sparkles className="h-4 w-4" />
                <span className="font-mono uppercase text-[10px] tracking-[0.3em]">Inteligencia</span>
              </div>
              <ul className="space-y-2 text-rdm-fog/75">
                <li><Link to="/isabella" className="hover:text-rdm-gold">Isabella AI</Link></li>
                <li><Link to="/atlas" className="hover:text-rdm-gold">Atlas Backend</Link></li>
                <li><Link to="/dm-x7" className="hover:text-rdm-gold">DM-X7 Gateway</Link></li>
                <li><Link to="/pdos-core" className="hover:text-rdm-gold">PDOS Core</Link></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3 text-rdm-data">
                <Shield className="h-4 w-4" />
                <span className="font-mono uppercase text-[10px] tracking-[0.3em]">Gobernanza</span>
              </div>
              <ul className="space-y-2 text-rdm-fog/75">
                <li><Link to="/nodo-cero" className="hover:text-rdm-data">Nodo Cero</Link></li>
                <li><Link to="/guardian" className="hover:text-rdm-data">Guardian</Link></li>
                <li><Link to="/auditoria" className="hover:text-rdm-data">Auditoría</Link></li>
                <li><Link to="/federaciones" className="hover:text-rdm-data">Federaciones</Link></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3 text-rdm-copper">
                <Gem className="h-4 w-4" />
                <span className="font-mono uppercase text-[10px] tracking-[0.3em]">Patrimonio</span>
              </div>
              <ul className="space-y-2 text-rdm-fog/75">
                <li><Link to="/manifiesto" className="hover:text-rdm-copper">Manifiesto</Link></li>
                <li><Link to="/blueprint" className="hover:text-rdm-copper">Blueprint MD-X4</Link></li>
                <li><Link to="/leyendas" className="hover:text-rdm-copper">Leyendas</Link></li>
                <li><Link to="/nexus" className="hover:text-rdm-copper">Nexus ELITE</Link></li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3 text-rdm-community">
                <MapPin className="h-4 w-4" />
                <span className="font-mono uppercase text-[10px] tracking-[0.3em]">Comunidad</span>
              </div>
              <ul className="space-y-2 text-rdm-fog/75">
                <li><Link to="/directorio" className="hover:text-rdm-community">Directorio</Link></li>
                <li><Link to="/eventos" className="hover:text-rdm-community">Eventos</Link></li>
                <li><Link to="/comercios/nuevo" className="hover:text-rdm-community">Registrar comercio</Link></li>
                <li><Link to="/ecosistema" className="hover:text-rdm-community">Ecosistema GitHub</Link></li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="section-pad border-t border-white/5">
        <div className="content-width text-center">
          <img src={rdmLogo} alt="RDM" className="w-16 h-16 mx-auto mb-5 object-contain opacity-90" />
          <p className="font-heritage text-2xl heritage-gold mb-2">RDM Digital · TAMV Online</p>
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-rdm-fog/55">
            Real del Monte · Hidalgo · México · 2,660 m
          </p>
          <p className="text-[11px] font-mono text-rdm-fog/40 mt-4">
            ORCID 0009-0008-5050-1539 · Edwin O. Castillo Trejo · BookPI™ sha256 · {ELITE_HEHEP_MANIFEST.canonicalKernel}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
