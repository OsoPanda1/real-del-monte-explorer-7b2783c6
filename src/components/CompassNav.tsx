import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/components/NavLink";
import SearchOverlay from "@/components/SearchOverlay";
import {
  Compass,
  Home,
  UtensilsCrossed,
  Mountain,
  Cross,
  MapPin,
  Route,
  Sparkles,
  Calendar,
  Network,
  GitBranch,
  Bot,
  Github,
  Terminal,
  Radio,
  Map,
  Shield,
  Globe,
  Eye,
  BookOpen,
  FileText,
  Lightbulb,
  Blueprint as BlueprintIcon,
  Hexagon,
  GraduationCap,
  Trophy,
  LogIn,
  Search,
  X,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: string | number;
};

type NavGroup = {
  title: string;
  subtitle: string;
  variant: "territory" | "ecosystem" | "governance";
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    title: "TERRITORIO",
    subtitle: "El pueblo que se camina",
    variant: "territory",
    items: [
      { label: "Inicio", path: "/", icon: <Home className="w-4 h-4" /> },
      {
        label: "Pastes",
        path: "/pastes",
        icon: <UtensilsCrossed className="w-4 h-4" />,
      },
      { label: "Minas", path: "/minas", icon: <Mountain className="w-4 h-4" /> },
      {
        label: "Cementerio",
        path: "/cementerio",
        icon: <Cross className="w-4 h-4" />,
      },
      { label: "Calles", path: "/calles", icon: <MapPin className="w-4 h-4" /> },
      { label: "Rutas", path: "/rutas", icon: <Route className="w-4 h-4" /> },
      {
        label: "Leyendas",
        path: "/leyendas",
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        label: "Eventos",
        path: "/eventos",
        icon: <Calendar className="w-4 h-4" />,
      },
    ],
  },
  {
    title: "ECOSISTEMA",
    subtitle: "TAMV Online · Federaciones · IA · Kernel",
    variant: "ecosystem",
    items: [
      {
        label: "Plataforma",
        path: "/plataforma",
        icon: <Network className="w-4 h-4" />,
      },
      {
        label: "Federaciones",
        path: "/federaciones",
        icon: <GitBranch className="w-4 h-4" />,
      },
      {
        label: "Isabella IA",
        path: "/isabella",
        icon: <Bot className="w-4 h-4" />,
        badge: "AI",
      },
      {
        label: "Ecosistema GitHub",
        path: "/ecosistema",
        icon: <Github className="w-4 h-4" />,
      },
      {
        label: "PDOS Core",
        path: "/pdos-core",
        icon: <Terminal className="w-4 h-4" />,
      },
      {
        label: "DM-X7 Gateway",
        path: "/dm-x7",
        icon: <Radio className="w-4 h-4" />,
      },
      {
        label: "Directorio",
        path: "/directorio",
        icon: <Map className="w-4 h-4" />,
      },
      { label: "Mapa", path: "/mapa", icon: <Compass className="w-4 h-4" /> },
    ],
  },
  {
    title: "GOBERNANZA",
    subtitle: "Soberanía digital del territorio",
    variant: "governance",
    items: [
      {
        label: "Nodo Cero",
        path: "/nodo-cero",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        label: "Atlas Federado",
        path: "/atlas",
        icon: <Globe className="w-4 h-4" />,
      },
      {
        label: "Guardian Console",
        path: "/guardian",
        icon: <Eye className="w-4 h-4" />,
      },
      {
        label: "Auditoría · BookPI",
        path: "/auditoria",
        icon: <BookOpen className="w-4 h-4" />,
      },
      {
        label: "Propuesta Municipal",
        path: "/propuesta",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        label: "Manifiesto · Awakening",
        path: "/manifiesto",
        icon: <Lightbulb className="w-4 h-4" />,
      },
      {
        label: "Blueprint MD-X4",
        path: "/blueprint",
        icon: <BlueprintIcon className="w-4 h-4" />,
      },
      {
        label: "Nexus ELITE HeHep",
        path: "/nexus",
        icon: <Hexagon className="w-4 h-4" />,
      },
      {
        label: "Tutorial",
        path: "/tutorial",
        icon: <GraduationCap className="w-4 h-4" />,
      },
      {
        label: "Logros / XP",
        path: "/logros",
        icon: <Trophy className="w-4 h-4" />,
      },
      {
        label: "Acceso",
        path: "/auth",
        icon: <LogIn className="w-4 h-4" />,
      },
    ],
  },
];

const CompassNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Search Button */}
      <button
        onClick={() => setSearchOpen(true)}
        className={cn(
          "fixed bottom-8 right-24 z-50",
          "w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "bg-white/5 backdrop-blur-sm border border-white/10",
          "text-rdm-fog hover:text-rdm-oxygen hover:border-rdm-oxygen/30",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rdm-oxygen focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        )}
        aria-label="Buscar en RDM Digital"
      >
        <Search className="w-5 h-5" />
      </button>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Compass Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-8 right-8 z-50",
          "w-12 h-12 rounded-full",
          "flex items-center justify-center",
          "font-display text-2xl",
          "transition-all duration-300",
          isOpen
            ? "bg-rdm-gold text-rdm-night border-2 border-rdm-gold rotate-90 scale-110"
            : "bg-white/5 backdrop-blur-sm border border-white/10 text-rdm-fog hover:text-rdm-gold hover:border-rdm-gold/30",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rdm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        )}
        aria-label={isOpen ? "Cerrar navegación" : "Abrir navegación"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-rdm-night/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navegación principal"
          >
            <nav className="min-h-screen overflow-y-auto px-6 py-20 md:py-28">
              <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                  {groups.map((group, gi) => (
                    <motion.section
                      key={group.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + gi * 0.08, duration: 0.4 }}
                      aria-labelledby={`nav-section-${gi}`}
                    >
                      {/* Section Header */}
                      <div className="mb-6">
                        <p
                          id={`nav-section-${gi}`}
                          className={cn(
                            "font-display text-xs tracking-[0.3em] uppercase mb-2",
                            group.variant === "territory" && "text-rdm-gold",
                            group.variant === "ecosystem" && "text-rdm-oxygen",
                            group.variant === "governance" && "text-rdm-candle",
                          )}
                        >
                          {String(gi + 1).padStart(2, "0")} · {group.title}
                        </p>
                        <p className="font-body italic text-rdm-fog/60 text-sm leading-relaxed">
                          {group.subtitle}
                        </p>
                      </div>

                      {/* Navigation Items */}
                      <ul className="space-y-2" role="list">
                        {group.items.map((item) => (
                          <li key={item.path}>
                            <NavLink
                              to={item.path}
                              variant={group.variant}
                              size="lg"
                              mode="text"
                              weight="semibold"
                              icon={item.icon}
                              iconPosition="left"
                              badge={item.badge}
                              onClick={handleClose}
                              className="w-full justify-start text-left hover:translate-x-1"
                              end={item.path === "/"}
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </motion.section>
                  ))}
                </div>

                {/* Footer */}
                <motion.footer
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-16 pt-8 border-t border-white/10 text-center"
                >
                  <p className="font-display text-[10px] tracking-[0.3em] text-rdm-fog/40 uppercase">
                    RDM Digital · TAMV Online · Nodo Cero
                  </p>
                  <p className="font-body text-xs text-rdm-fog/30 mt-2">
                    Real de Monte, Hidalgo · Territorio Inteligente
                  </p>
                </motion.footer>
              </div>
            </nav>

            {/* Atmospheric Effects */}
            <div className="fog-layer pointer-events-none" aria-hidden="true" />
            <div
              className="digital-grid fixed inset-0 pointer-events-none opacity-20"
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompassNav;
