import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import heroCalles from "@/assets/hero-calles.jpg";
import panoramica from "@/assets/panoramica-rdm.jpg";
import pastesImg from "@/assets/pastes-closeup.jpg";
import panteonImg from "@/assets/panteon-ingles.jpg";
import minaImg from "@/assets/mina-interior.jpg";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroY = useTransform(scrollYProgress, [0, 0.3], ["0%", "20%"]);

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <img
            src={heroCalles}
            alt="Calles empedradas de Real del Monte entre la niebla"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/40" />
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full narrative-column text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl tracking-tight text-primary-foreground mb-6"
          >
            REAL DEL MONTE
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-lg italic"
          >
            Un pueblo que guarda sus secretos en la niebla, entre piedra, plata y memoria.
          </motion.p>
        </div>
      </section>

      {/* Intro narrative */}
      <section className="section-spacing">
        <div className="narrative-column">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-body text-xl md:text-2xl leading-relaxed"
          >
            A 2,660 metros sobre el nivel del mar, donde los bosques de oyamel se encuentran con las vetas de plata, existe un pueblo que parece suspendido en el tiempo. Real del Monte no se visita — se habita, aunque sea por un día.
          </motion.p>
        </div>
      </section>

      {/* Full-bleed panoramic */}
      <div className="full-bleed">
        <img
          src={panoramica}
          alt="Vista panorámica de Real del Monte desde las montañas"
          className="w-full h-[50vh] md:h-[70vh] object-cover"
        />
      </div>

      {/* Content sections */}
      <section className="section-spacing">
        <div className="narrative-column">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl mb-8"
          >
            LA HISTORIA ESTÁ EN LAS PIEDRAS
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-body text-lg leading-relaxed mb-16"
          >
            En 1824, una compañía inglesa trajo mineros de Cornualles a estas montañas. Con ellos vinieron sus herramientas, su fútbol, sus muertos — y sus pastes. Lo que dejaron no fue solo plata: fue una cultura híbrida que aún respira en cada esquina del pueblo.
          </motion.p>
        </div>
      </section>

      {/* Pastes teaser */}
      <ContentTeaser
        image={pastesImg}
        title="PASTES"
        description="El paste llegó de Cornwall en las manos de los mineros. En Real del Monte se transformó en algo propio: relleno de papa con chile, de tinga, de mole. Cada mordida es un acto de memoria."
        link="/pastes"
        imageAlt="Pastes tradicionales recién horneados"
      />

      {/* Minas teaser */}
      <ContentTeaser
        image={minaImg}
        title="MINAS"
        description="400 metros bajo tierra, donde la luz no llega, los túneles de la Mina de Acosta guardan siglos de historia. El aire húmedo todavía huele a roca y esfuerzo."
        link="/minas"
        imageAlt="Interior de un túnel en la Mina de Acosta"
        reverse
      />

      {/* Cementerio teaser */}
      <ContentTeaser
        image={panteonImg}
        title="CEMENTERIO"
        description="755 tumbas de mineros británicos descansan en un bosque de niebla. Las lápidas miran hacia Inglaterra — hacia un hogar al que nunca volvieron."
        link="/cementerio"
        imageAlt="Panteón Inglés entre la niebla y los árboles de oyamel"
      />

      {/* Footer */}
      <footer className="section-spacing border-t border-border">
        <div className="narrative-column text-center">
          <p className="font-display text-sm tracking-widest text-muted-foreground mb-4">
            TALLER DE LA MEMORIA
          </p>
          <p className="font-body text-sm text-muted-foreground italic">
            Real del Monte, Hidalgo, México
          </p>
        </div>
      </footer>
    </div>
  );
};

interface ContentTeaserProps {
  image: string;
  title: string;
  description: string;
  link: string;
  imageAlt: string;
  reverse?: boolean;
}

const ContentTeaser = ({ image, title, description, link, imageAlt, reverse }: ContentTeaserProps) => (
  <>
    {!reverse && (
      <div className="full-bleed">
        <img src={image} alt={imageAlt} className="w-full h-[50vh] md:h-[60vh] object-cover" />
      </div>
    )}
    <section className="section-spacing">
      <div className="narrative-column">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl mb-6"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-body text-lg leading-relaxed mb-8"
        >
          {description}
        </motion.p>
        <Link
          to={link}
          className="font-body italic text-primary hover:text-primary/80 transition-colors duration-300"
        >
          Continuar leyendo
        </Link>
      </div>
    </section>
    {reverse && (
      <div className="full-bleed">
        <img src={image} alt={imageAlt} className="w-full h-[50vh] md:h-[60vh] object-cover" />
      </div>
    )}
  </>
);

export default Index;
