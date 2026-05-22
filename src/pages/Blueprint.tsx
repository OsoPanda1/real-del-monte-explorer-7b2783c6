import PageHero from "@/components/PageHero";
import { PRODUCTION_PRINCIPLES, DEPLOYMENT_TOPOLOGY } from "@/data/awakening";
import { CheckCircle2, Layers, ShieldCheck, GitBranch } from "lucide-react";

const checklists = {
  pre: [
    "Todos los tests (unit/integration/e2e) pasan.",
    "Scans SCA y de imágenes limpios (Trivy + Cosign).",
    "Backups recientes y verificados.",
    "Changelog y release notes actualizadas.",
    "Benchmarks de performance para la versión.",
    "Aprobación manual de security · product · infra.",
    "Plan canario y playbook de rollback listos.",
  ],
  post: [
    "Health checks en 1, 5 y 15 minutos.",
    "Métricas clave (p95/p99, error rate) en verde.",
    "Logs anómalos investigados.",
    "Smoke tests de render pipeline · WebRTC · auth.",
    "Feedback de QA y primeros usuarios.",
  ],
};

const Blueprint = () => (
  <div className="min-h-screen pb-24">
    <PageHero
      eyebrow="MANUAL DE PRODUCCIÓN · v1"
      title="Blueprint TAMV MD-X4"
      subtitle="Arquitectura, despliegue, observabilidad y runbooks para llevar el ecosistema a producción."
    />

    <div className="narrative-column space-y-16">
      {/* Principios */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl">Principios de diseño</h2>
        </div>
        <ul className="grid md:grid-cols-2 gap-3">
          {PRODUCTION_PRINCIPLES.map((p, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-border bg-card p-4 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Topología */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl">Topología de despliegue</h2>
        </div>
        <div className="space-y-3">
          {DEPLOYMENT_TOPOLOGY.map((layer) => (
            <div
              key={layer.layer}
              className="grid md:grid-cols-[160px_1fr] gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="font-display text-primary">{layer.layer}</div>
              <div className="flex flex-wrap gap-2">
                {layer.components.map((c) => (
                  <span
                    key={c}
                    className="text-xs px-2 py-1 rounded-md bg-muted text-foreground/80 font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CI/CD pipeline */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <GitBranch className="w-5 h-5 text-primary" />
          <h2 className="font-display text-2xl">Pipeline CI/CD</h2>
        </div>
        <ol className="space-y-2 text-sm">
          {[
            "lint → unit tests → typecheck",
            "build → bundle (prune devDeps)",
            "image build → push a registry (GHCR / ECR / Artifact Registry)",
            "integration/e2e en entorno ephemeral",
            "deploy a staging (Helm / ArgoCD)",
            "smoke tests → aprobación manual → producción (canary / blue-green)",
          ].map((step, i) => (
            <li
              key={i}
              className="flex gap-3 border-l-2 border-primary pl-4 py-1 text-foreground/90"
            >
              <span className="font-mono text-xs text-muted-foreground mt-0.5">
                0{i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Checklists */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-lg mb-4">Checklist pre-deploy</h3>
          <ul className="space-y-2 text-sm">
            {checklists.pre.map((c, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="font-display text-lg mb-4">Checklist post-deploy (0-24h)</h3>
          <ul className="space-y-2 text-sm">
            {checklists.post.map((c, i) => (
              <li key={i} className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Runbook ejemplo */}
      <section className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-display text-lg mb-4">
          Runbook · latencia alta en render 4D
        </h3>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-foreground/90">
          <li>Identificar pods con mayor CPU/GPU vía Prometheus/Grafana.</li>
          <li>Revisar traces en Tempo para el endpoint afectado.</li>
          <li>Escalar réplicas o mover cargas a node pool GPU adicional.</li>
          <li>Si persiste, desactivar features experimentales con feature flags.</li>
          <li>Rollback con Helm/ArgoCD promoviendo la imagen anterior.</li>
          <li>Registrar incidente y analizar causa raíz.</li>
        </ol>
      </section>
    </div>
  </div>
);

export default Blueprint;
