/**
 * Catálogo del ecosistema TAMV / OsoPanda1.
 * Basado en el análisis del perfil github.com/OsoPanda1
 * (TAMV ONLINE NETWORK · CEO Edwin O. Castillo Trejo · ORCID 0009-0008-5050-1539).
 */

export type RepoCategory =
  | "rdm-smart-city"
  | "tamv-core"
  | "academic"
  | "documentation"
  | "infrastructure"
  | "experimental";

export interface RepoEntry {
  name: string;
  url: string;
  description: string;
  language?: string;
  category: RepoCategory;
  highlight?: boolean;
}

export interface CategoryMeta {
  id: RepoCategory;
  title: string;
  subtitle: string;
  glyph: string;
}

export const categories: CategoryMeta[] = [
  {
    id: "rdm-smart-city",
    title: "RDM Smart City",
    subtitle: "Soberanía digital del nodo Real del Monte",
    glyph: "I",
  },
  {
    id: "tamv-core",
    title: "TAMV Core",
    subtitle: "Núcleo civilizatorio · XR · IA Isabella",
    glyph: "II",
  },
  {
    id: "academic",
    title: "UTAMV Académico",
    subtitle: "Universidad y formación NextGen",
    glyph: "III",
  },
  {
    id: "documentation",
    title: "Documentación",
    subtitle: "Manifiestos, dossiers y blindaje",
    glyph: "IV",
  },
  {
    id: "infrastructure",
    title: "Infraestructura",
    subtitle: "Blockchain, mensajería y herramientas",
    glyph: "V",
  },
  {
    id: "experimental",
    title: "Laboratorio",
    subtitle: "Forks, prototipos y exploración",
    glyph: "VI",
  },
];

