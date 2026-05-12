import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { askIsabella, callGateway, callGatewayFull, listExecutions } from "@/lib/tamv-gateway-client";
import { toast } from "sonner";
import { Sparkles, Send, Zap, History, RotateCw, Search, ChevronLeft, ChevronRight } from "lucide-react";

const ACTIONS = [
  "kernel.isabella.test", "kernel.isabella.query", "kernel.event.append",
  "kernel.graph.snapshot", "kernel.repos.list", "security.sentinel.status",
];

interface Execution {
  id: string; task: string; domain: string; status: string;
  trace_id: string; payload: any; result: any; duration_ms: number | null;
  created_at: string; stream_id: string;
}

const PAGE_SIZE = 25;

export default function DmX7() {
  const [action, setAction] = useState("kernel.isabella.test");
  const [payload, setPayload] = useState('{"query":"¿Qué nodos vigilo hoy en el ecosistema?"}');
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [askResult, setAskResult] = useState<any>(null);

  const [history, setHistory] = useState<Execution[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTrace, setFilterTrace] = useState("");
  const [filterTask, setFilterTask] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  const [confirmReplay, setConfirmReplay] = useState<Execution | null>(null);

  const fetchHistory = async (p = page) => {
    setRefreshing(true);
    try {
      const res = await listExecutions({
        page: p, page_size: PAGE_SIZE,
        trace_id: filterTrace || undefined, task: filterTask || undefined,
        status: filterStatus, from: filterFrom || undefined, to: filterTo || undefined,
      });
      setHistory(res.rows as Execution[]); setTotal(res.total); setPage(res.page);
    } catch (e: any) { toast.error(e.message ?? "Error"); }
    finally { setRefreshing(false); }
  };

  useEffect(() => { fetchHistory(1); /* eslint-disable-next-line */ }, []);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const run = async (actionOverride?: string, payloadOverride?: any) => {
    const a = actionOverride ?? action;
    setLoading(true); setResponse(null);
    try {
      const parsed = payloadOverride !== undefined
        ? payloadOverride
        : (payload.trim() ? JSON.parse(payload) : {});
      const res = await callGateway(a, parsed);
      setResponse(res);
      await callGateway("kernel.event.append", { stream_id: "dm-x7-ui", task: a, ...parsed }).catch(() => {});
      fetchHistory();
    } catch (e) { setResponse({ error: (e as Error).message }); }
    finally { setLoading(false); }
  };

  const doReplay = async (ex: Execution) => {
    setConfirmReplay(null);
    setLoading(true);
    try {
      const res = await callGatewayFull(ex.task, ex.payload ?? {}, { replay_of: ex.trace_id });
      const newTrace = res.new_trace_id?.slice(0, 8) ?? "?";
      toast.success(`Replay ejecutado · nuevo trace ${newTrace}`, { duration: 6000 });
      setResponse(res.result);
      fetchHistory();
    } catch (e: any) { toast.error(e.message ?? "Error replay"); }
    finally { setLoading(false); }
  };

  const ask = async () => {
    if (!askInput.trim()) return;
    setLoading(true);
    try { setAskResult(await askIsabella(askInput)); fetchHistory(); }
    catch (e) { setAskResult({ error: (e as Error).message }); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero title="DM-X7 Gateway" subtitle="Playground del gateway unificado del kernel TAMV OS" eyebrow="Ecosistema · Infraestructura" />

      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="playground">
          <TabsList>
            <TabsTrigger value="playground">Playground</TabsTrigger>
            <TabsTrigger value="history"><History className="h-4 w-4 mr-1" />Historial</TabsTrigger>
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
                          <div key={i} className="text-sm border border-border rounded p-3 bg-card animate-fade-in">
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
            <Card>
              <CardContent className="py-4 grid gap-3 md:grid-cols-6">
                <div className="md:col-span-2 relative">
                  <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-8" placeholder="trace_id…" value={filterTrace} onChange={(e) => setFilterTrace(e.target.value)} />
                </div>
                <Input placeholder="task…" value={filterTask} onChange={(e) => setFilterTask(e.target.value)} />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                <Button onClick={() => fetchHistory(1)} className="md:col-span-6 md:max-w-xs md:mx-auto">
                  <RotateCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Aplicar filtros
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-center text-xs text-muted-foreground">
              {total} ejecuciones · página {page} de {totalPages}
            </div>

            {history.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-muted-foreground">Sin ejecuciones registradas.</CardContent></Card>
            ) : history.map((ex) => (
              <Card key={ex.id} className="animate-fade-in">
                <CardContent className="py-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="font-mono text-[10px]">{ex.trace_id.slice(0, 8)}</Badge>
                      <Badge>{ex.task}</Badge>
                      <Badge variant="secondary">{ex.stream_id}</Badge>
                      <Badge variant={ex.status === "completed" ? "default" : "destructive"}>{ex.status}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(ex.created_at).toLocaleString("es-MX")} · {ex.duration_ms ?? 0}ms</span>
                      {(ex.payload as any)?.replay_of && (
                        <Badge variant="outline" className="text-[10px]">replay de {String((ex.payload as any).replay_of).slice(0,8)}</Badge>
                      )}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setConfirmReplay(ex)}>
                      <RotateCw className="h-4 w-4 mr-1" /> Repetir
                    </Button>
                  </div>
                  <pre className="text-[10px] font-mono bg-muted/40 border border-border rounded p-2 max-h-32 overflow-auto">
                    {JSON.stringify(ex.payload ?? {}, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => fetchHistory(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">{page} / {totalPages}</span>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => fetchHistory(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={!!confirmReplay} onOpenChange={(o) => !o && setConfirmReplay(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Repetir esta ejecución?</AlertDialogTitle>
            <AlertDialogDescription>
              Se generará un <strong>nuevo trace_id</strong> y se registrará un evento auditable en
              <code> pdos_executions </code> con <code>replay_of = {confirmReplay?.trace_id?.slice(0, 8)}</code>.
              Acción: <code>{confirmReplay?.task}</code>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReplay && doReplay(confirmReplay)}>Confirmar replay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
