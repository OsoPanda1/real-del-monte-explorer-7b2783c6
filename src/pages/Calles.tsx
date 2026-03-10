import { motion } from "framer-motion";
import heroCalles from "@/assets/hero-calles.jpg";

const Calles = () => {
  return (
    <div>
      <section className="relative h-[70vh] overflow-hidden">
        <img src={heroCalles} alt="Calles empedradas de Real del Monte" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="narrative-column pb-16">
            <h1 className="text-5xl md:text-7xl text-primary-foreground">CALLES</h1>
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
            Las calles de Real del Monte no fueron diseñadas — fueron talladas. Siguen el capricho de la montaña, subiendo y bajando sin lógica aparente, estrechándose hasta convertirse en callejones donde apenas cabe una persona.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            Los empedrados son originales en muchos tramos. Las piedras, pulidas por siglos de pasos, brillan cuando llueve — y en Real del Monte siempre está a punto de llover. Las fachadas combinan el adobe mexicano con detalles victorianos: marcos de madera, chimeneas que no deberían estar ahí, techos de dos aguas que delatan la nostalgia de los mineros ingleses por su clima lluvioso.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            Caminar por estas calles es un ejercicio de atención. Una puerta entreabierta revela un patio con macetas de geranios. Una ventana empañada deja escapar el olor a café de olla. Un perro duerme en un escalón, indiferente al frío. Todo sucede despacio, como si el pueblo hubiera acordado que la prisa no tiene sentido a esta altitud.
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg italic leading-relaxed pl-6 border-l-2 border-secondary my-16"
          >
            "Las calles de Real del Monte tienen la textura del tiempo. Cada piedra es una fecha, cada grieta un recuerdo."
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed"
          >
            La Plaza Juárez, en el corazón del pueblo, es el punto donde todo converge. La Parroquia de Nuestra Señora de la Asunción preside el espacio con su fachada de cantera. Los fines de semana, el olor a paste recién horneado se mezcla con el humo de leña y el murmullo de los visitantes. Pero entre semana, la plaza vuelve a pertenecer a los que siempre han estado aquí.
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

export default Calles;
