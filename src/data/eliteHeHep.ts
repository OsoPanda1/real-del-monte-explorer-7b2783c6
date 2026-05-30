// Fusión: oso-data-weaver (kernel ELITE HeHep) + tamv-atlas-nextgen (backend federado)
// + rdm-digital-nodo-cero (frontend awakening). Fuente: github.com/OsoPanda1
// ORCID: 0009-0008-5050-1539

export type HeHexagonId = "HE-Ingest" | "HE-Transform" | "HE-Publish" | "HE-Science" | "HE-Economy" | "HE-Identity";
export type HepDomainId = "HEP-1" | "HEP-2" | "HEP-3" | "HEP-4" | "HEP-5" | "HEP-6" | "HEP-7";

export interface HeHexagon { id: HeHexagonId; name: string; role: string; eventPrefix: string; }
export interface HepDomain { id: HepDomainId; name: string; role: string; guardians: string[]; }

export const HE_HEXAGONS: HeHexagon[] = [
  { id: "HE-Ingest",    name: "Ingesta",         role: "Web, sensores, APIs, XR, logs y recepción de señales federadas.", eventPrefix: "INGEST" },
  { id: "HE-Transform", name: "Transformación",  role: "Filtrado de 4 capas, guardianes, normalización y enriquecimiento.", eventPrefix: "TRANSFORM" },
  { id: "HE-Publish",   name: "Publicación",     role: "Artefactos, contratos, eventos BookPI y publicación verificable.", eventPrefix: "PUBLISH" },
  { id: "HE-Science",   name: "Ciencia",         role: "Ciencia abierta, DOIs, ORCID, reproducibilidad y evidencia académica.", eventPrefix: "SCIENCE" },
  { id: "HE-Economy",   name: "Economía",        role: "Reputación, DAO, tokenomics, subastas y justicia económica.", eventPrefix: "ECONOMY" },
  { id: "HE-Identity",  name: "Identidad",       role: "Identidad soberana, IsabellaCoreProtocol, GoS, DIDs y ética.", eventPrefix: "IDENTITY" },
];

export const HEP_DOMAINS: HepDomain[] = [
  { id: "HEP-1", name: "Central",          role: "Kernel core, BookPI, contratos y router heptafederado.",                guardians: ["contract-governance", "bookpi-audit", "kernel-integrity"] },
  { id: "HEP-2", name: "Operaciones",      role: "Synapse AI, Encore Flow, Nexus y DreamSpaces runtime.",                 guardians: ["latency-budget", "workflow-safety", "operator-consent"] },
  { id: "HEP-3", name: "Infraestructura",  role: "Edge, XR rendering, HoloWall, NVLink/CXL y multinube.",                 guardians: ["resource-isolation", "deploy-observability", "edge-failover"] },
  { id: "HEP-4", name: "Seguridad",        role: "Dekateotl, guardianes, filtrado 4 capas, shutdown y cripto post-cuántica.", guardians: ["four-layer-filter", "shutdown-protocol", "pq-crypto-policy"] },
  { id: "HEP-5", name: "Financiera",       role: "Oracle Sentinel Economy, Ember Stream, AuraBid y BidVision.",           guardians: ["anti-extraction", "market-anomaly-detection", "reputation-audit"] },
  { id: "HEP-6", name: "Logística",        role: "Puentes Oníricos, rutas y distribución de experiencias DreamSpaces.",    guardians: ["distribution-consent", "custody-audit", "route-resilience"] },
  { id: "HEP-7", name: "Usuarios",         role: "IsabellaCoreProtocol, Quantum Pets, diario 24h y recomendaciones.",     guardians: ["privacy-by-design", "informed-consent", "identity-safety"] },
];

export interface IsabellaModule {
  module: string;
  hexagon: HeHexagonId;
  domain: HepDomainId;
  input: string;
  output: string;
  guardianPolicy: string[];
}