export const repos: RepoEntry[] = [
  // RDM Smart City
  {
    name: "real-del-monte-explorer",
    url: "https://github.com/OsoPanda1/real-del-monte-explorer",
    description: "Plataforma narrativa del pueblo mágico — esta misma obra.",
    language: "TypeScript",
    category: "rdm-smart-city",
    highlight: true,
  },
  {
    name: "rdm-smart-city-os",
    url: "https://github.com/OsoPanda1/rdm-smart-city-os",
    description: "Sistema operativo de ciudad inteligente para Real del Monte.",
    language: "HTML",
    category: "rdm-smart-city",
    highlight: true,
  },
  {
    name: "real-del-monte-twin",
    url: "https://github.com/OsoPanda1/real-del-monte-twin",
    description: "Gemelo digital del territorio mineral.",
    language: "TypeScript",
    category: "rdm-smart-city",
  },
  {
    name: "RDM-Digital-X",
    url: "https://github.com/OsoPanda1/RDM-Digital-X",
    description: "Capa experimental de servicios digitales del nodo RDM.",
    language: "TypeScript",
    category: "rdm-smart-city",
  },
  {
    name: "real-del-monte-elevated",
    url: "https://github.com/OsoPanda1/real-del-monte-elevated",
    description: "Iteración estética elevada de la plataforma RDM.",
    language: "TypeScript",
    category: "rdm-smart-city",
  },

  // TAMV Core
  {
    name: "ECOSISTEMA-TAMVONLINE",
    url: "https://github.com/OsoPanda1/ECOSISTEMA-TAMVONLINE",
    description: "Ecosistema pionero inmersivo y sensorial 4D a nivel mundial.",
    language: "TypeScript",
    category: "tamv-core",
    highlight: true,
  },
  {
    name: "ecosistema-nextgen-tamv",
    url: "https://github.com/OsoPanda1/ecosistema-nextgen-tamv",
    description: "Ecosistema civilizatorio anti-frágil XR-VR-3D-4D nativo.",
    language: "JavaScript",
    category: "tamv-core",
    highlight: true,
  },
  {
    name: "TAMV-ONLINE-NEXTGEN-1.0",
    url: "https://github.com/OsoPanda1/TAMV-ONLINE-NEXTGEN-1.0",
    description: "Conoce el mundo de Anubis Villaseñor.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "metaverso-latino-tamv-online",
    url: "https://github.com/OsoPanda1/metaverso-latino-tamv-online",
    description: "Plataforma AI metaverso pionera en LATAM, 100% auditada.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-digital-nexus",
    url: "https://github.com/OsoPanda1/tamv-digital-nexus",
    description: "Núcleo de orquestación digital TAMV.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-nexus-verse",
    url: "https://github.com/OsoPanda1/tamv-nexus-verse",
    description: "Vertiente verse del nexus TAMV.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-sentient-digital-nexus",
    url: "https://github.com/OsoPanda1/tamv-sentient-digital-nexus",
    description: "Capa sintiente del nexus digital.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-sovereign-hub",
    url: "https://github.com/OsoPanda1/tamv-sovereign-hub",
    description: "Hub soberano de servicios y federación.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-orchestrator",
    url: "https://github.com/OsoPanda1/tamv-orchestrator",
    description: "Orquestador de microservicios TAMV.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-horizon",
    url: "https://github.com/OsoPanda1/tamv-horizon",
    description: "Horizonte estratégico de la plataforma.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-civilized",
    url: "https://github.com/OsoPanda1/tamv-civilized",
    description: "Capa civilizatoria de la red TAMV.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamv-universe-online",
    url: "https://github.com/OsoPanda1/tamv-universe-online",
    description: "Universo digital persistente TAMV.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "tamvonline-metanextgen",
    url: "https://github.com/OsoPanda1/tamvonline-metanextgen",
    description: "Iteración meta-nextgen del ecosistema.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "federacion-tamv",
    url: "https://github.com/OsoPanda1/federacion-tamv",
    description: "Núcleo de federación de identidades y servicios.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "omniverse-hub",
    url: "https://github.com/OsoPanda1/omniverse-hub",
    description: "Hub omniverso para experiencias cruzadas.",
    language: "TypeScript",
    category: "tamv-core",
  },
  {
    name: "multiverso-tamvonline",
    url: "https://github.com/OsoPanda1/multiverso-tamvonline",
    description: "Innovación tecnológica mexicana — multiverso.",
    language: "TypeScript",
    category: "tamv-core",
  },

  // Académico
  {
    name: "utamv-academic-core",
    url: "https://github.com/OsoPanda1/utamv-academic-core",
    description: "Núcleo académico UTAMV (Universidad de Tecnología Avanzada, Marketing y Versatilidad).",
    language: "TypeScript",
    category: "academic",
    highlight: true,
  },
  {
    name: "utamv-elite-masterclass",
    url: "https://github.com/OsoPanda1/utamv-elite-masterclass",
    description: "Masterclass de élite UTAMV.",
    language: "TypeScript",
    category: "academic",
  },
  {
    name: "access-academy",
    url: "https://github.com/OsoPanda1/access-academy",
    description: "Plataforma de acceso a la academia.",
    language: "TypeScript",
    category: "academic",
  },

  // Documentación
  {
    name: "documentacion-total-tamv-online",
    url: "https://github.com/OsoPanda1/documentacion-total-tamv-online",
    description: "Recopilación completa del sistema TAMV.",
    category: "documentation",
    highlight: true,
  },
  {
    name: "DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI",
    url: "https://github.com/OsoPanda1/DOCUMENTACION-TAMV-DM-X4-e-ISABELLA-AI",
    description: "Metaverso 4D con IA Isabella autoconsciente.",
    language: "HTML",
    category: "documentation",
  },
  {
    name: "repo-docs-hub",
    url: "https://github.com/OsoPanda1/repo-docs-hub",
    description: "Documentación TAMV MD-X4.",
    language: "TypeScript",
    category: "documentation",
  },
  {
    name: "datostamv",
    url: "https://github.com/OsoPanda1/datostamv",
    description: "Archivos y datasets TAMV.",
    category: "documentation",
  },
  {
    name: "new-beginnings",
    url: "https://github.com/OsoPanda1/new-beginnings",
    description: "Proyecto Anubis Villaseñor — blindaje jurídico-legal internacional.",
    language: "TypeScript",
    category: "documentation",
  },
  {
    name: "NEWTAMVGENESIS",
    url: "https://github.com/OsoPanda1/NEWTAMVGENESIS",
    description: "Génesis evolutiva del ecosistema.",
    language: "TypeScript",
    category: "documentation",
  },
  {
    name: "genesis-digytamv-nexus",
    url: "https://github.com/OsoPanda1/genesis-digytamv-nexus",
    description: "Génesis digital del nexus TAMV.",
    language: "TypeScript",
    category: "documentation",
  },

  // Infraestructura
  {
    name: "quantum-system-tamv",
    url: "https://github.com/OsoPanda1/quantum-system-tamv",
    description: "Tecnología cuántica para el TAMV.",
    language: "Shell",
    category: "infrastructure",
    highlight: true,
  },
  {
    name: "ton-grpc",
    url: "https://github.com/OsoPanda1/ton-grpc",
    description: "Bindings Rust para The Open Network (fork getgems-io).",
    language: "Rust",
    category: "infrastructure",
  },
  {
    name: "ton",
    url: "https://github.com/OsoPanda1/ton",
    description: "TON community core (fork).",
    language: "TypeScript",
    category: "infrastructure",
  },
  {
    name: "minter-contract",
    url: "https://github.com/OsoPanda1/minter-contract",
    description: "Smart contracts FunC para minter Jetton.",
    language: "TypeScript",
    category: "infrastructure",
  },
  {
    name: "twa-template",
    url: "https://github.com/OsoPanda1/twa-template",
    description: "Boilerplate Telegram Web App + TON.",
    language: "TypeScript",
    category: "infrastructure",
  },
  {
    name: "Anubisgram",
    url: "https://github.com/OsoPanda1/Anubisgram",
    description: "Telegram Android customizado (fork DrKLO).",
    language: "Java",
    category: "infrastructure",
  },
  {
    name: "Thanubis-Userbot",
    url: "https://github.com/OsoPanda1/Thanubis-Userbot",
    description: "Bot Telegram administrativo.",
    language: "Python",
    category: "infrastructure",
  },
  {
    name: "GitGram",
    url: "https://github.com/OsoPanda1/GitGram",
    description: "Integración GitHub ↔ Telegram (fork).",
    language: "Python",
    category: "infrastructure",
  },
  {
    name: "RSSHub",
    url: "https://github.com/OsoPanda1/RSSHub",
    description: "Todo es RSSible (fork DIYgod).",
    language: "JavaScript",
    category: "infrastructure",
  },
  {
    name: "aws-toolkit-vscode",
    url: "https://github.com/OsoPanda1/aws-toolkit-vscode",
    description: "Toolkit AWS para VSCode (fork).",
    language: "TypeScript",
    category: "infrastructure",
  },

  // Laboratorio / experimental
  {
    name: "OsoPanda1",
    url: "https://github.com/OsoPanda1/OsoPanda1",
    description: "Profile repo: tamv online my dream.",
    language: "Python",
    category: "experimental",
    highlight: true,
  },
  {
    name: "alamexa-design-system",
    url: "https://github.com/OsoPanda1/alamexa-design-system",
    description: "Design system Alamexa.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "citemesh-roots",
    url: "https://github.com/OsoPanda1/citemesh-roots",
    description: "Raíces del proyecto Citemesh.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "digital-civilization-core",
    url: "https://github.com/OsoPanda1/digital-civilization-core",
    description: "Núcleo de civilización digital.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "sovereign-union",
    url: "https://github.com/OsoPanda1/sovereign-union",
    description: "Unión soberana de servicios federados.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "web-4.0-genesis",
    url: "https://github.com/OsoPanda1/web-4.0-genesis",
    description: "Génesis Web 4.0.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "dream-weaver",
    url: "https://github.com/OsoPanda1/dream-weaver",
    description: "Tejedor de DreamSpaces.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "ragbot-starter",
    url: "https://github.com/OsoPanda1/ragbot-starter",
    description: "Starter RAG bot.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "unify-nexus-deployment",
    url: "https://github.com/OsoPanda1/unify-nexus-deployment",
    description: "Despliegue unificado del nexus.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "proyecto-central",
    url: "https://github.com/OsoPanda1/proyecto-central",
    description: "Proyecto central de coordinación.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "tamvweb",
    url: "https://github.com/OsoPanda1/tamvweb",
    description: "Sitio web TAMV.",
    language: "TypeScript",
    category: "experimental",
  },
  {
    name: "tamvonline",
    url: "https://github.com/OsoPanda1/tamvonline",
    description: "TAMV online raíz.",
    language: "TypeScript",
    category: "experimental",
  },
];

