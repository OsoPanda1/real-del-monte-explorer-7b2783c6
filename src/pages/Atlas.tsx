import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OperationalReadinessBoard } from "@/components/OperationalReadinessBoard";
import { callGateway } from "@/lib/tamv-gateway-client";
import { heptaNuclei } from "@/data/tamvEcosystem";
import { Activity, Globe, ShieldCheck, Cpu } from "lucide-react";

interface SentinelStatus { status: string; events_24h: number; recent_threats: unknown[] }

export default function Atlas() {
  const [sentinel, setSentinel] = useState<SentinelStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    callGateway<SentinelStatus>("security.sentinel.status")
      .then(setSentinel)
      .catch(() => setSentinel({ status: "ERROR", events_24h: 0, recent_threats: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        title="Atlas Federado"
        subtitle="Monitor civilizatorio · Heptanúcleos · Estado del ecosistema en vivo"
        eyebrow="Gobernanza"
      />

      <div className="container mx-auto px-4 mt-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><Globe className="h-4 w-4" /> Estado global</div>
              <p className="text-2xl font-semibold">{loading ? "…" : sentinel?.status ?? "—"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><Activity className="h-4 w-4" /> Eventos 24h</div>
              <p className="text-2xl font-semibold font-mono">{sentinel?.events_24h ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><ShieldCheck className="h-4 w-4" /> Amenazas</div>
              <p className="text-2xl font-semibold">{sentinel?.recent_threats?.length ?? 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-sm"><Cpu className="h-4 w-4" /> Núcleos activos</div>
              <p className="text-2xl font-semibold font-mono">{heptaNuclei.length}/7</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="nuclei">
          <TabsList>
            <TabsTrigger value="nuclei">Heptanúcleos</TabsTrigger>
            <TabsTrigger value="readiness">Preparación operativa</TabsTrigger>
          </TabsList>

          <TabsContent value="nuclei" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {heptaNuclei.map((n) => (
                <Card key={n.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{n.name}</CardTitle>
                      <Badge variant="outline">{n.status}</Badge>
                    </div>
                    <CardDescription>{n.domain}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{n.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs"><span>Resistencia</span><span className="font-mono">{n.resistance}%</span></div>
                      <Progress value={n.resistance} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="readiness" className="mt-6">
            <OperationalReadinessBoard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
