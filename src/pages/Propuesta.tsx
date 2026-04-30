import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { startCattleyaCheckout } from "@/lib/tamv-gateway-client";
import { toast } from "sonner";
import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";

const ingresos = [
  { cat: "Hoteles", base: 20, cuota: 500, total: 10000 },
  { cat: "Restaurantes / Pasterías", base: 20, cuota: 300, total: 6000 },
  { cat: "Bares", base: 10, cuota: 250, total: 2500 },
  { cat: "Platerías", base: 50, cuota: 300, total: 15000 },
  { cat: "Artesanías", base: 20, cuota: 200, total: 4000 },
  { cat: "Semiambulantes", base: 100, cuota: 100, total: 10000 },
];

const activos = [
  { c: "Infraestructura de Software", d: "Licenciamiento y arquitectura core de TAMV Online", v: "$300,000" },
  { c: "Repositorio Narrativo", d: "Fotos, videos, leyendas y contenido editorial", v: "$400,000" },
  { c: "Inteligencia de Datos", d: "Base de perfiles de turistas y métricas", v: "$350,000" },
  { c: "Entrenamiento de IA (REALITO)", d: "Modelo optimizado con lenguaje local", v: "$500,000" },
];

const fmt = (n: number) => `$${n.toLocaleString("es-MX")} MXN`;

const Propuesta = () => {
  const subtotal = ingresos.reduce((s, r) => s + r.total, 0);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const subscribe = async (cat: string, monto: number) => {
    setLoadingPlan(cat);
    try {
      const res = await startCattleyaCheckout({
        product: `Suscripción Federación ${cat}`,
        amount_cents: monto * 100,
        plan: "monthly",
        currency: "mxn",
      });
      if (res.url) window.location.href = res.url;
      else toast.error(res.error ?? "No se pudo iniciar el checkout");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <main>
      <PageHero
        eyebrow="PROTOCOLO FEDERADO DE INTENCIÓN ESTRATÉGICA"
        title="Propuesta al H. Cabildo"
        subtitle="Mineral del Monte, Hidalgo · Trazabilidad RDM-TAMV-2026-03-001"
      />

      <section className="section-spacing pt-0">
        <div className="narrative-column">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-card border border-border p-8 mb-12 rounded-sm"
          >
            <h2 className="text-2xl mb-4">INVERSIÓN INICIAL</h2>
            <p className="font-display text-4xl text-primary mb-2">{fmt(400000)}</p>
            <p className="font-body text-muted-foreground">
              Aportación municipal única: $100,000 para alfabetización digital de 100 comercios y
              $300,000 para despliegue de infraestructura, IA y producción de contenidos 4K.
            </p>
          </motion.div>

          <h2 className="text-2xl md:text-3xl mb-6">INGRESOS POR SUSCRIPCIONES</h2>
          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-foreground/20">
                  <th className="text-left p-3 font-display text-xs tracking-widest">Categoría</th>
                  <th className="text-right p-3 font-display text-xs tracking-widest">Base</th>
                  <th className="text-right p-3 font-display text-xs tracking-widest">Cuota</th>
                  <th className="text-right p-3 font-display text-xs tracking-widest">Mensual</th>
                </tr>
              </thead>
              <tbody>
                {ingresos.map((r) => (
                  <tr key={r.cat} className="border-b border-border">
                    <td className="p-3 font-body">{r.cat}</td>
                    <td className="p-3 text-right font-body">{r.base}</td>
                    <td className="p-3 text-right font-body">{fmt(r.cuota)}</td>
                    <td className="p-3 text-right font-body">{fmt(r.total)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-foreground/20 bg-foreground/5">
                  <td className="p-3 font-display tracking-widest text-sm">SUBTOTAL</td>
                  <td className="p-3 text-right font-display">220</td>
                  <td className="p-3"></td>
                  <td className="p-3 text-right font-display text-primary">{fmt(subtotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card border border-border p-6 rounded-sm">
              <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-2">INGRESO ANUAL</p>
              <p className="font-display text-2xl">{fmt(912000)}</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-sm">
              <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-2">RETORNO MUNICIPIO (40%)</p>
              <p className="font-display text-2xl">{fmt(364800)}/año</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-sm">
              <p className="font-display text-[10px] tracking-[0.3em] text-primary mb-2">RECUPERACIÓN</p>
              <p className="font-display text-2xl">1.1 años</p>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl mb-6">VALORIZACIÓN DEL ACTIVO (CIERRE AÑO 1)</h2>
          <div className="space-y-3 mb-8">
            {activos.map((a) => (
              <div key={a.c} className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="font-display tracking-wide text-base">{a.c}</h3>
                  <p className="font-body text-sm text-muted-foreground">{a.d}</p>
                </div>
                <p className="font-display text-lg text-primary">{a.v} MXN</p>
              </div>
            ))}
            <div className="flex justify-between pt-4 border-t-2 border-foreground/20">
              <h3 className="font-display tracking-widest text-lg">VALOR TOTAL DEL ACTIVO</h3>
              <p className="font-display text-2xl text-primary">$1,550,000 MXN</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Propuesta;
