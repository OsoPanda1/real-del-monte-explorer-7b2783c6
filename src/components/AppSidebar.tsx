import { useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Mountain, Map, Route, Cross, MapPin, BookOpen, BookMarked, FileText,
  Users, Calendar, UtensilsCrossed, Plus, Network, Hexagon, Bot, Terminal, Radio,
  Shield, Eye, Globe, Trophy, Gamepad2, Gift, Crown, Home, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { title: string; url: string; icon: React.ElementType };
type Group = { id: string; label: string; items: Item[] };

const GROUPS: Group[] = [
  { id: "inicio", label: "Inicio", items: [
    { title: "Portal", url: "/", icon: Home },
    { title: "Mapa", url: "/mapa", icon: Map },
  ]},
  { id: "territorio", label: "Territorio", items: [
    { title: "Calles", url: "/calles", icon: MapPin },
    { title: "Rutas", url: "/rutas", icon: Route },
    { title: "Minas", url: "/minas", icon: Mountain },
    { title: "Cementerio Inglés", url: "/cementerio", icon: Cross },
    { title: "Eventos", url: "/eventos", icon: Calendar },
  ]},
  { id: "patrimonio", label: "Patrimonio", items: [
    { title: "Leyendas", url: "/leyendas", icon: BookOpen },
    { title: "Manifiesto", url: "/manifiesto", icon: FileText },
    { title: "Blueprint", url: "/blueprint", icon: BookMarked },
    { title: "Pastes", url: "/pastes", icon: UtensilsCrossed },
  ]},
  { id: "comunidad", label: "Comunidad", items: [
    { title: "Directorio", url: "/directorio", icon: Users },
    { title: "Nuevo comercio", url: "/comercios/nuevo", icon: Plus },
    { title: "Ecosistema", url: "/ecosistema", icon: Sparkles },
  ]},
  { id: "inteligencia", label: "Inteligencia", items: [
    { title: "Atlas", url: "/atlas", icon: Globe },
    { title: "Nexus ELITE", url: "/nexus", icon: Hexagon },
    { title: "Isabella", url: "/isabella", icon: Bot },
    { title: "PDOS Core", url: "/pdos-core", icon: Terminal },
    { title: "DM-X7", url: "/dm-x7", icon: Radio },
    { title: "Plataforma", url: "/plataforma", icon: Network },
  ]},
  { id: "gobernanza", label: "Gobernanza", items: [
    { title: "Nodo Cero", url: "/nodo-cero", icon: Eye },
    { title: "Guardian", url: "/guardian", icon: Shield },
    { title: "Auditoría", url: "/auditoria", icon: FileText },
    { title: "Federaciones", url: "/federaciones", icon: Network },
    { title: "Propuesta", url: "/propuesta", icon: FileText },
  ]},
  { id: "juego", label: "Juego & Recompensas", items: [
    { title: "Juegos", url: "/juegos", icon: Gamepad2 },
    { title: "Recompensas", url: "/recompensas", icon: Gift },
    { title: "Logros", url: "/logros", icon: Trophy },
    { title: "Membresía", url: "/membresia", icon: Crown },
  ]},
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const initialOpen = useMemo(() => {
    const out: Record<string, boolean> = {};
    GROUPS.forEach(g => { out[g.id] = g.items.some(i => pathname === i.url || pathname.startsWith(i.url + "/")); });
    out.inicio = true;
    return out;
  }, [pathname]);

  const [open, setOpen] = useState(initialOpen);

  return (
    <Sidebar collapsible="icon" className="border-r border-white/8 bg-gradient-to-b from-rdm-night to-rdm-carbon">
      <SidebarHeader className="px-4 py-5 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rdm-gold to-rdm-copper flex items-center justify-center shadow-invitation">
            <Mountain className="w-4 h-4 text-rdm-night" />
          </div>
          {!collapsed && (
            <div>
              <div className="font-heritage text-sm text-rdm-platinum leading-tight">RDM Digital</div>
              <div className="text-[10px] text-rdm-fog/60 uppercase tracking-widest">Territorio vivo</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        {GROUPS.map(group => (
          <Collapsible
            key={group.id}
            open={collapsed ? true : open[group.id]}
            onOpenChange={(o) => !collapsed && setOpen(s => ({ ...s, [group.id]: o }))}
          >
            <SidebarGroup>
              {!collapsed && (
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer flex items-center justify-between px-2 py-1.5 hover:text-rdm-gold transition-colors text-[11px] uppercase tracking-[0.18em] text-rdm-fog/55">
                    <span>{group.label}</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", open[group.id] && "rotate-180")} />
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
              )}
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map(item => {
                      const active = pathname === item.url;
                      const Icon = item.icon;
                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild isActive={active}>
                            <NavLink to={item.url} className={cn(
                              "flex items-center gap-2.5 rounded-md transition-all duration-200",
                              active
                                ? "bg-gradient-to-r from-rdm-gold/15 to-transparent text-rdm-gold border-l-2 border-rdm-gold"
                                : "text-rdm-fog/75 hover:text-rdm-platinum hover:bg-white/5"
                            )}>
                              <Icon className="h-4 w-4 shrink-0" />
                              {!collapsed && <span className="text-sm">{item.title}</span>}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
