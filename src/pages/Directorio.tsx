import { motion } from "framer-motion";
import { useState } from "react";

interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  priceRange: string;
  rating: number;
}

const CATEGORIES = ["TODOS", "GASTRONOMÍA", "ARTESANÍA", "PLATERÍA", "HOSPEDAJE", "SERVICIOS"];

const BUSINESSES: Business[] = [
  { id: "1", name: "Pastes El Portal", description: "Los pastes más tradicionales del pueblo. Receta heredada de los mineros de Cornwall, con rellenos que van desde la papa con carne hasta mole y tinga.", category: "GASTRONOMÍA", address: "Plaza Principal #12", priceRange: "$", rating: 5 },
  { id: "2", name: "Pastes Kikos", description: "Famosos por su variedad de sabores dulces y salados. Un clásico de Real del Monte desde hace más de 30 años.", category: "GASTRONOMÍA", address: "Calle Hidalgo #45", priceRange: "$", rating: 4 },
  { id: "3", name: "Platería La Veta", description: "Joyería artesanal elaborada con plata extraída de las minas locales. Cada pieza cuenta la historia del pueblo.", category: "PLATERÍA", address: "Calle del Comercio #8", priceRange: "$$", rating: 5 },
  { id: "4", name: "Taller de Plata Don Cornelio", description: "Artesanos que trabajan la plata a la vista del visitante. Piezas únicas con diseños inspirados en la herencia minera.", category: "PLATERÍA", address: "Calle Juárez #23", priceRange: "$$$", rating: 4 },
  { id: "5", name: "Artesanías La Cornisa", description: "Textiles, cerámica y figuras talladas en madera. Productos hechos a mano por artesanos de la región.", category: "ARTESANÍA", address: "Plaza de las Artesanías s/n", priceRange: "$", rating: 4 },
  { id: "6", name: "Hotel Real del Monte", description: "Hospedaje con arquitectura del siglo XIX y vista panorámica al valle. Restaurante con cocina regional.", category: "HOSPEDAJE", address: "Carretera Pachuca-Huejutla km 8", priceRange: "$$$", rating: 5 },
  { id: "7", name: "Posada del Minero", description: "Habitaciones acogedoras en una casona restaurada. Chimenea, jardín interior y desayuno incluido.", category: "HOSPEDAJE", address: "Calle Morelos #15", priceRange: "$$", rating: 4 },
  { id: "8", name: "Pulquería La Providencia", description: "Pulque curado artesanal de sabores. Un rincón auténtico donde se mezclan los aromas del maguey con la historia local.", category: "GASTRONOMÍA", address: "Callejón del Maguey #3", priceRange: "$", rating: 5 },
  { id: "9", name: "Sanitarios Públicos Centro", description: "Instalaciones limpias y accesibles para visitantes. Ubicados estratégicamente en el centro del pueblo.", category: "SERVICIOS", address: "Plaza Principal", priceRange: "$", rating: 3 },
  { id: "10", name: "Barbacoa Doña Lupita", description: "Cada domingo, la barbacoa más buscada de la sierra. Consomé, tortillas hechas a mano y salsa borracha.", category: "GASTRONOMÍA", address: "Mercado Municipal", priceRange: "$", rating: 5 },
];

const StarRating = ({ rating }: { rating: number }) => (
  <span className="font-body text-sm text-muted-foreground">
    {"★".repeat(rating)}{"☆".repeat(5 - rating)}
  </span>
);

const Directorio = () => {
  const [activeCategory, setActiveCategory] = useState("TODOS");

  const filtered = activeCategory === "TODOS"
    ? BUSINESSES
    : BUSINESSES.filter((b) => b.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <section className="section-spacing">
        <div className="narrative-column">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl tracking-tight mb-6"
          >
            DIRECTORIO
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            Los negocios, talleres y rincones que hacen de Real del Monte un pueblo vivo. Cada lugar tiene su propia historia.
          </motion.p>

          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-display text-xs tracking-widest px-4 py-2 border transition-colors duration-300 ${
                  activeCategory === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Business list — narrative style, not card grid */}
          <div className="space-y-16">
            {filtered.map((biz, i) => (
              <motion.article
                key={biz.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="border-b border-border pb-12 last:border-b-0"
              >
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-display text-[10px] tracking-widest text-muted-foreground">
                    {biz.category}
                  </span>
                  <span className="font-body text-sm text-muted-foreground">
                    {biz.priceRange}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl tracking-tight mb-3">{biz.name}</h2>
                <p className="font-body text-base leading-relaxed text-muted-foreground mb-4">
                  {biz.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm italic text-muted-foreground">
                    {biz.address}
                  </span>
                  <StarRating rating={biz.rating} />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Directorio;
