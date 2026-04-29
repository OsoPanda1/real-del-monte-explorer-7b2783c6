import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Comercio {
  id: string;
  nombre: string;
  descripcion: string | null;
  federacion: string;
  direccion: string | null;
  telefono: string | null;
  whatsapp: string | null;
  instagram: string | null;
  sitio_web: string | null;
  imagen_url: string | null;
  verificado: boolean;
  plan: string;
}

const FEDERACIONES = [
  { v: "todas", l: "Todas" },
  { v: "hospedaje", l: "Hospedaje" },
  { v: "gastronomica", l: "Gastronómica" },
  { v: "plateria", l: "Platería" },
  { v: "comercio", l: "Comercio" },
  { v: "guias", l: "Guías" },
  { v: "cultura", l: "Cultura" },
];

const Directorio = () => {
  const { user } = useAuth();
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const [filtro, setFiltro] = useState("todas");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("comercios")
      .select("*")
      .eq("activo", true)
      .order("verificado", { ascending: false })
      .order("nombre")
      .then(({ data }) => {
        setComercios((data ?? []) as Comercio[]);
        setLoading(false);
      });
  }, []);

  const visibles = filtro === "todas" ? comercios : comercios.filter((c) => c.federacion === filtro);

  return (
    <main>
      <PageHero
        eyebrow="DIRECTORIO COMERCIAL SOBERANO"
        title="Comercios de Real del Monte"
        subtitle="Hoteles, pasterías, platerías, talleres y servicios. Federación viva del Pueblo Mágico."
      >
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/mapa">
            <Button variant="outline">Ver en mapa</Button>
          </Link>
          {user ? (
            <Link to="/comercios/nuevo">
              <Button>Registrar mi comercio</Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button>Soy comerciante · Registrarme</Button>
            </Link>
          )}
        </div>
      </PageHero>

      <section className="pb-12">
        <div className="narrative-column max-w-5xl">
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {FEDERACIONES.map((f) => (
              <button
                key={f.v}
                onClick={() => setFiltro(f.v)}
                className={`font-display text-[10px] tracking-[0.2em] px-4 py-2 border transition-colors ${
                  filtro === f.v
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {f.l.toUpperCase()}
              </button>
            ))}
          </div>

          {loading && <p className="text-center text-muted-foreground">Cargando comercios…</p>}
          {!loading && visibles.length === 0 && (
            <div className="text-center bg-card border border-border p-12 rounded-sm">
              <p className="font-display text-sm tracking-widest text-primary mb-3">DIRECTORIO EN CONSTRUCCIÓN</p>
              <p className="font-body italic text-muted-foreground mb-6">
                Aún no hay comercios registrados en esta federación.
              </p>
              {user && (
                <Link to="/comercios/nuevo">
                  <Button>Sé el primero en registrarte</Button>
                </Link>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {visibles.map((c, i) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border p-6 rounded-sm"
              >
                {c.imagen_url && (
                  <img src={c.imagen_url} alt={c.nombre} className="w-full h-40 object-cover rounded-sm mb-4" />
                )}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-lg tracking-wide">{c.nombre}</h3>
                  {c.verificado && (
                    <span className="font-display text-[10px] tracking-[0.2em] text-primary">✓ VERIFICADO</span>
                  )}
                </div>
                <p className="font-display text-[10px] tracking-[0.3em] text-muted-foreground mb-3">
                  {c.federacion.toUpperCase()}
                </p>
                {c.descripcion && (
                  <p className="font-body text-sm text-muted-foreground mb-4">{c.descripcion}</p>
                )}
                {c.direccion && <p className="font-body text-xs italic mb-2">📍 {c.direccion}</p>}
                <div className="flex flex-wrap gap-3 mt-4 text-xs">
                  {c.whatsapp && (
                    <a
                      href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      WhatsApp
                    </a>
                  )}
                  {c.instagram && (
                    <a
                      href={`https://instagram.com/${c.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                  {c.sitio_web && (
                    <a
                      href={c.sitio_web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Sitio web
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Directorio;
