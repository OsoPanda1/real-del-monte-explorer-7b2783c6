import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Decision {
  id: string;
  trace_id: string;
  query: string | null;
  decisions: any;
  confidence: number;
  rule_version: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

export default function Guardian() {
  const { user, isAdmin, loading } = useAuth();
  const [pending, setPending] = useState<Decision[]>([]);
  const [history, setHistory] = useState<Decision[]>([]);

  const fetchAll = async () => {
    const [{ data: p }, { data: h }] = await Promise.all([
      supabase.from("pdos_decisions").select("*").eq("status", "emitted").order("created_at", { ascending: false }),
      supabase.from("pdos_decisions").select("*").neq("status", "emitted").order("reviewed_at", { ascending: false }).limit(50),
    ]);
    setPending((p as Decision[]) ?? []);
    setHistory((h as Decision[]) ?? []);
  };

  useEffect(() => { if (!loading) fetchAll(); }, [loading]);

  const resolve = async (id: string, status: "approved" | "denied") => {
    const { error } = await supabase
      .from("pdos_decisions")
      .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Decisión ${status === "approved" ? "aprobada" : "denegada"}`); fetchAll(); }
  };

  if (loading) return <div className="container mx-auto p-12">Cargando…</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        title="Guardian Console"
        subtitle="Revisión humana (HITL) de decisiones emitidas por Isabella"
        eyebrow="Gobernanza"
      />

      <div className="container mx-auto px-4 mt-8">
        {!user ? (
          <Card><CardContent className="py-10 text-center space-y-3">
            <Shield className="h-10 w-10 mx-auto text-muted-foreground" />
            <p>Necesitas iniciar sesión para entrar al panel de guardianes.</p>
            <Button asChild><Link to="/auth">Iniciar sesión</Link></Button>
          </CardContent></Card>
        ) : !isAdmin ? (
          <Card><CardContent className="py-10 text-center text-muted-foreground">
            Tu cuenta está autenticada pero no tiene rol <code>admin</code>. Pide a un guardián existente que te lo asigne.
          </CardContent></Card>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
              <TabsTrigger value="history">Historial ({history.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6 space-y-4">
              {pending.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">Sin decisiones pendientes.</CardContent></Card>
              ) : pending.map((d) => (
                <Card key={d.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">Trace <span className="font-mono text-xs">{d.trace_id.slice(0, 8)}</span></CardTitle>
                        <CardDescription>{d.query || "(sin query)"} · {new Date(d.created_at).toLocaleString("es-MX")}</CardDescription>
                      </div>
                      <Badge variant="outline">conf {(d.confidence * 100).toFixed(0)}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-xs font-mono bg-muted/50 p-3 rounded border border-border max-h-40 overflow-auto">
                      {JSON.stringify(d.decisions, null, 2)}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => resolve(d.id, "approved")}><ThumbsUp className="h-4 w-4 mr-1" />Aprobar</Button>
                      <Button size="sm" variant="outline" onClick={() => resolve(d.id, "denied")}><ThumbsDown className="h-4 w-4 mr-1" />Denegar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="history" className="mt-6 space-y-3">
              {history.map((d) => (
                <Card key={d.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{d.query || "(sin query)"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" /> {new Date(d.reviewed_at ?? d.created_at).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <Badge variant={d.status === "approved" ? "default" : "secondary"}>{d.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
