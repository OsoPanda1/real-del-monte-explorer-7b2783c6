import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";

interface Evento {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  ubicacion: string | null;
  imagen_url: string | null;
  categoria: string | null;
}

const Eventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("eventos")
      .select("*")
      .eq("publicado", true)
      .order("fecha_inicio", { ascending: true })
      .then(({ data }) => {
        setEventos((data ?? []) as Evento[]);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <PageHero
        eyebrow="AGENDA VIVA"
        title="Eventos en Real del Monte"
        subtitle="Festivales, ferias, conciertos y celebraciones del Pueblo Mágico."
      />
      <section className="section-spacing pt-0">
        <div className="narrative-column max-w-4xl">
          {loading && <p className="font-body text-muted-foreground text-center">Cargando agenda…</p>}
          {!loading && eventos.length === 0 && (
            <div className="text-center bg-card border border-border p-12 rounded-sm">
              <p className="font-display text-sm tracking-widest text-primary mb-3">SIN EVENTOS PUBLICADOS</p>
              <p className="font-body italic text-muted-foreground">
                La agenda se actualizará cuando los administradores municipales publiquen las próximas
                fechas (Festival del Paste, Feria de la Plata, Feria Patronal y más).
              </p>
            </div>
          )}
          <div className="space-y-6">
            {eventos.map((e, i) => (
              <motion.article
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border p-6 rounded-sm flex gap-6"
              >
                <div className="flex-shrink-0 text-center w-20 border-r border-border pr-6">
                  <p className="font-display text-3xl text-primary">
                    {new Date(e.fecha_inicio).getDate()}
                  </p>
                  <p className="font-display text-[10px] tracking-[0.3em] text-muted-foreground">
                    {new Date(e.fecha_inicio).toLocaleDateString("es-MX", { month: "short" }).toUpperCase()}
                  </p>
                </div>
                <div className="flex-1">
                  {e.categoria && (
                    <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-1">
                      {e.categoria}
                    </p>
                  )}
                  <h3 className="font-display text-xl tracking-tight mb-2">{e.titulo}</h3>
                  {e.descripcion && (
                    <p className="font-body text-base text-muted-foreground mb-2">{e.descripcion}</p>
                  )}
                  {e.ubicacion && (
                    <p className="font-body text-sm italic text-foreground/60">📍 {e.ubicacion}</p>
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

export default Eventos;
