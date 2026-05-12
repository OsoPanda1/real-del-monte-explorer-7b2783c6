import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Compass, Map, Sparkles, Shield, CreditCard, Activity, Trophy, Bell } from "lucide-react";

const steps = [
  { icon: Map, title: "1 · Territorio", body: "Recorre Pastes, Minas, Cementerio, Calles, Rutas, Leyendas y Eventos. Es la cara cultural del pueblo.", to: "/rutas" },
  { icon: Compass, title: "2 · Ecosistema", body: "Descubre la Plataforma TAMV, Federaciones, Directorio, Mapa interactivo de comercios y el catálogo PDOS Core.", to: "/ecosistema" },
  { icon: Sparkles, title: "3 · Isabella IA", body: "Pregunta a la inteligencia cívica. Cada decisión queda en un ledger auditable que un guardián humano puede aprobar o denegar.", to: "/isabella" },
  { icon: Shield, title: "4 · Guardian Console", body: "Panel HITL para revisión de decisiones de Isabella. Filtros por trace, fechas y estado, y exportación PDF/CSV.", to: "/guardian" },
  { icon: Activity, title: "5 · DM-X7 Gateway", body: "Centro de control del kernel TAMV-OS. Llama acciones del kernel, revisa el historial y repite ejecuciones con un nuevo trace_id auditado.", to: "/dm-x7" },
  { icon: CreditCard, title: "6 · Cattleya Pay", body: "Apoya el desarrollo del Nodo Cero con pagos seguros vía Stripe en modo de pruebas.", to: "/propuesta" },
  { icon: Trophy, title: "7 · Logros y XP", body: "Cada acción suma XP. Sube de nivel, desbloquea badges y aparece en el leaderboard del Nodo Cero.", to: "/logros" },
  { icon: Bell, title: "8 · Notificaciones", body: "Las decisiones de Isabella, replays y avances de gamificación llegan en tiempo real a tu campana.", to: "/" },
];

export default function Tutorial() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero eyebrow="ONBOARDING" title="Cómo funciona la plataforma"
        subtitle="Una visita guiada por los tres mundos del Nodo Cero: Territorio, Ecosistema y Gobernanza." />
      <div className="container mx-auto px-4 mt-8 grid gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <Card key={i} className="animate-fade-in hover-scale" style={{ animationDelay: `${i * 80}ms` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <s.icon className="h-5 w-5 text-primary" />{s.title}
              </CardTitle>
              <CardDescription>{s.body}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm"><Link to={s.to}>Abrir →</Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
