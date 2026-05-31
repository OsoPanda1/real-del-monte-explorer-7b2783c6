import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TerritoryShell from "@/components/TerritoryShell";
import GuideOrb from "@/components/GuideOrb";

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
import Juegos from "./pages/Juegos";
import Recompensas from "./pages/Recompensas";
import Membresia from "./pages/Membresia";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rutas de auth sin shell */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Shell global con sidebar + topbar */}
          <Route element={<TerritoryShell />}>
            <Route index element={<Index />} />
            <Route path="pastes" element={<Pastes />} />
            <Route path="minas" element={<Minas />} />
            <Route path="cementerio" element={<Cementerio />} />
            <Route path="calles" element={<Calles />} />
            <Route path="rutas" element={<Rutas />} />
            <Route path="leyendas" element={<Leyendas />} />
            <Route path="eventos" element={<Eventos />} />
            <Route path="plataforma" element={<Plataforma />} />
            <Route path="federaciones" element={<Federaciones />} />
            <Route path="isabella" element={<Isabella />} />
            <Route path="ecosistema" element={<Ecosistema />} />
            <Route path="directorio" element={<Directorio />} />
            <Route path="comercios/nuevo" element={<NuevoComercio />} />
            <Route path="mapa" element={<Mapa />} />
            <Route path="nodo-cero" element={<NodoCero />} />
            <Route path="atlas" element={<Atlas />} />
            <Route path="guardian" element={<Guardian />} />
            <Route path="auditoria" element={<Auditoria />} />
            <Route path="propuesta" element={<Propuesta />} />
            <Route path="pdos-core" element={<PdosCore />} />
            <Route path="dm-x7" element={<DmX7 />} />
            <Route path="tutorial" element={<Tutorial />} />
            <Route path="logros" element={<Logros />} />
            <Route path="manifiesto" element={<Manifiesto />} />
            <Route path="blueprint" element={<Blueprint />} />
            <Route path="nexus" element={<Nexus />} />
            <Route path="juegos" element={<Juegos />} />
            <Route path="recompensas" element={<Recompensas />} />
            <Route path="membresia" element={<Membresia />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <GuideOrb />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