export const ISABELLA_MODULES: IsabellaModule[] = [
  { module: "Synapse AI",              hexagon: "HE-Ingest",    domain: "HEP-2", input: "métricas de latencia",     output: "offsets perceptivos",          guardianPolicy: ["latency-budget", "operator-consent"] },
  { module: "Encore Flow",             hexagon: "HE-Ingest",    domain: "HEP-2", input: "nivel de carga",            output: "políticas de interacción",     guardianPolicy: ["workflow-safety", "load-shedding"] },
  { module: "Echo Chamber AI",         hexagon: "HE-Transform", domain: "HEP-6", input: "actividad DreamSpace",      output: "ambientación y sugerencias",   guardianPolicy: ["context-isolation", "consent-filter"] },
  { module: "Phoenix Protocol",        hexagon: "HE-Transform", domain: "HEP-6", input: "estado NFT/DreamSpace",     output: "custodia, archivo o adopción", guardianPolicy: ["custody-audit", "archive-policy"] },
  { module: "AuraBid",                 hexagon: "HE-Economy",   domain: "HEP-5", input: "bids off-chain",            output: "commits on-chain",             guardianPolicy: ["anti-extraction", "market-audit"] },
  { module: "BidVision AI",            hexagon: "HE-Economy",   domain: "HEP-5", input: "contexto de oferta",        output: "impacto simulado",             guardianPolicy: ["simulation-disclosure", "reputation-audit"] },
  { module: "Spark Catalyst",          hexagon: "HE-Transform", domain: "HEP-7", input: "match colaboración",        output: "microtareas gamificadas",      guardianPolicy: ["user-consent", "fair-labor"] },
  { module: "Synergy Guard AI",        hexagon: "HE-Transform", domain: "HEP-5", input: "borrador de contrato",      output: "análisis de ambigüedad/riesgo", guardianPolicy: ["contract-ambiguity", "risk-disclosure"] },
  { module: "Oracle Sentinel Economy", hexagon: "HE-Economy",   domain: "HEP-5", input: "eventos de mercado",        output: "anomalías detectadas",         guardianPolicy: ["market-anomaly-detection", "dao-audit"] },
  { module: "Ember Stream",            hexagon: "HE-Economy",   domain: "HEP-5", input: "acciones creativas",        output: "eventos de consumo/burn",      guardianPolicy: ["token-safety", "creator-rights"] },
  { module: "Cognito Curator",         hexagon: "HE-Identity",  domain: "HEP-7", input: "estado de decisión usuario", output: "consejo de curación",         guardianPolicy: ["informed-consent", "recommendation-transparency"] },
  { module: "Horizon Seeker",          hexagon: "HE-Identity",  domain: "HEP-7", input: "perfil usuario",            output: "clusters emergentes sugeridos", guardianPolicy: ["privacy-by-design", "profile-minimization"] },
  { module: "Soul Sustainer",          hexagon: "HE-Identity",  domain: "HEP-7", input: "estado Quantum Pet",        output: "cambio de forma o guardianía", guardianPolicy: ["identity-safety", "emotional-safety"] },
  { module: "Chrysalis AI",            hexagon: "HE-Identity",  domain: "HEP-7", input: "progreso usuario/pet",      output: "nueva necesidad activa",       guardianPolicy: ["developmental-safety", "consent-renewal"] },
];

export const ELITE_HEHEP_MANIFEST = {
  project: "ELITE HeHep",
  fullName: "Ecosistema Latino Interfederado TAMV Enterprise - Hexagonal Heptafederado",
  doctrine: "MD-X4",
  kernels: ["TAMV Core Kernel", "OSO Data Weaver"],
  canonicalKernel: "OsoPanda1/oso-data-weaver",
  compatibility: ["OSO-compat", "tamv-federation-v1"],
  bookpi: { role: "Auditable event ledger for cross-domain TAMV actions.", requiredContext: "he_hep_context", integrity: "sha256" },
  ethics: {
    protocol: "IsabellaCoreProtocol",
    guardrails: ["human-dignity", "equity", "privacy", "informed-consent", "ethical-governance", "four-layer-filtering", "bookpi-audit-trail"],
  },
} as const;

// Endpoints reales documentados en tamv-atlas-nextgen
export const ATLAS_BACKEND_ENDPOINTS = [
  { method: "GET",  path: "/healthz",                  desc: "Salud del servicio" },
  { method: "GET",  path: "/v1/identity/*",            desc: "Identidad organizacional y DID" },
  { method: "GET",  path: "/v1/pids/status",           desc: "Estado PIDs (ORCID/Zenodo/ISNI)" },
  { method: "POST", path: "/v1/signature/sign",        desc: "Firma criptográfica de payloads" },
  { method: "POST", path: "/v1/signature/verify",      desc: "Verificación de firmas" },
  { method: "POST", path: "/v1/protocols/execute",     desc: "Ejecución de protocolos federados" },
  { method: "GET",  path: "/v1/economy/ledger",        desc: "Ledger económico Isabella" },
  { method: "POST", path: "/v1/xr/*",                  desc: "Stream XR y eventos hápticos" },
  { method: "GET",  path: "/v1/security/posture",      desc: "Postura de seguridad/antifragilidad" },
  { method: "GET",  path: "/api/public/manifest",      desc: "Manifiesto público + snapshot" },
  { method: "POST", path: "/api/github/webhook",       desc: "Receptor de webhooks GitHub" },
  { method: "GET",  path: "/api/github/events/stream", desc: "SSE de eventos federados" },
];

export const FUSED_REPOSITORIES = [
  { name: "rdm-digital-nodo-cero",  role: "Frontend Next.js del Despertar (manuscrito, mercado, Isabella, panel)", stack: "Next.js / React" },
  { name: "oso-data-weaver",        role: "Kernel ELITE HeHep · BookPI · federación tamv-federation-v1",          stack: "TypeScript / Node" },
  { name: "tamv-atlas-nextgen",     role: "Backend Atlas federado · identidad PQC · firmas · webhooks GitHub",     stack: "Node ESM / Vite" },
];
