import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchOverlay from "@/components/SearchOverlay";

type NavItem = { label: string; path: string };
type NavGroup = { title: string; subtitle: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    title: "TERRITORIO",
    subtitle: "El pueblo que se camina",
    items: [
      { label: "Inicio", path: "/" },
      { label: "Pastes", path: "/pastes" },
      { label: "Minas", path: "/minas" },
      { label: "Cementerio", path: "/cementerio" },
      { label: "Calles", path: "/calles" },
      { label: "Rutas", path: "/rutas" },
      { label: "Leyendas", path: "/leyendas" },
      { label: "Eventos", path: "/eventos" },
    ],
  },
  {
    title: "ECOSISTEMA",
    subtitle: "TAMV Online · Federaciones · IA · Kernel",
    items: [
      { label: "Plataforma", path: "/plataforma" },
      { label: "Federaciones", path: "/federaciones" },
      { label: "Isabella IA", path: "/isabella" },
      { label: "Ecosistema GitHub", path: "/ecosistema" },
      { label: "PDOS Core", path: "/pdos-core" },
      { label: "DM-X7 Gateway", path: "/dm-x7" },
      { label: "Directorio", path: "/directorio" },
      { label: "Mapa", path: "/mapa" },
    ],
  },
  {
    title: "GOBERNANZA",
    subtitle: "Soberanía digital del territorio",
    items: [
      { label: "Nodo Cero", path: "/nodo-cero" },
      { label: "Atlas Federado", path: "/atlas" },
      { label: "Guardian Console", path: "/guardian" },
      { label: "Auditoría · BookPI", path: "/auditoria" },
      { label: "Propuesta Municipal", path: "/propuesta" },
      { label: "Manifiesto · Awakening", path: "/manifiesto" },
      { label: "Blueprint MD-X4", path: "/blueprint" },
      { label: "Nexus ELITE HeHep", path: "/nexus" },
      { label: "Tutorial", path: "/tutorial" },
      { label: "Logros / XP", path: "/logros" },
      { label: "Acceso", path: "/auth" },
    ],
  },
];

const CompassNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <button
        onClick={() => setSearchOpen(true)}
        className="fixed bottom-8 right-24 z-50 w-12 h-12 flex items-center justify-center font-display text-xl text-foreground hover:text-primary transition-colors"
        aria-label="Buscar"
      >
        ⌕
      </button>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center font-display text-xl transition-colors"
        style={{ color: isOpen ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }}
        aria-label="Abrir navegación"
      >
        {isOpen ? "×" : "+"}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-carbon-overlay overflow-y-auto"
          >
            <div className="min-h-screen px-6 py-20 md:py-28 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                {groups.map((group, gi) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + gi * 0.1, duration: 0.4 }}
                  >
                    <p className="font-display text-xs tracking-[0.3em] text-primary mb-2">
                      {String(gi + 1).padStart(2, "0")} · {group.title}
                    </p>
                    <p className="font-body italic text-primary-foreground/50 text-sm mb-6">
                      {group.subtitle}
                    </p>
                    <ul className="space-y-3">
                      {group.items.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                          <li key={item.path}>
                            <Link
                              to={item.path}
                              onClick={() => setIsOpen(false)}
                              className={`font-display text-xl md:text-2xl tracking-tight transition-colors ${
                                active
                                  ? "text-primary"
                                  : "text-primary-foreground hover:text-primary"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-primary-foreground/10 text-center">
                <p className="font-display text-[10px] tracking-[0.3em] text-primary-foreground/40">
                  RDM DIGITAL · TAMV ONLINE · NODO CERO
                </p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompassNav;
