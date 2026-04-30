import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { callGateway } from "@/lib/tamv-gateway-client";
import { Star, ExternalLink, Network, Search } from "lucide-react";

interface PdosNode { id: string; slug: string; type: string; title: string; description: string | null; importance: number }
interface PdosEdge { id: string; from_node: string; to_node: string; relation_type: string; weight: number }
interface PdosRepo { id: string; name: string; url: string | null; category: string; language: string | null; score: number; role: string | null; highlight: boolean }

const categoryLabel: Record<string, string> = {
  "rdm-smart-city": "RDM Smart City",
  "tamv-core": "TAMV Core",
  academic: "Académico",
  documentation: "Documentación",
  infrastructure: "Infraestructura",
  experimental: "Laboratorio",
  general: "General",
};

export default function PdosCore() {
  const [graph, setGraph] = useState<{ nodes: PdosNode[]; edges: PdosEdge[] }>({ nodes: [], edges: [] });
  const [repos, setRepos] = useState<PdosRepo[]>([]);
  const [filter, setFilter] = useState("");
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    callGateway<{ nodes: PdosNode[]; edges: PdosEdge[] }>("kernel.graph.snapshot").then(setGraph).catch(() => {});
    callGateway<PdosRepo[]>("kernel.repos.list").then(setRepos).catch(() => {});
  }, []);

  const cats = Array.from(new Set(repos.map((r) => r.category)));
  const visibleRepos = repos.filter((r) => {
    if (cat !== "all" && r.category !== cat) return false;
    if (filter && !r.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHero
        title="PDOS Core"
        subtitle="Knowledge Graph + catálogo del ecosistema TAMV/OsoPanda1 (52 repositorios)"
        eyebrow="Ecosistema"
      />

      <div className="container mx-auto px-4 mt-8 space-y-12">
        {/* Knowledge Graph */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Knowledge Graph</h2>
            <Badge variant="outline">{graph.nodes.length} nodos · {graph.edges.length} relaciones</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
            {graph.nodes.map((n) => (
              <Card key={n.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{n.type}</Badge>
                    <span className="text-xs font-mono text-muted-foreground">{n.importance}</span>
                  </div>
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Catálogo de repos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-semibold">Catálogo de repositorios</h2>
            <Badge variant="outline">{visibleRepos.length} / {repos.length}</Badge>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Buscar repo…" className="pl-8" />
            </div>
            <Button variant={cat === "all" ? "default" : "outline"} size="sm" onClick={() => setCat("all")}>Todas</Button>
            {cats.map((c) => (
              <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>
                {categoryLabel[c] ?? c}
              </Button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {visibleRepos.map((r) => (
              <Card key={r.id} className={r.highlight ? "border-primary/40" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-mono break-all">{r.name}</CardTitle>
                    {r.highlight && <Star className="h-4 w-4 text-primary shrink-0" />}
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Badge variant="outline" className="text-[10px]">{categoryLabel[r.category] ?? r.category}</Badge>
                    {r.language && <span>{r.language}</span>}
                    <span className="font-mono ml-auto">{(r.score * 100).toFixed(0)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {r.role && <p className="text-xs text-muted-foreground">{r.role}</p>}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                      GitHub <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
