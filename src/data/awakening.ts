// Fuente: github.com/OsoPanda1/documentacion-total-tamv-online
// Transcripción funcional del Manifiesto del Despertar y el mapa de repos.

export const ROOT_ARCHITECT = {
  name: "Edwin Oswaldo Castillo Trejo",
  alias: "Anubis Villaseñor",
  orcid: "0009-0008-5050-1539",
  doi: "10.5281/zenodo.19436662",
  hoursInvested: 22000,
  infrastructure: "MD-X4 Kernel · Heptafederado · TAMV Online Civilizational Stack",
};

export const AWAKENING_MANIFEST = `Edwin Oswaldo Castillo Trejo (Anubis Villaseñor), el mito que se convirtió en leyenda, hoy anuncia su despertar. Pasé miles de horas en silencio, soporté el silencio y el poco interés de las comunidades académico-tecnológicas y empresariales mexicanas. Pero ha llegado el momento de probar por qué soy la corona y la raíz del origen. Que inicie el despertar de un sueño.`;

export const POSITIONING_2026 = [
  "Operar como módulo dentro de un ecosistema heptafederado, con responsabilidades claras y contratos de integración explícitos.",
  "Priorizar estándares abiertos, seguridad por diseño y capacidad de auditoría por terceros.",
  "Mantener una narrativa pública coherente (papers, DOIs, documentación y código) que permite rastrear la evolución desde prototipo hasta infraestructura.",
];

export type RepoMap = {
  repo: string;
  role: string;
  stack: string;
};

export const OSOPANDA_REPO_MAP: RepoMap[] = [
  { repo: "tamv-unify-nexus", role: "Núcleo de orquestación y API Gateway", stack: "TypeScript" },
  { repo: "tamv-sentient-digital-nexus", role: "Cliente inmersivo (WebXR, UI, integraciones sensoriales)", stack: "TypeScript / WebXR" },
  { repo: "repo-docs-hub", role: "Documentación viva: manuales y demos de referencia", stack: "Markdown / Docs" },
  { repo: "genesis-digytamv-nexus", role: "Módulos base y librerías compartidas (core utilities, auth)", stack: "TypeScript" },
  { repo: "tamv-mdx4-nexus", role: "Ecosistema UI/portales y páginas públicas", stack: "TypeScript" },
  { repo: "astral-nexus-odyssey", role: "Pipelines de datos, batch jobs, modelos IA ligeros", stack: "Python / TS" },
  { repo: "finaltamv", role: "Artefactos de despliegue y datasets finales", stack: "Config / Release" },
  { repo: "tamv-nova-verse", role: "Microservicios especializados (render 4D, FX, integraciones)", stack: "TypeScript" },
  { repo: "TAMV-PLATAFORMA-", role: "Scripts/infra (automatizaciones, migraciones)", stack: "Python / Shell" },
  { repo: "tamv-online-network-oficial", role: "Red social inmersiva / servicios de interacción social", stack: "TypeScript" },
  { repo: "Repo-tamv-original-", role: "Scripts de despliegue iniciales", stack: "Shell" },
  { repo: "rdm-smart-city-os", role: "Sistema operativo territorial (Event Sourcing, PDOS)", stack: "TypeScript / SQL" },
  { repo: "documentacion-total-tamv-online", role: "Recopilación maestra del ecosistema TAMV", stack: "Docs" },
];

export const KNOWLEDGE_CELLS = [
  { name: "GlobalWall", desc: "Feed social con soporte multimedia avanzado (texto, imagen, audio, video y 3D)." },
  { name: "DreamSpaces", desc: "Entornos interactivos para experiencias inmersivas y creativas." },
  { name: "ISABELLA AI", desc: "Agente institucional empático: asistencia, accesibilidad y mediación ética." },
  { name: "Chats & Video", desc: "Comunicación en tiempo real con privacidad por diseño." },
  { name: "Media Ingestion", desc: "Flujo controlado para subir y curar activos multimedia." },
  { name: "KnowledgeCells", desc: "Microservicios testeable, desplegables y observables por separado." },
  { name: "Observabilidad", desc: "Métricas, trazas y SLOs para resiliencia y calidad de servicio." },
];

export const PRODUCTION_PRINCIPLES = [
  "Cada célula (microservicio) es independiente, versionada y desplegable por separado.",
  "APIs REST + gRPC, streaming por WebRTC/WebSocket.",
  "Observabilidad por defecto (trazas, métricas, logs).",
  "Seguridad por diseño: TLS everywhere, RBAC, SCA, hardening de imágenes.",
  "Resiliencia: circuit breakers, retries con backoff, timeouts, bulkheads.",
  "Infra declarativa: Kubernetes + Helm + IaC.",
  "CI/CD reproducible: builds en CI, tests automatizados, imágenes inmutables semánticas.",
];

export const DEPLOYMENT_TOPOLOGY = [
  { layer: "Edge", components: ["API Gateway (Traefik/Contour)", "Ingress TLS (cert-manager)", "Service Mesh opcional (Istio/Linkerd)"] },
  { layer: "Compute", components: ["Kubernetes ≥ 1.27 · 3 zonas", "Node pools CPU / GPU / Burst", "NVIDIA device plugin para render 4D"] },
  { layer: "Data", components: ["PostgreSQL HA (Patroni o managed)", "Redis caché/sesiones", "Object Storage S3-compatible"] },
  { layer: "Media & IA", components: ["WebRTC SFU (Mediasoup/Janus)", "Model serving (KServe/Triton)", "MLflow Model Registry"] },
  { layer: "Mensajería", components: ["Kafka / NATS / RabbitMQ"] },
  { layer: "Observabilidad", components: ["Prometheus + Grafana", "Loki + Tempo", "OpenTelemetry Collector"] },
  { layer: "Secretos", components: ["HashiCorp Vault", "External Secrets Operator"] },
  { layer: "GitOps", components: ["ArgoCD / Flux", "Cosign + Trivy"] },
];
