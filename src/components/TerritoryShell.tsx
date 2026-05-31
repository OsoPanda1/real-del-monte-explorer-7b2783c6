import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import TopSearch from "@/components/TopSearch";
import NotificationsBell from "@/components/NotificationsBell";
import { useCoins } from "@/hooks/useCoins";
import { useMembership } from "@/hooks/useMembership";
import { Coins, Crown } from "lucide-react";

function FogLayer() {
  return (
    <div aria-hidden className="fog-layer pointer-events-none fixed inset-x-0 top-1/3 z-0" />
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
          : "bg-white/5 border-white/15 text-rdm-fog/70 hover:text-rdm-gold hover:border-rdm-gold/30"
      }`}>
        <Crown className="h-3.5 w-3.5" />
        <span>{isActive ? "Habitante" : "Activar"}</span>
      </Link>
    </div>
  );
}

export default function TerritoryShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-b from-rdm-night via-rdm-carbon to-rdm-stone relative">
        <FogLayer />
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-3 sm:px-5 border-b border-white/8 bg-rdm-night/85 backdrop-blur-xl">
            <SidebarTrigger className="text-rdm-fog hover:text-rdm-gold transition-colors" />
            <div className="flex-1 max-w-2xl">
              <TopSearch />
            </div>
            <HeaderStatus />
            <NotificationsBell />
          </header>

          <main id="main-content" className="flex-1 overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
