// src/components/navigation/sidebar/SidebarSection.tsx

import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

export function SidebarSection({
  title,
  items,
  defaultOpen,
}: SidebarSectionProps) {
  const location = useLocation();

  const active = items.some((item) =>
    location.pathname.startsWith(item.url)
  );

  const shouldOpen = defaultOpen ?? active;

  return (
    <Collapsible defaultOpen={shouldOpen} className="group/section">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger
            className="group flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Alternar sección ${title}`}
          >
            <span className="tracking-wide">{title}</span>
            <ChevronRight
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-90"
              aria-hidden="true"
            />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarMenu>
            {items.map((item) => {
              const Icon = item.icon;
              const isDisabled = item.disabled ?? false;

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild disabled={isDisabled}>
                    <NavLink
                      to={item.url}
                      end
                      aria-disabled={isDisabled}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                          isActive
                            ? "bg-primary/15 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                          isDisabled &&
                            "pointer-events-none opacity-50 cursor-not-allowed"
                        )
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 min-w-[20px] rounded-full px-1.5 text-[10px] font-semibold"
                        >
                          {item.badge}
                        </Badge>
                      )}
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
