// src/layouts/TerritoryShell.tsx

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  ChevronRight,
  Coins,
  Search,
  Shield,
  Sparkles,
  Wallet,
} from "lucide-react";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { SidebarTerritory } from "@/components/navigation/SidebarTerritory";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { cn } from "@/lib/utils";

const shellNav = [
  "Territorio",
  "Patrimonio",
  "Comunidad",
  "Inteligencia",
  "Gobernanza",
  "Juego",
];

const shellMetrics = [
  { label: "Nivel territorial", value: "Lv.12", meta: "72% progreso" },
  { label: "RDM Coins", value: "12,480", meta: "+320 hoy" },
  { label: "Recompensas", value: "8 activas", meta: "3 por reclamar" },
  { label: "Membresía", value: "Habitante Digital", meta: "vence en 28 días" },
  { label: "Estado", value: "Operativo", meta: "latencia baja" },
  { label: "Seguridad", value: "Fortalecida", meta: "2FA + políticas" },
];

export default function TerritoryShell() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const pathLabel =
    location.pathname.split("/").filter(Boolean).slice(-1)[0] ?? "Inicio";

  return (
    <SidebarProvider defaultOpen>
      <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(212,178,106,0.08),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_30%)]" />

          <motion.div
            className="absolute inset-0"
            animate={
              prefersReducedMotion
                ? {}
                : { x: [-18, 18, -18], y: [0, -10, 0] }
            }
            transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.04),transparent_35%)] blur-3xl" />
          </motion.div>

          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/textures/noise.png')]" />
        </div>

        <SidebarTerritory />

        <SidebarInset className="relative z-10 flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-20 items-center gap-3 px-4 lg:px-8">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger className="shrink-0" />
                <Separator orientation="vertical" className="h-6" />
                <div className="flex flex-col leading-none">
                  <span className="heritage-text text-sm text-gradient-gold">RDM Digital</span>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Territory OS
                  </span>
                </div>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <SidebarTrigger className="shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="heritage-text text-lg text-gradient-gold">RDM Digital</span>
                  <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                    Smart Town / Territory OS
                  </span>
                </div>
              </div>

              <div className="hidden xl:flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-[720px]">
                  <GlobalSearch />
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden sm:inline-flex rounded-full border border-border/60 bg-card/40 hover:bg-card/70"
                  aria-label="Búsqueda global"
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full border border-border/60 bg-card/40 hover:bg-card/70"
                  aria-label="Notificaciones"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>

                <div className="hidden min-[1100px]:flex items-center gap-3 rounded-full border border-border/60 bg-card/40 px-3 py-2 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 text-xs font-bold text-black">
                    EO
                  </div>
                  <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-medium">Edwin Castillo</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Constructor Territorial
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 px-4 py-3 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {shellNav.map((item, index) => (
                  <React.Fragment key={item}>
                    <span
                      className={cn(
                        "transition-colors",
                        index === 0 && "text-foreground"
                      )}
                    >
                      {item}
                    </span>
                    {index < shellNav.length - 1 && <span>/</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </header>

          <div className="border-b border-white/5 bg-background/40 px-4 py-3 lg:px-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  <span>Real del Monte</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="truncate">{pathLabel}</span>
                </div>
                <h1 className="mt-1 text-base font-medium md:text-lg">
                  Sistema Operativo Territorial
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-200"
                >
                  <Shield className="h-3 w-3" />
                  Seguro
                </Badge>
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-200"
                >
                  <Wallet className="h-3 w-3" />
                  Wallet
                </Badge>
                <Badge
                  variant="secondary"
                  className="gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                >
                  <Coins className="h-3 w-3" />
                  XP activo
                </Badge>
              </div>
            </div>
          </div>

          <main className="relative flex-1">
            <div className="mx-auto w-full max-w-[1800px] px-4 py-5 lg:px-8 lg:py-6">
              <div className="mb-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
                {shellMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-border/60 bg-card/50 p-4 backdrop-blur-md shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        {metric.label}
                      </p>
                      <Sparkles className="h-4 w-4 text-yellow-400/80" />
                    </div>
                    <div className="mt-3">
                      <p className="text-lg font-semibold leading-none">{metric.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{metric.meta}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Outlet />
            </div>
          </main>

          <footer className="border-t border-white/5 px-4 py-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="heritage-text text-xl text-gradient-gold">RDM Digital</div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Nodo Cero del Ecosistema TAMV Online. Patrimonio, comunidad,
                  tecnología y gobernanza en una sola experiencia.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-md">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/eo.png" alt="Perfil de usuario" />
                  <AvatarFallback>EO</AvatarFallback>
                </Avatar>
                <div className="leading-tight">
                  <p className="text-sm font-medium">Edwin Castillo</p>
                  <p className="text-xs text-muted-foreground">
                    Sesión protegida • 2FA activo
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
