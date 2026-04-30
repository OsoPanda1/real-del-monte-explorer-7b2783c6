import { useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { askIsabella, callGateway } from "@/lib/tamv-gateway-client";
import { Sparkles, Send, Zap } from "lucide-react";

const ACTIONS = [
  "kernel.isabella.test",
  "kernel.isabella.query",
  "kernel.event.append",
  "kernel.graph.snapshot",
  "kernel.repos.list",
  "security.sentinel.status",
];

export default function DmX7() {
  const [action, setAction] = useState("kernel.isabella.test");
  const [payload, setPayload] = useState('{"query":"¿Qué nodos vigilo hoy en el ecosistema?"}');
  const [response, setResponse] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [askInput, setAskInput] = useState("");
  const [askResult, setAskResult] = useState<any>(null);

  const run = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const parsed = payload.trim() ? JSON.parse(payload) : {};
      const res = await callGateway(action, parsed);
      setResponse(res);
    } catch (e) {
      setResponse({ error: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const ask = async () => {
    if (!askInput.trim()) return;
    setLoading(true);
    try {
      setAskResult(await askIsabella(askInput));
    } catch (e) {
      setAskResult({ error: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        title="DM-X7 Gateway"
        subtitle="Playground del gateway unificado del kernel TAMV OS"
        eyebrow="Ecosistema · Infraestructura"
      />

      <div className="container mx-auto px-4 mt-8 grid gap-6 lg:grid-cols-2">
        {/* Gateway raw */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-primary" />Gateway raw</CardTitle>
            <CardDescription>Llama cualquier acción del DM-X7 con un payload JSON.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1">
              {ACTIONS.map((a) => (
                <Badge key={a} variant={action === a ? "default" : "outline"} className="cursor-pointer text-[10px]" onClick={() => setAction(a)}>
                  {a}
                </Badge>
              ))}
            </div>
            <Input value={action} onChange={(e) => setAction(e.target.value)} className="font-mono text-xs" />
            <Textarea value={payload} onChange={(e) => setPayload(e.target.value)} rows={5} className="font-mono text-xs" />
            <Button onClick={run} disabled={loading} className="w-full">
              <Send className="h-4 w-4 mr-2" /> {loading ? "Ejecutando…" : "Llamar gateway"}
            </Button>
            {response !== null && (
              <pre className="text-xs bg-muted/40 border border-border rounded p-3 max-h-80 overflow-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>

        {/* Isabella ask */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Pregúntale a Isabella</CardTitle>
            <CardDescription>Decision Engine + LLM (google/gemini-2.5-flash) con ledger auditable.</CardDescription>
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
      </div>
    </div>
  );
}
