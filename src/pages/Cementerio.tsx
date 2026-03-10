import { motion } from "framer-motion";
import panteonImg from "@/assets/panteon-ingles.jpg";

const Cementerio = () => {
  return (
    <div>
      <section className="relative h-[70vh] overflow-hidden">
        <img src={panteonImg} alt="Panteón Inglés de Real del Monte" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="narrative-column pb-16">
            <h1 className="text-5xl md:text-7xl text-primary-foreground">CEMENTERIO</h1>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="narrative-column">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-body text-xl md:text-2xl leading-relaxed mb-16"
          >
            A 2.5 kilómetros del centro, en un claro del bosque de oyamel, 755 tumbas miran hacia el poniente. Hacia Inglaterra. Hacia un hogar que estos hombres abandonaron para bajar a las minas de plata mexicanas y del que muchos nunca regresaron.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            El Panteón Inglés es uno de los lugares más extraños y conmovedores de México. Las lápidas están escritas en inglés. Los nombres son galeses, cornualleses, escoceses. Las fechas hablan de vidas cortas — hombres de treinta años, mujeres aún más jóvenes, niños que no alcanzaron a cumplir un año.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            La niebla es constante aquí. Envuelve las cruces de hierro como un velo, suaviza los bordes de la piedra erosionada, convierte el musgo en terciopelo. Caminar entre las tumbas es caminar entre dos mundos: el México profundo y la Gran Bretaña victoriana, unidos por la plata y el destino.
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg italic leading-relaxed pl-6 border-l-2 border-secondary my-16"
          >
            "No hay flores frescas en la mayoría de las tumbas. Solo el musgo, los líquenes, y la niebla que cada mañana les da los buenos días en un idioma que nadie recuerda."
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed"
          >
            El 90% de las tumbas están ocupadas. El cementerio fue declarado patrimonio cultural y hoy alberga un pequeño museo. Pero su verdadero valor no está en las vitrinas — está en el silencio entre los árboles, en la manera en que la luz se filtra entre las ramas y dibuja sombras sobre nombres que ya nadie pronuncia.
          </motion.p>
        </div>
      </section>

      <footer className="section-spacing border-t border-border">
        <div className="narrative-column text-center">
          <p className="font-display text-sm tracking-widest text-muted-foreground">TALLER DE LA MEMORIA</p>
        </div>
      </footer>
    </div>
  );
};

export default Cementerio;
