import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { listGuardian } from "@/lib/tamv-gateway-client";
import { toast } from "sonner";
import {
  Shield, ThumbsUp, ThumbsDown, Clock, FileDown, FileText, ShieldCheck, Search, RefreshCw, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const PAGE_SIZE = 10;

export default function Guardian() {
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [rows, setRows] = useState<Decision[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [promoting, setPromoting] = useState(false);

  const [filterTrace, setFilterTrace] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const fetchPage = async (p = page) => {
    setRefreshing(true);
    try {
      const res = await listGuardian({
        tab, page: p, page_size: PAGE_SIZE,
        trace_id: filterTrace || undefined,
        status: tab === "history" ? filterStatus : undefined,
        from: filterFrom || undefined, to: filterTo || undefined,
        query_text: filterQuery || undefined,
      });
      setRows(res.rows as Decision[]);
      setTotal(res.total);
      setPage(res.page);
    } catch (e: any) {
      toast.error(e.message ?? "Error cargando");
    } finally { setRefreshing(false); }
  };

  useEffect(() => { if (!loading && isAdmin) fetchPage(1); /* eslint-disable-next-line */ }, [loading, isAdmin, tab]);

  const applyFilters = () => fetchPage(1);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const resolve = async (id: string, status: "approved" | "denied") => {
    const { error } = await supabase
      .from("pdos_decisions")
      .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Decisión ${status === "approved" ? "aprobada" : "denegada"}`); fetchPage(); }
  };

  const promoteToAdmin = async () => {
    setPromoting(true);
    const { data, error } = await supabase.functions.invoke("promote-admin", { body: {} });
    setPromoting(false);
    if (error || !data?.ok) {
      toast.error(data?.error ?? error?.message ?? "No autorizado");
      return;
    }
    toast.success(`Eres admin (${data.reason}). Recarga la página.`);
    setTimeout(() => window.location.reload(), 800);
  };

  const fetchAllForExport = async (): Promise<Decision[]> => {
    const res = await listGuardian({
      tab, page: 1, page_size: 5000,
      trace_id: filterTrace || undefined,
      status: tab === "history" ? filterStatus : undefined,
      from: filterFrom || undefined, to: filterTo || undefined,
      query_text: filterQuery || undefined,
    });
    return res.rows as Decision[];
  };

  const csvFor = (data: Decision[]) => {
    const head = ["trace_id","query","status","confidence","created_at","reviewed_at"];
    const body = data.map((d) => [
      d.trace_id, (d.query ?? "").replace(/"/g, '""'),
      d.status, d.confidence.toString(), d.created_at, d.reviewed_at ?? "",
    ]);
    const csv = [head, ...body].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `guardian-${tab}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const pdfFor = (data: Decision[]) => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14); doc.text("Guardian — Decisiones Isabella", 14, 15);
    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString("es-MX")} · ${data.length} registros · tab=${tab}`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Trace", "Query (completa)", "Status", "Conf.", "Creado", "Revisado"]],
      body: data.map((d) => [
        d.trace_id.slice(0, 8), d.query ?? "", d.status,
        `${(d.confidence * 100).toFixed(0)}%`,
        new Date(d.created_at).toISOString(),
        d.reviewed_at ? new Date(d.reviewed_at).toISOString() : "-",
      ]),
      styles: { fontSize: 7, cellWidth: "wrap" },
      columnStyles: { 1: { cellWidth: 90 } },
      headStyles: { fillColor: [30, 30, 30] },
    });
    doc.save(`guardian-${tab}-${Date.now()}.pdf`);
  };

  const exportPage = (kind: "csv" | "pdf") => kind === "csv" ? csvFor(rows) : pdfFor(rows);
  const exportAll = async (kind: "csv" | "pdf") => {
    toast.loading("Exportando todos los filtrados…", { id: "exp" });
    try { const all = await fetchAllForExport(); kind === "csv" ? csvFor(all) : pdfFor(all); toast.success(`${all.length} registros exportados`, { id: "exp" }); }
    catch (e: any) { toast.error(e.message ?? "Error", { id: "exp" }); }
  };

  if (loading) return <div className="container mx-auto p-12">Cargando…</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero title="Guardian Console" subtitle="Revisión humana (HITL) de decisiones de Isabella" eyebrow="Gobernanza" />

      <div className="container mx-auto px-4 mt-8">
        {!user ? (
          <Card><CardContent className="py-10 text-center space-y-3">
            <Shield className="h-10 w-10 mx-auto text-muted-foreground" />
            <p>Necesitas iniciar sesión para entrar al panel de guardianes.</p>
            <Button asChild><Link to="/auth">Iniciar sesión</Link></Button>
          </CardContent></Card>
        ) : !isAdmin ? (
          <Card><CardContent className="py-10 text-center space-y-4">
            <Shield className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Tu cuenta <code className="text-foreground">{user.email}</code> no tiene rol <code>admin</code>.
              Si eres el primer guardián o tu correo está en la lista autorizada, puedes promoverte ahora.
            </p>
            <Button onClick={promoteToAdmin} disabled={promoting}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              {promoting ? "Verificando…" : "Solicitar rol admin"}
            </Button>
          </CardContent></Card>
        ) : (
          <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setPage(1); }}>
            <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
              <TabsList>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" onClick={() => fetchPage()} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refrescar
              </Button>
            </div>

            <Card className="mb-4">
              <CardContent className="py-4 grid gap-3 md:grid-cols-6">
                <div className="md:col-span-2 relative">
                  <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-8" placeholder="trace_id…" value={filterTrace} onChange={(e) => setFilterTrace(e.target.value)} />
                </div>
                <Input placeholder="texto en query…" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
                {tab === "history" && (
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="approved">Aprobadas</SelectItem>
                      <SelectItem value="denied">Denegadas</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                <Button onClick={applyFilters} className="md:col-span-6 md:max-w-xs md:mx-auto">
                  Aplicar filtros
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => exportPage("csv")}><FileDown className="h-4 w-4 mr-1" /> CSV página</Button>
              <Button size="sm" variant="outline" onClick={() => exportPage("pdf")}><FileText className="h-4 w-4 mr-1" /> PDF página</Button>
              <Button size="sm" onClick={() => exportAll("csv")}><FileDown className="h-4 w-4 mr-1" /> CSV todos filtrados</Button>
              <Button size="sm" onClick={() => exportAll("pdf")}><FileText className="h-4 w-4 mr-1" /> PDF todos filtrados</Button>
              <span className="text-xs text-muted-foreground self-center ml-auto">
                {total} resultados · página {page} de {totalPages}
              </span>
            </div>

            <TabsContent value="pending" className="space-y-4">
              {rows.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">Sin decisiones pendientes.</CardContent></Card>
              ) : rows.map((d) => (
                <Card key={d.id} className="animate-fade-in">
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

            <TabsContent value="history" className="space-y-4">
              {rows.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">Sin resultados con esos filtros.</CardContent></Card>
              ) : rows.map((d) => (
                <Card key={d.id} className="animate-fade-in">
                  <CardContent className="py-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{d.query || "(sin query)"}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="font-mono">{d.trace_id.slice(0, 8)}</span>
                        <Clock className="h-3 w-3" /> {new Date(d.reviewed_at ?? d.created_at).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <Badge variant={d.status === "approved" ? "default" : "secondary"}>{d.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => fetchPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">{page} / {totalPages}</span>
                <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => fetchPage(page + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
}