/* === Núcleos Heptafederados === */

export interface HeptaNucleus {
  id: string;
  name: string;
  domain: string;
  resistance: number; // %
  status: "operativo" | "vigilancia" | "óptimo";
  description: string;
}

export const heptaNuclei: HeptaNucleus[] = [
  {
    id: "dekateotl",
    name: "Dekateotl",
    domain: "Gobernanza Ética · XAI",
    resistance: 99.8,
    status: "óptimo",
    description: "IA explicable que arbitra políticas y publica trimestralmente sus decisiones.",
  },
  {
    id: "anubis",
    name: "Anubis Sentinel",
    domain: "Seguridad Post-Cuántica · IAM",
    resistance: 100,
    status: "óptimo",
    description: "Guardián de identidad con MFA, rotación de claves a 90 días y postura PQ.",
  },
  {
    id: "bookpi",
    name: "BookPI / DataGit",
    domain: "Inmutabilidad · Auditoría",
    resistance: 99.9,
    status: "óptimo",
    description: "Ledger inmutable con sellado SHA-256 y verificación Merkle de toda evidencia.",
  },
  {
    id: "phoenix",
    name: "Phoenix Protocol",
    domain: "Resiliencia P2P",
    resistance: 99.6,
    status: "operativo",
    description: "Tolera la pérdida simultánea de hasta el 33% de los nodos sin pérdida de sesión.",
  },
  {
    id: "mdd-tamv",
    name: "MDD / TAMV Credits",
    domain: "Economía Creativa",
    resistance: 100,
    status: "óptimo",
    description: "Modelo 20/30/50 con auditoría pública mensual de la economía creativa local.",
  },
  {
    id: "kaos",
    name: "KAOS",
    domain: "XR · Sensorialidad",
    resistance: 99.4,
    status: "vigilancia",
    description: "Capa inmersiva 3D/4D con cumplimiento WCAG 2.2 AA.",
  },
  {
    id: "chronos",
    name: "Chronos Planning",
    domain: "Gestión de Rutas",
    resistance: 99.7,
    status: "operativo",
    description: "Coordina rutas turísticas, mineras y logísticas del territorio.",
  },
];

export const ecosystemMeta = {
  author: "Edwin Oswaldo Castillo Trejo",
  alias: "Anubis Villaseñor",
  orcid: "0009-0008-5050-1539",
  org: "TAMV Online Network",
  hq: "Real del Monte (Mineral del Monte), Hidalgo, México",
  profile: "https://github.com/OsoPanda1",
  motto: "Volvió la elite — Pioneros en tecnología latinoamericana.",
};
