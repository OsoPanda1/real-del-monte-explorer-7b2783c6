import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface SearchResult {
  title: string;
  description: string;
  category: string;
  link: string;
}

const SEARCH_DATA: SearchResult[] = [
  { title: "Pastes Tradicionales", description: "La receta que cruzó el Atlántico desde Cornwall", category: "GASTRONOMÍA", link: "/pastes" },
  { title: "Mina de Acosta", description: "400 metros bajo tierra, 500 años de historia", category: "HISTORIA", link: "/minas" },
  { title: "Panteón Inglés", description: "755 tumbas de mineros que nunca volvieron a casa", category: "PATRIMONIO", link: "/cementerio" },
  { title: "Calles Empedradas", description: "Piedra, niebla y memoria en cada esquina", category: "RECORRIDOS", link: "/calles" },
  { title: "Platerías del Centro", description: "Joyería artesanal con plata de las minas locales", category: "COMERCIO", link: "/directorio" },
  { title: "Artesanías y Textiles", description: "Puestos de cerámica, textiles y figuras talladas", category: "COMERCIO", link: "/directorio" },
  { title: "Pastelerías Tradicionales", description: "Pan artesanal y pastes recién horneados", category: "GASTRONOMÍA", link: "/directorio" },
  { title: "Barbacoa Dominical", description: "Tradición gastronómica de cada fin de semana", category: "GASTRONOMÍA", link: "/directorio" },
  { title: "Hotel Real del Monte", description: "Hospedaje con vista al valle", category: "HOSPEDAJE", link: "/directorio" },
  { title: "Pulquería La Providencia", description: "Pulque curado artesanal", category: "GASTRONOMÍA", link: "/directorio" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const results = query.length >= 2
    ? SEARCH_DATA.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-carbon-overlay flex flex-col items-center pt-[15vh]"
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 font-display text-2xl text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            ×
          </button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-full max-w-[600px] px-6"
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en el pueblo..."
              className="w-full bg-transparent border-b-2 border-primary-foreground/30 focus:border-primary pb-4 text-3xl md:text-4xl font-display tracking-tight text-primary-foreground placeholder:text-primary-foreground/30 outline-none transition-colors duration-300"
            />

            {/* Results */}
            <div className="mt-8 space-y-6 max-h-[50vh] overflow-y-auto">
              {results.map((result, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={result.link}
                    onClick={onClose}
                    className="block group"
                  >
                    <span className="font-display text-[10px] tracking-widest text-primary/80">
                      {result.category}
                    </span>
                    <h3 className="font-display text-xl text-primary-foreground group-hover:text-primary transition-colors duration-300 mt-1">
                      {result.title}
                    </h3>
                    <p className="font-body text-sm text-primary-foreground/50 italic mt-1">
                      {result.description}
                    </p>
                  </Link>
                </motion.div>
              ))}

              {query.length >= 2 && results.length === 0 && (
                <p className="font-body text-sm text-primary-foreground/40 italic">
                  No se encontraron resultados para "{query}"
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
