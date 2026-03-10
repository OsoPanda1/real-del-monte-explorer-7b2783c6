import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "PASTES", path: "/pastes" },
  { label: "MINAS", path: "/minas" },
  { label: "CEMENTERIO", path: "/cementerio" },
  { label: "CALLES", path: "/calles" },
];

const CompassNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compass trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center font-display text-xl transition-colors duration-300"
        style={{
          color: isOpen ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
        }}
        aria-label="Abrir navegación"
      >
        <span className="select-none">{isOpen ? "×" : "+"}</span>
      </button>

      {/* Fullscreen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-carbon-overlay flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-12">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="font-display text-sm tracking-widest text-primary-foreground/60 hover:text-primary transition-colors duration-300"
              >
                INICIO
              </Link>
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="font-display text-4xl md:text-6xl tracking-tight text-primary-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default CompassNav;
