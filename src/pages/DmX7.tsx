import { useEffect, useMemo, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { askIsabella, callGateway } from "@/lib/tamv-gateway-client";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Send, Zap, History, RotateCw, Search } from "lucide-react";

const ACTIONS = [
  "kernel.isabella.test",
  "kernel.isabella.query",
  "kernel.event.append",
  "kernel.graph.snapshot",
  "kernel.repos.list",
  "security.sentinel.status",
];

interface Execution {
  id: string;
  task: string;
  domain: string;
  status: string;
  trace_id: string;
  payload: any;
  result: any;
  duration_ms: number | null;
  created_at: string;
  stream_id: string;
}

export default function DmX7() {
  const [action, setAction] = useState("kernel.isabella.test");
  const [payload, setPayload] = useState('{"query":"¿Qué nodos vigilo hoy en el ecosistema?"}');
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [askResult, setAskResult] = useState<any>(null);

  const [history, setHistory] = useState<Execution[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    setRefreshing(true);
    const { data } = await supabase
      .from("pdos_executions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setHistory((data as Execution[]) ?? []);
    setRefreshing(false);
  };

  useEffect(() => { fetchHistory(); }, []);

  const run = async (actionOverride?: string, payloadOverride?: any) => {
    const a = actionOverride ?? action;
    setLoading(true); setResponse(null);
    try {
      const parsed = payloadOverride !== undefined
        ? payloadOverride
        : (payload.trim() ? JSON.parse(payload) : {});
      const res = await callGateway(a, parsed);
      setResponse(res);
      // log local en pdos_executions vía gateway action kernel.event.append
      await callGateway("kernel.event.append", { stream_id: "dm-x7-ui", task: a, ...parsed }).catch(() => {});
      fetchHistory();
    } catch (e) {
      setResponse({ error: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const replay = (ex: Execution) => {
    const a = `kernel.event.${ex.task}`.startsWith("kernel.event.kernel.")
      ? ex.task : (ACTIONS.includes(ex.task) ? ex.task : action);
    setAction(ex.task && ACTIONS.includes(ex.task) ? ex.task : action);
    setPayload(JSON.stringify(ex.payload ?? {}, null, 2));
    if (ACTIONS.includes(ex.task)) run(ex.task, ex.payload);
  };

  const ask = async () => {
    if (!askInput.trim()) return;
    setLoading(true);
    try { setAskResult(await askIsabella(askInput)); fetchHistory(); }
    catch (e) { setAskResult({ error: (e as Error).message }); }
    finally { setLoading(false); }
  };

  const filteredHistory = useMemo(() => {
    const q = historyQuery.toLowerCase().trim();
    if (!q) return history;
    return history.filter((h) =>
      h.trace_id.toLowerCase().includes(q) ||
      h.task.toLowerCase().includes(q) ||
      h.stream_id.toLowerCase().includes(q) ||
      JSON.stringify(h.payload ?? {}).toLowerCase().includes(q)
    );
  }, [history, historyQuery]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        title="DM-X7 Gateway"
        subtitle="Playground del gateway unificado del kernel TAMV OS"
        eyebrow="Ecosistema · Infraestructura"
      />

      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="playground">
          <TabsList>
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="history"><History className="h-4 w-4 mr-1" />Historial ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="playground" className="grid gap-6 lg:grid-cols-2 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Gateway raw</CardTitle>
                <CardDescription>Llama cualquier acción del DM-X7 con un payload JSON.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-1">
                  {ACTIONS.map((a) => (
                    <Badge key={a} variant={action === a ? "default" : "outline"}
                      className="cursor-pointer text-[10px]" onClick={() => setAction(a)}>{a}</Badge>
                  ))}
                </div>
                <Input value={action} onChange={(e) => setAction(e.target.value)} className="font-mono text-xs" />
                <Textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={5} className="font-mono text-xs" />
                <Button onClick={() => run()} disabled={loading} className="w-full">
                  <Send className="h-4 w-4 mr-2" /> {loading ? "Ejecutando…" : "Llamar gateway"}
                </Button>
                {response !== null && (
                  <pre className="text-xs bg-muted/40 border border-border rounded p-3 max-h-80 overflow-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Pregúntale a Isabella</CardTitle>
                <CardDescription>Decision Engine + LLM con ledger auditable.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea value={askInput} onChange={(e) => setAskInput(e.target.value)} placeholder="¿Qué federación priorizo este mes en RDM?" rows={4} />
                <Button onClick={ask} disabled={loading} className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" /> {loading ? "Pensando…" : "Consultar"}
                </Button>
                {askResult && (
                  <div className="space-y-2">
                    {askResult.error ? (
                      <p className="text-sm text-destructive">{askResult.error}</p>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">trace {String(askResult.trace_id).slice(0, 8)}</Badge>
                          <Badge variant="outline">conf {(askResult.confidence * 100).toFixed(0)}%</Badge>
                        </div>
                        {askResult.decisions?.map((d: any, i: number) => (
                          <div key={i} className="text-sm border border-border rounded p-3 bg-card">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="secondary" className="text-[10px]">{d.type}</Badge>
                              <span className="text-[10px] font-mono text-muted-foreground">prio {d.priority}</span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{d.message ?? d.reason ?? d.target ?? "(sin mensaje)"}</p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8" placeholder="Buscar por trace_id, task, stream o payload…"
                  value={historyQuery} onChange={(e) => setHistoryQuery(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" onClick={fetchHistory} disabled={refreshing}>
                <RotateCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />Refrescar
              </Button>
            </div>

            {filteredHistory.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-muted-foreground">Sin ejecuciones registradas.</CardContent></Card>
            ) : filteredHistory.map((ex) => (
              <Card key={ex.id}>
                <CardContent className="py-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-[10px]">{ex.trace_id.slice(0, 8)}</Badge>
                      <Badge>{ex.task}</Badge>
                      <Badge variant="secondary">{ex.stream_id}</Badge>
                      <Badge variant={ex.status === "completed" ? "default" : "destructive"}>{ex.status}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(ex.created_at).toLocaleString("es-MX")} · {ex.duration_ms ?? 0}ms</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => replay(ex)}>
                      <RotateCw className="h-4 w-4 mr-1" /> Repetir
                    </Button>
                  </div>
                  <pre className="text-[10px] font-mono bg-muted/40 border border-border rounded p-2 max-h-32 overflow-auto">
                    {JSON.stringify(ex.payload ?? {}, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
