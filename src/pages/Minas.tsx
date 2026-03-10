import { motion } from "framer-motion";
import minaImg from "@/assets/mina-interior.jpg";

const Minas = () => {
  return (
    <div>
      <section className="relative h-[70vh] overflow-hidden">
        <img src={minaImg} alt="Interior de la Mina de Acosta" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="narrative-column pb-16">
            <h1 className="text-5xl md:text-7xl text-primary-foreground">MINAS</h1>
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
            La historia de Real del Monte se escribió bajo tierra. Desde el siglo XVI, estas montañas fueron perforadas en busca de plata, y con cada túnel se excavó también el destino de un pueblo entero.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            La Mina de Acosta, hoy museo, permite descender 400 metros por los mismos túneles que recorrieron los mineros. El aire cambia. La temperatura baja. El silencio se vuelve físico. Las paredes de roca brillan con humedad, y los rieles del carro minero se pierden en la oscuridad.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed mb-12"
          >
            En 1766, los mineros de Real del Monte protagonizaron la primera huelga laboral de América. No pedían más paga — pedían que se respetara el <em>partido</em>, su derecho ancestral a quedarse con una parte del mineral que extraían. Fue una lucha por dignidad, escrita en las entrañas de la tierra.
          </motion.p>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg italic leading-relaxed pl-6 border-l-2 border-secondary my-16"
          >
            "El que baja a la mina no es el mismo que sube. Algo se queda abajo — el miedo, tal vez, o una versión de uno mismo que ya no sirve arriba."
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-body text-lg leading-relaxed"
          >
            Hoy las minas están en silencio. Pero si prestas atención, todavía puedes escuchar el eco de los picos contra la roca, como un corazón que late bajo la montaña.
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

export default Minas;
