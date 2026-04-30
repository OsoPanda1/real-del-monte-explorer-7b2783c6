export type ReadinessStatus = "backlog" | "in_progress" | "done";

export interface ReadinessTask {
  id: string;
  title: string;
  status: ReadinessStatus;
  owner: "security" | "platform" | "product" | "ops" | "governance";
  milestone: "stage" | "production";
}

export interface ReadinessDomain {
  id: string;
  label: string;
  description: string;
  tasks: ReadinessTask[];
}

export const readinessDomains: ReadinessDomain[] = [
  {
    id: "infra-security",
    label: "Infraestructura y seguridad",
    description: "RLS, secretos, observabilidad y topología multi-entorno.",
    tasks: [
      { id: "rls-audit", title: "Auditoría externa de RLS por tabla", status: "in_progress", owner: "security", milestone: "production" },
      { id: "secrets-rotation", title: "Vault + rotación de tokens", status: "in_progress", owner: "security", milestone: "production" },
      { id: "edge-observability", title: "Logs + métricas + alertas en edge functions", status: "in_progress", owner: "platform", milestone: "stage" },
      { id: "topology", title: "Topología final dev/stage/prod con TLS", status: "backlog", owner: "platform", milestone: "stage" },
    ],
  },
  {
    id: "product-ux",
    label: "Producto TAMV OS",
    description: "Onboarding ciudadano, Atlas y Guardian listos para operación.",
    tasks: [
      { id: "onboarding", title: "Onboarding ciudadano (registro/verificación/roles)", status: "done", owner: "product", milestone: "stage" },
      { id: "atlas-ui", title: "Atlas con paneles operativos", status: "done", owner: "product", milestone: "stage" },
      { id: "guardian-ui", title: "Guardian con cola, historial y filtros", status: "done", owner: "product", milestone: "stage" },
      { id: "dmx7-v1", title: "Subset público DM-X7 versión 1.0", status: "done", owner: "platform", milestone: "production" },
    ],
  },
  {
    id: "kernel-ai",
    label: "Kernel + Isabella IA",
    description: "Event sourcing, decisiones explicables y knowledge graph.",
    tasks: [
      { id: "event-store", title: "Event Store append-only con versionado", status: "done", owner: "platform", milestone: "stage" },
      { id: "isabella-xai", title: "Decision Engine con explainability", status: "done", owner: "platform", milestone: "stage" },
      { id: "knowledge-graph", title: "Knowledge graph PDOS sembrado", status: "done", owner: "platform", milestone: "stage" },
      { id: "kafka-bridge", title: "Bridge real-time a Kafka", status: "backlog", owner: "platform", milestone: "production" },
    ],
  },
  {
    id: "ops-governance",
    label: "Operación y gobernanza",
    description: "Runbooks, incidentes y trazabilidad económica Fénix 75/25.",
    tasks: [
      { id: "runbooks", title: "Runbooks de operación diaria", status: "in_progress", owner: "ops", milestone: "stage" },
      { id: "fenix-7525", title: "Distribución Fénix 75/25 en Cattleya", status: "in_progress", owner: "governance", milestone: "production" },
      { id: "legal-operational", title: "Políticas ejecutables (legal/economía)", status: "backlog", owner: "governance", milestone: "production" },
      { id: "release-protocol", title: "Protocolo de actualización MD-X4", status: "in_progress", owner: "ops", milestone: "stage" },
    ],
  },
];

const statusWeight: Record<ReadinessStatus, number> = { backlog: 0, in_progress: 0.5, done: 1 };

export function getReadinessProgress(domains: ReadinessDomain[]): number {
  const tasks = domains.flatMap((d) => d.tasks);
  if (!tasks.length) return 0;
  const score = tasks.reduce((a, t) => a + statusWeight[t.status], 0);
  return Math.round((score / tasks.length) * 100);
}

export function getMilestoneProgress(domains: ReadinessDomain[], milestone: "stage" | "production"): number {
  const tasks = domains.flatMap((d) => d.tasks).filter((t) => t.milestone === milestone);
  if (!tasks.length) return 0;
  const score = tasks.reduce((a, t) => a + statusWeight[t.status], 0);
  return Math.round((score / tasks.length) * 100);
}
