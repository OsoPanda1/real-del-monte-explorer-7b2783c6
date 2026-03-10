import { motion } from "framer-motion";
import pastesImg from "@/assets/pastes-closeup.jpg";
import pasteriasImg from "@/assets/pasterias.png";

const recipeSteps = [
  { type: "heading", text: "RECETA TRADICIONAL" },
  { type: "subheading", text: "Ingredientes para la masa" },
  { type: "ingredient", text: "500 g de harina de trigo" },
  { type: "ingredient", text: "200 g de manteca de cerdo, fría" },
  { type: "ingredient", text: "1 huevo" },
  { type: "ingredient", text: "Una pizca de sal" },
  { type: "ingredient", text: "Agua fría, la necesaria" },
  { type: "subheading", text: "Para el relleno" },
  { type: "ingredient", text: "3 papas medianas, en cubos pequeños" },
  { type: "ingredient", text: "1 cebolla blanca, finamente picada" },
  { type: "ingredient", text: "200 g de carne molida de res" },
  { type: "ingredient", text: "Chile verde al gusto" },
  { type: "ingredient", text: "Sal y pimienta" },
  { type: "subheading", text: "Preparación" },
  { type: "step", text: "Mezclar la harina con la sal. Incorporar la manteca con las yemas de los dedos hasta formar una textura arenosa." },
  { type: "step", text: "Agregar el huevo y el agua poco a poco. Amasar hasta obtener una masa firme pero flexible. Dejar reposar 30 minutos." },
  { type: "step", text: "Preparar el relleno mezclando la papa, la cebolla, la carne y el chile. Sazonar." },
  { type: "step", text: "Extender la masa y cortar círculos de 15 cm. Colocar el relleno en el centro." },
  { type: "step", text: "Doblar la masa sobre el relleno y sellar presionando los bordes con un tenedor, o repulgando con los dedos — como lo hacían las mujeres de los mineros." },
  { type: "final", text: "Hornear hasta que la masa se dore." },
];

const Pastes = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src={pastesImg} alt="Pastes tradicionales de Real del Monte" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="narrative-column pb-16">
            <h1 className="text-5xl md:text-7xl text-primary-foreground">PASTES</h1>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="section-spacing">
        <div className="narrative-column">
          <p className="font-body text-xl md:text-2xl leading-relaxed mb-16">
            En 1824, los mineros de Cornualles llegaron a Real del Monte con una receta sencilla: masa, papa, cebolla, carne. Le llamaban <em>Cornish pasty</em>. Lo hacían con una orilla gruesa para sostenerlo con las manos sucias de mineral, y luego tirar esa orilla — una ofrenda involuntaria a los espíritus de la mina.
          </p>

          {/* Pasterias illustration */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <img
              src={pasteriasImg}
              alt="Pastes El Portal — Pastería tradicional de Real del Monte"
              className="w-full rounded-sm"
            />
            <p className="font-body text-sm text-muted-foreground mt-3 italic text-center">
              Las pasterías de Real del Monte mantienen viva una tradición de casi 200 años.
            </p>
          </motion.div>

          <p className="font-body text-lg leading-relaxed mb-16">
            Dos siglos después, el paste es de Real del Monte. Se rellena de tinga, de mole, de frijol con queso, de piña. Cada familia tiene su versión. Cada panadería, su secreto. Pero la forma — esa media luna sellada a mano — permanece intacta, como un gesto que cruza el tiempo.
          </p>
        </div>
      </section>

      {/* Recipe */}
      <section className="section-spacing border-t border-border">
        <div className="narrative-column">
          {recipeSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="mb-4"
            >
              {step.type === "heading" && (
                <h2 className="text-3xl md:text-4xl mb-8 mt-4">{step.text}</h2>
              )}
              {step.type === "subheading" && (
                <h3 className="font-display text-lg tracking-wide mt-12 mb-4 text-muted-foreground">{step.text}</h3>
              )}
              {step.type === "ingredient" && (
                <p className="font-body text-lg leading-relaxed pl-4 border-l-2 border-secondary">{step.text}</p>
              )}
              {step.type === "step" && (
                <p className="font-body text-lg leading-relaxed mb-6">{step.text}</p>
              )}
              {step.type === "final" && (
                <p className="font-body text-xl leading-relaxed mt-8 text-oxido font-semibold italic">{step.text}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="section-spacing border-t border-border">
        <div className="narrative-column text-center">
          <p className="font-display text-sm tracking-widest text-muted-foreground">
            TALLER DE LA MEMORIA
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pastes;
