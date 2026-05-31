import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Map,
  Mountain,
  Landmark,
  BookOpen,
  ScrollText,
  Users,
  Store,
  Calendar,
  Brain,
  Cpu,
  ShieldCheck,
  Trophy,
  Gamepad2,
  Gift,
  CreditCard,
  Home,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type NavSectionProps = {
  title: string;
  items: NavItem[];
};

const territoryItems: NavItem[] = [
  { title: "Mapa Vivo", url: "/mapa", icon: Map },
  { title: "Calles Históricas", url: "/calles", icon: Home },
  { title: "Minas", url: "/minas", icon: Mountain },
  { title: "Rutas", url: "/rutas", icon: Map },
];

const heritageItems: NavItem[] = [
  { title: "Atlas Histórico", url: "/atlas", icon: Landmark },
  { title: "Leyendas", url: "/leyendas", icon: ScrollText },
  { title: "Archivo Patrimonial", url: "/archivo", icon: BookOpen },
];

const communityItems: NavItem[] = [
  { title: "Directorio", url: "/directorio", icon: Store },
  { title: "Eventos", url: "/eventos", icon: Calendar },
  { title: "Comunidad", url: "/comunidad", icon: Users },
];

const intelligenceItems: NavItem[] = [
  { title: "Atlas Territorial", url: "/atlas-territorial", icon: Map },
  { title: "Nexus", url: "/nexus", icon: Cpu },
  { title: "Isabella AI", url: "/isabella", icon: Brain },
];

const governanceItems: NavItem[] = [
  { title: "Guardian", url: "/guardian", icon: ShieldCheck },
  { title: "Auditoría", url: "/auditoria", icon: ScrollText },
];

const gameItems: NavItem[] = [
  { title: "Juegos", url: "/juegos", icon: Gamepad2 },
  { title: "Logros", url: "/logros", icon: Trophy },
  { title: "Recompensas", url: "/recompensas", icon: Gift },
  { title: "Membresía", url: "/membresia", icon: CreditCard },
];

function NavSection({ title, items }: NavSectionProps) {
  const location = useLocation();
  const active = items.some((item) => location.pathname.startsWith(item.url));

  return (
    <Collapsible defaultOpen={active} className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="group flex w-full items-center justify-between">
            <span>{title}</span>
            <ChevronRight className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-90" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarMenu>
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isActive
                            ? "bg-primary/15 text-primary font-medium"
                            : "text-muted-foreground hover:bg-card hover:text-foreground",
                        ].join(" ")
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

export function SidebarTerritory() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/5 bg-background/80 backdrop-blur-xl"
    >
      <SidebarHeader>
        <div className="flex flex-col gap-1 px-2 py-4">
          <span className="heritage-text text-2xl text-gradient-gold">
            RDM Digital
          </span>
          <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
            Smart Town
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavSection title="Territorio" items={territoryItems} />
        <NavSection title="Patrimonio" items={heritageItems} />
        <NavSection title="Comunidad" items={communityItems} />
        <NavSection title="Inteligencia" items={intelligenceItems} />
        <NavSection title="Gobernanza" items={governanceItems} />
        <NavSection title="Juego" items={gameItems} />
      </SidebarContent>

      <SidebarFooter>
        <div className="mx-2 mb-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Nivel Territorial
          </div>

          <div className="mt-2 text-lg font-semibold">
            Habitante Digital
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-blue-500" />
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            12,480 XP
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
