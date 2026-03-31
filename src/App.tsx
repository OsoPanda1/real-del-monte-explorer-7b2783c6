import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import CompassNav from "@/components/CompassNav";
import GuideOrb from "@/components/GuideOrb";
import Index from "./pages/Index";
import Pastes from "./pages/Pastes";
import Minas from "./pages/Minas";
import Cementerio from "./pages/Cementerio";
import Calles from "./pages/Calles";
import Directorio from "./pages/Directorio";
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
          <Route path="/pastes" element={<Pastes />} />
          <Route path="/minas" element={<Minas />} />
          <Route path="/cementerio" element={<Cementerio />} />
          <Route path="/calles" element={<Calles />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CompassNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
