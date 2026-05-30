import PageHero from "@/components/PageHero";
import StarfieldBackground from "@/components/StarfieldBackground";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HE_HEXAGONS, HEP_DOMAINS, ISABELLA_MODULES, ELITE_HEHEP_MANIFEST,
  ATLAS_BACKEND_ENDPOINTS, FUSED_REPOSITORIES,
} from "@/data/eliteHeHep";
import { ROOT_ARCHITECT } from "@/data/awakening";
import { Hexagon, Shield, Cpu, Database, GitBranch, Sparkles } from "lucide-react";

export default function Nexus() {
  return (
    <div className="min-h-screen bg-background pb-24 relative">
      <StarfieldBackground />
      <div className="relative z-10">
        <PageHero
          title="Nexus ELITE HeHep"
          subtitle="Fusión operativa de rdm-digital-nodo-cero · oso-data-weaver · tamv-atlas-nextgen"
          eyebrow={`${ELITE_HEHEP_MANIFEST.doctrine} · ${ROOT_ARCHITECT.orcid}`}
        />

        <div className="container mx-auto px-4 mt-8 space-y-8">
          {/* Manifest header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> {ELITE_HEHEP_MANIFEST.project}
                  </CardTitle>
                  <CardDescription>{ELITE_HEHEP_MANIFEST.fullName}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ELITE_HEHEP_MANIFEST.compatibility.map((c) => (
                    <Badge key={c} variant="outline">{c}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Kernels</p>
                <p className="font-medium">{ELITE_HEHEP_MANIFEST.kernels.join(" · ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Canonical Kernel</p>
                <p className="font-mono text-xs">{ELITE_HEHEP_MANIFEST.canonicalKernel}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">BookPI Integrity</p>
                <p className="font-mono text-xs">{ELITE_HEHEP_MANIFEST.bookpi.integrity}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="hexagons">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="hexagons"><Hexagon className="h-4 w-4 mr-1" />He Hexágonos</TabsTrigger>
              <TabsTrigger value="domains"><Shield className="h-4 w-4 mr-1" />Hep Dominios</TabsTrigger>
              <TabsTrigger value="modules"><Cpu className="h-4 w-4 mr-1" />Módulos Isabella</TabsTrigger>
              <TabsTrigger value="endpoints"><Database className="h-4 w-4 mr-1" />Atlas API</TabsTrigger>
              <TabsTrigger value="repos"><GitBranch className="h-4 w-4 mr-1" />Repos fusionados</TabsTrigger>
            </TabsList>

            <TabsContent value="hexagons" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {HE_HEXAGONS.map((h) => (
                <Card key={h.id}>
                  <CardHeader>
                    <Badge className="w-fit mb-1" variant="secondary">{h.eventPrefix}</Badge>
                    <CardTitle className="text-base">{h.id} · {h.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{h.role}</CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="domains" className="grid md:grid-cols-2 gap-4 mt-4">
              {HEP_DOMAINS.map((d) => (
                <Card key={d.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{d.id} · {d.name}</CardTitle>
                    <CardDescription>{d.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-1">
                    {d.guardians.map((g) => (
                      <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="modules" className="space-y-2 mt-4">
              {ISABELLA_MODULES.map((m) => (
                <Card key={m.module}>
                  <CardContent className="py-4 grid md:grid-cols-12 gap-3 items-center text-sm">
                    <div className="md:col-span-3 font-medium">{m.module}</div>
                    <div className="md:col-span-2 flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{m.hexagon}</Badge>
                      <Badge variant="outline" className="text-xs">{m.domain}</Badge>
                    </div>
                    <div className="md:col-span-3 text-muted-foreground text-xs"><b>in:</b> {m.input}</div>
                    <div className="md:col-span-2 text-muted-foreground text-xs"><b>out:</b> {m.output}</div>
                    <div className="md:col-span-2 flex gap-1 flex-wrap">
                      {m.guardianPolicy.map((g) => <Badge key={g} variant="outline" className="text-[10px]">{g}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-1 mt-4">
              {ATLAS_BACKEND_ENDPOINTS.map((e) => (
                <Card key={e.path}>
                  <CardContent className="py-3 flex items-center gap-3 text-sm">
                    <Badge variant={e.method === "GET" ? "secondary" : "default"} className="font-mono w-14 justify-center">{e.method}</Badge>
                    <code className="font-mono text-xs text-primary">{e.path}</code>
                    <span className="text-muted-foreground text-xs ml-auto">{e.desc}</span>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="repos" className="grid md:grid-cols-3 gap-4 mt-4">
              {FUSED_REPOSITORIES.map((r) => (
                <Card key={r.name}>
                  <CardHeader>
                    <CardTitle className="text-base font-mono">{r.name}</CardTitle>
                    <CardDescription>{r.stack}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{r.role}</CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
