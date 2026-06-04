import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import TopSearch from "@/components/TopSearch";
import NotificationsBell from "@/components/NotificationsBell";
import { useCoins } from "@/hooks/useCoins";
import { useMembership } from "@/hooks/useMembership";
import { Coins, Crown, Mountain, Sparkles } from "lucide-react";

function FogLayer() {
  return (
    <div aria-hidden className="fog-layer pointer-events-none fixed inset-x-0 top-1/3 z-0" />
  );
}

function BrandMark() {
  return (
    <Link to="/" className="hidden md:flex items-center gap-2.5 pr-4 mr-2 border-r border-white/8">
      <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-rdm-gold via-rdm-copper to-rdm-amber flex items-center justify-center shadow-[0_0_20px_-4px_hsl(var(--rdm-gold)/0.6)]">
        <Mountain className="w-4 h-4 text-rdm-night" />
        <span className="absolute -inset-px rounded-lg ring-1 ring-rdm-gold/40 animate-pulse" />
      </div>
      <div className="leading-tight">
        <div className="font-heritage text-[13px] text-rdm-platinum tracking-wide">RDM · Digital</div>
        <div className="text-[9px] uppercase tracking-[0.32em] text-rdm-gold/70">Territorio inteligente</div>
      </div>
    </Link>
  );
}

function HeaderStatus() {
  const { balance } = useCoins();
  const { isActive } = useMembership();
  return (
    <div className="flex items-center gap-2">
      <Link to="/recompensas" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rdm-gold/10 border border-rdm-gold/25 text-rdm-gold text-xs font-semibold hover:bg-rdm-gold/20 transition-colors">
        <Coins className="h-3.5 w-3.5" />
        <span>{balance}</span>
      </Link>
      <Link to="/membresia" className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
        isActive
          ? "bg-rdm-pine/20 border-rdm-pine/40 text-rdm-warm hover:bg-rdm-pine/30"
          : "bg-gradient-to-r from-rdm-gold/15 to-rdm-copper/15 border-rdm-gold/30 text-rdm-gold hover:border-rdm-gold/60"
      }`}>
        <Crown className="h-3.5 w-3.5" />
        <span>{isActive ? "Habitante" : "Activar"}</span>
      </Link>
    </div>
  );
}

function HeptaBar() {
  // Subtle live-pulse strip referencing the 7-domain federation
  return (
    <div aria-hidden className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-rdm-gold/50 to-transparent" />
  );
}

export default function TerritoryShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-rdm-night via-rdm-carbon to-rdm-stone relative">
        <FogLayer />
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Ultra-thin status rail */}
          <div className="h-6 bg-rdm-night/90 border-b border-white/5 flex items-center px-4 text-[10px] font-mono uppercase tracking-[0.28em] text-rdm-fog/45 backdrop-blur-xl">
            <span className="text-rdm-gold/80">●</span>
            <span className="ml-2">TAMV · HeHep Kernel</span>
            <span className="mx-3 text-rdm-fog/20">/</span>
            <span className="hidden sm:inline">Real del Monte · 2,700 msnm</span>
            <span className="ml-auto hidden md:inline text-rdm-fog/40">
              <Sparkles className="inline h-2.5 w-2.5 mr-1 text-rdm-gold/70" />
              Sovereign Gold Edition
            </span>
          </div>

          {/* Main header — top-anchored, sticky, sophisticated */}
          <header className="sticky top-0 z-40 h-16 flex items-center gap-3 px-3 sm:px-5 border-b border-white/10 bg-rdm-night/85 backdrop-blur-2xl relative">
            <SidebarTrigger className="text-rdm-fog hover:text-rdm-gold transition-colors" />
            <BrandMark />
            <div className="flex-1 max-w-2xl">
              <TopSearch />
            </div>
            <HeaderStatus />
            <NotificationsBell />
            <HeptaBar />
          </header>

          <main id="main-content" className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
