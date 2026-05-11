import { useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import {
  Shield, ThumbsUp, ThumbsDown, Clock, FileDown, FileText, ShieldCheck, Search, RefreshCw,
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
  const [pending, setPending] = useState<Decision[]>([]);
  const [history, setHistory] = useState<Decision[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [promoting, setPromoting] = useState(false);

  // filtros historial
  const [filterTrace, setFilterTrace] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);

  const fetchAll = async () => {
    setRefreshing(true);
    const [{ data: p }, { data: h }] = await Promise.all([
      supabase.from("pdos_decisions").select("*").eq("status", "emitted").order("created_at", { ascending: false }),
      supabase.from("pdos_decisions").select("*").neq("status", "emitted").order("reviewed_at", { ascending: false }).limit(500),
    ]);
    setPending((p as Decision[]) ?? []);
    setHistory((h as Decision[]) ?? []);
    setRefreshing(false);
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

  const filtered = useMemo(() => {
    return history.filter((d) => {
      if (filterStatus !== "all" && d.status !== filterStatus) return false;
      if (filterTrace && !d.trace_id.toLowerCase().includes(filterTrace.toLowerCase())) return false;
      const ts = new Date(d.reviewed_at ?? d.created_at).getTime();
      if (filterFrom && ts < new Date(filterFrom).getTime()) return false;
      if (filterTo && ts > new Date(filterTo).getTime() + 86400000) return false;
      return true;
    });
  }, [history, filterStatus, filterTrace, filterFrom, filterTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [filterStatus, filterTrace, filterFrom, filterTo]);

  const exportCSV = () => {
    const rows = [
      ["trace_id", "query", "status", "confidence", "created_at", "reviewed_at"],
      ...filtered.map((d) => [
        d.trace_id, (d.query ?? "").replace(/"/g, '""'),
        d.status, d.confidence.toString(),
        d.created_at, d.reviewed_at ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `guardian-decisiones-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Guardian — Decisiones Isabella", 14, 15);
    doc.setFontSize(9);
    doc.text(`Generado: ${new Date().toLocaleString("es-MX")} · ${filtered.length} registros`, 14, 22);
    autoTable(doc, {
      startY: 28,
      head: [["Trace", "Query", "Status", "Conf.", "Creado", "Revisado"]],
      body: filtered.map((d) => [
        d.trace_id.slice(0, 8),
        (d.query ?? "").slice(0, 60),
        d.status,
        `${(d.confidence * 100).toFixed(0)}%`,
        new Date(d.created_at).toLocaleString("es-MX"),
        d.reviewed_at ? new Date(d.reviewed_at).toLocaleString("es-MX") : "-",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 30, 30] },
    });
    doc.save(`guardian-decisiones-${Date.now()}.pdf`);
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
          <Card>
            <CardContent className="py-10 text-center space-y-4">
              <Shield className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Tu cuenta <code className="text-foreground">{user.email}</code> no tiene rol <code>admin</code>.
                Si eres el primer guardián o tu correo está en la lista autorizada, puedes promoverte ahora.
              </p>
              <Button onClick={promoteToAdmin} disabled={promoting}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                {promoting ? "Verificando…" : "Solicitar rol admin"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="pending">
            <div className="flex items-center justify-between gap-2 mb-4">
              <TabsList>
                <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
                <TabsTrigger value="history">Historial ({history.length})</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm" onClick={fetchAll} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} /> Refrescar
              </Button>
            </div>

            <TabsContent value="pending" className="space-y-4">
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

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardContent className="py-4 grid gap-3 md:grid-cols-5">
                  <div className="md:col-span-2 relative">
                    <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="pl-8" placeholder="Buscar trace_id…"
                      value={filterTrace} onChange={(e) => setFilterTrace(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="approved">Aprobadas</SelectItem>
                      <SelectItem value="denied">Denegadas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
                  <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={exportCSV}>
                  <FileDown className="h-4 w-4 mr-1" /> CSV
                </Button>
                <Button size="sm" variant="outline" onClick={exportPDF}>
                  <FileText className="h-4 w-4 mr-1" /> PDF
                </Button>
                <span className="text-xs text-muted-foreground self-center ml-auto">
                  {filtered.length} resultados · página {page} de {totalPages}
                </span>
              </div>

              {pageRows.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground">Sin resultados con esos filtros.</CardContent></Card>
              ) : pageRows.map((d) => (
                <Card key={d.id}>
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

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                  <span className="text-sm">{page} / {totalPages}</span>
                  <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
