import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CompassNav from "@/components/CompassNav";
import GuideOrb from "@/components/GuideOrb";

import Index from "./pages/Index";
// Territorio
import Pastes from "./pages/Pastes";
import Minas from "./pages/Minas";
import Cementerio from "./pages/Cementerio";
import Calles from "./pages/Calles";
import Rutas from "./pages/Rutas";
import Leyendas from "./pages/Leyendas";
import Eventos from "./pages/Eventos";
// Ecosistema
import Plataforma from "./pages/Plataforma";
import Federaciones from "./pages/Federaciones";
import Isabella from "./pages/Isabella";
import Ecosistema from "./pages/Ecosistema";
import Directorio from "./pages/Directorio";
import NuevoComercio from "./pages/NuevoComercio";
import Mapa from "./pages/Mapa";
// Gobernanza
import NodoCero from "./pages/NodoCero";
import Auditoria from "./pages/Auditoria";
import Propuesta from "./pages/Propuesta";
import Atlas from "./pages/Atlas";
import Guardian from "./pages/Guardian";
import PdosCore from "./pages/PdosCore";
import DmX7 from "./pages/DmX7";
import Auth from "./pages/Auth";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Territorio */}
          <Route path="/pastes" element={<Pastes />} />
          <Route path="/minas" element={<Minas />} />
          <Route path="/cementerio" element={<Cementerio />} />
          <Route path="/calles" element={<Calles />} />
          <Route path="/rutas" element={<Rutas />} />
          <Route path="/leyendas" element={<Leyendas />} />
          <Route path="/eventos" element={<Eventos />} />
          {/* Ecosistema */}
          <Route path="/plataforma" element={<Plataforma />} />
          <Route path="/federaciones" element={<Federaciones />} />
          <Route path="/isabella" element={<Isabella />} />
          <Route path="/ecosistema" element={<Ecosistema />} />
          <Route path="/directorio" element={<Directorio />} />
          <Route path="/comercios/nuevo" element={<NuevoComercio />} />
          <Route path="/mapa" element={<Mapa />} />
          {/* Gobernanza */}
          <Route path="/nodo-cero" element={<NodoCero />} />
          <Route path="/auditoria" element={<Auditoria />} />
          <Route path="/propuesta" element={<Propuesta />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CompassNav />
        <GuideOrb />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
