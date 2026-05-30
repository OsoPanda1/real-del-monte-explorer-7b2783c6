import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CompassNav from "@/components/CompassNav";
import GuideOrb from "@/components/GuideOrb";
import NotificationsBell from "@/components/NotificationsBell";

import Index from "./pages/Index";
import Pastes from "./pages/Pastes";
import Minas from "./pages/Minas";
import Cementerio from "./pages/Cementerio";
import Calles from "./pages/Calles";
import Rutas from "./pages/Rutas";
import Leyendas from "./pages/Leyendas";
import Eventos from "./pages/Eventos";
import Plataforma from "./pages/Plataforma";
import Federaciones from "./pages/Federaciones";
import Isabella from "./pages/Isabella";
import Ecosistema from "./pages/Ecosistema";
import Directorio from "./pages/Directorio";
import NuevoComercio from "./pages/NuevoComercio";
import Mapa from "./pages/Mapa";
import NodoCero from "./pages/NodoCero";
import Auditoria from "./pages/Auditoria";
import Propuesta from "./pages/Propuesta";
import Atlas from "./pages/Atlas";
import Guardian from "./pages/Guardian";
import PdosCore from "./pages/PdosCore";
import DmX7 from "./pages/DmX7";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Tutorial from "./pages/Tutorial";
import Logros from "./pages/Logros";
import Manifiesto from "./pages/Manifiesto";
import Blueprint from "./pages/Blueprint";
import Nexus from "./pages/Nexus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RootLayout = () => (
  <div className="app-shell">
    <header className="app-header" role="banner">
      <CompassNav />
      <NotificationsBell />
    </header>

    <main id="main-content" className="app-main" role="main">
      <Outlet />
    </main>

    <GuideOrb />
    <footer className="app-footer" role="contentinfo" />
  </div>
);

const TerritoryLayout = () => <Outlet />;
const EcosystemLayout = () => <Outlet />;
const GovernanceLayout = () => <Outlet />;
const AuthLayout = () => <Outlet />;
const EngagementLayout = () => <Outlet />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Index />} />

            <Route element={<TerritoryLayout />}>
              <Route path="pastes" element={<Pastes />} />
              <Route path="minas" element={<Minas />} />
              <Route path="cementerio" element={<Cementerio />} />
              <Route path="calles" element={<Calles />} />
              <Route path="rutas" element={<Rutas />} />
              <Route path="leyendas" element={<Leyendas />} />
              <Route path="eventos" element={<Eventos />} />
            </Route>

            <Route element={<EcosystemLayout />}>
              <Route path="plataforma" element={<Plataforma />} />
              <Route path="federaciones" element={<Federaciones />} />
              <Route path="isabella" element={<Isabella />} />
              <Route path="ecosistema" element={<Ecosistema />} />
              <Route path="directorio" element={<Directorio />} />
              <Route path="comercios/nuevo" element={<NuevoComercio />} />
              <Route path="mapa" element={<Mapa />} />
            </Route>

            <Route element={<GovernanceLayout />}>
              <Route path="nodo-cero" element={<NodoCero />} />
              <Route path="atlas" element={<Atlas />} />
              <Route path="guardian" element={<Guardian />} />
              <Route path="auditoria" element={<Auditoria />} />
              <Route path="propuesta" element={<Propuesta />} />
            </Route>

            <Route path="pdos-core" element={<PdosCore />} />
            <Route path="dm-x7" element={<DmX7 />} />

            <Route element={<EngagementLayout />}>
              <Route path="tutorial" element={<Tutorial />} />
              <Route path="logros" element={<Logros />} />
              <Route path="manifiesto" element={<Manifiesto />} />
              <Route path="blueprint" element={<Blueprint />} />
              <Route path="nexus" element={<Nexus />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="auth" element={<Auth />} />
              <Route path="reset-password" element={<ResetPassword />} />
            </Route>

            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
