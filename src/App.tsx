import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import TerritoryShell from "@/components/TerritoryShell";
import GuideOrb from "@/components/GuideOrb";

const RouteLoader = ({ }: { variant?: string; fullscreen?: boolean }) => (
  <div className="min-h-[40vh] grid place-items-center">
    <div className="h-10 w-10 rounded-full border-2 border-rdm-gold/30 border-t-rdm-gold animate-spin" />
  </div>
);



// critical routes
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// lazy routes
const Pastes = lazy(() => import("./pages/Pastes"));
const Minas = lazy(() => import("./pages/Minas"));
const Cementerio = lazy(() => import("./pages/Cementerio"));
const Calles = lazy(() => import("./pages/Calles"));
const Rutas = lazy(() => import("./pages/Rutas"));
const Leyendas = lazy(() => import("./pages/Leyendas"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Plataforma = lazy(() => import("./pages/Plataforma"));
const Federaciones = lazy(() => import("./pages/Federaciones"));
const Isabella = lazy(() => import("./pages/Isabella"));
const Ecosistema = lazy(() => import("./pages/Ecosistema"));
const Directorio = lazy(() => import("./pages/Directorio"));
const NuevoComercio = lazy(() => import("./pages/NuevoComercio"));
const Mapa = lazy(() => import("./pages/Mapa"));
const NodoCero = lazy(() => import("./pages/NodoCero"));
const Atlas = lazy(() => import("./pages/Atlas"));
const Guardian = lazy(() => import("./pages/Guardian"));
const Auditoria = lazy(() => import("./pages/Auditoria"));
const Propuesta = lazy(() => import("./pages/Propuesta"));
const PdosCore = lazy(() => import("./pages/PdosCore"));
const DmX7 = lazy(() => import("./pages/DmX7"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Tutorial = lazy(() => import("./pages/Tutorial"));
const Logros = lazy(() => import("./pages/Logros"));
const Manifiesto = lazy(() => import("./pages/Manifiesto"));
const Blueprint = lazy(() => import("./pages/Blueprint"));
const Nexus = lazy(() => import("./pages/Nexus"));
const Juegos = lazy(() => import("./pages/Juegos"));
const Recompensas = lazy(() => import("./pages/Recompensas"));
const Membresia = lazy(() => import("./pages/Membresia"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 15,
      retry: (failureCount, error: any) => {
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
      networkMode: "online",
    },
    mutations: {
      retry: false,
    },
  },
});

const routeMap = [
  { path: "/pastes", loader: () => import("./pages/Pastes") },
  { path: "/minas", loader: () => import("./pages/Minas") },
  { path: "/cementerio", loader: () => import("./pages/Cementerio") },
  { path: "/calles", loader: () => import("./pages/Calles") },
  { path: "/rutas", loader: () => import("./pages/Rutas") },
  { path: "/leyendas", loader: () => import("./pages/Leyendas") },
  { path: "/eventos", loader: () => import("./pages/Eventos") },
  { path: "/plataforma", loader: () => import("./pages/Plataforma") },
  { path: "/federaciones", loader: () => import("./pages/Federaciones") },
  { path: "/isabella", loader: () => import("./pages/Isabella") },
  { path: "/ecosistema", loader: () => import("./pages/Ecosistema") },
  { path: "/directorio", loader: () => import("./pages/Directorio") },
  { path: "/comercios/nuevo", loader: () => import("./pages/NuevoComercio") },
  { path: "/mapa", loader: () => import("./pages/Mapa") },
  { path: "/nodo-cero", loader: () => import("./pages/NodoCero") },
  { path: "/atlas", loader: () => import("./pages/Atlas") },
  { path: "/guardian", loader: () => import("./pages/Guardian") },
  { path: "/auditoria", loader: () => import("./pages/Auditoria") },
  { path: "/propuesta", loader: () => import("./pages/Propuesta") },
  { path: "/pdos-core", loader: () => import("./pages/PdosCore") },
  { path: "/dm-x7", loader: () => import("./pages/DmX7") },
  { path: "/tutorial", loader: () => import("./pages/Tutorial") },
  { path: "/logros", loader: () => import("./pages/Logros") },
  { path: "/manifiesto", loader: () => import("./pages/Manifiesto") },
  { path: "/blueprint", loader: () => import("./pages/Blueprint") },
  { path: "/nexus", loader: () => import("./pages/Nexus") },
  { path: "/juegos", loader: () => import("./pages/Juegos") },
  { path: "/recompensas", loader: () => import("./pages/Recompensas") },
  { path: "/membresia", loader: () => import("./pages/Membresia") },
  { path: "/reset-password", loader: () => import("./pages/ResetPassword") },
];

const AppRouteEffects = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return null;
};


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={200}>
      <Toaster />
      <Sonner position="bottom-right" richColors closeButton />
      <BrowserRouter>
        <AppRouteEffects />

          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<TerritoryShell />}>
              <Route index element={<Index />} />

              <Route
                path="pastes"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Pastes /></Suspense>}
              />
              <Route
                path="minas"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Minas /></Suspense>}
              />
              <Route
                path="cementerio"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Cementerio /></Suspense>}
              />
              <Route
                path="calles"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Calles /></Suspense>}
              />
              <Route
                path="rutas"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Rutas /></Suspense>}
              />
              <Route
                path="leyendas"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Leyendas /></Suspense>}
              />
              <Route
                path="eventos"
                element={<Suspense fallback={<RouteLoader variant="territory" fullscreen />}><Eventos /></Suspense>}
              />

              <Route
                path="plataforma"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><Plataforma /></Suspense>}
              />
              <Route
                path="federaciones"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><Federaciones /></Suspense>}
              />
              <Route
                path="isabella"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><Isabella /></Suspense>}
              />
              <Route
                path="ecosistema"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><Ecosistema /></Suspense>}
              />
              <Route
                path="directorio"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><Directorio /></Suspense>}
              />
              <Route
                path="comercios/nuevo"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><NuevoComercio /></Suspense>}
              />
              <Route
                path="mapa"
                element={<Suspense fallback={<RouteLoader variant="ecosystem" fullscreen />}><Mapa /></Suspense>}
              />

              <Route
                path="nodo-cero"
                element={<Suspense fallback={<RouteLoader variant="governance" fullscreen />}><NodoCero /></Suspense>}
              />
              <Route
                path="atlas"
                element={<Suspense fallback={<RouteLoader variant="governance" fullscreen />}><Atlas /></Suspense>}
              />
              <Route
                path="guardian"
                element={<Suspense fallback={<RouteLoader variant="governance" fullscreen />}><Guardian /></Suspense>}
              />
              <Route
                path="auditoria"
                element={<Suspense fallback={<RouteLoader variant="governance" fullscreen />}><Auditoria /></Suspense>}
              />
              <Route
                path="propuesta"
                element={<Suspense fallback={<RouteLoader variant="governance" fullscreen />}><Propuesta /></Suspense>}
              />

              <Route
                path="pdos-core"
                element={<Suspense fallback={<RouteLoader variant="technical" fullscreen />}><PdosCore /></Suspense>}
              />
              <Route
                path="dm-x7"
                element={<Suspense fallback={<RouteLoader variant="technical" fullscreen />}><DmX7 /></Suspense>}
              />

              <Route
                path="tutorial"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Tutorial /></Suspense>}
              />
              <Route
                path="logros"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Logros /></Suspense>}
              />
              <Route
                path="manifiesto"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Manifiesto /></Suspense>}
              />
              <Route
                path="blueprint"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Blueprint /></Suspense>}
              />
              <Route
                path="nexus"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Nexus /></Suspense>}
              />
              <Route
                path="juegos"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Juegos /></Suspense>}
              />
              <Route
                path="recompensas"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Recompensas /></Suspense>}
              />
              <Route
                path="membresia"
                element={<Suspense fallback={<RouteLoader variant="engagement" fullscreen />}><Membresia /></Suspense>}
              />

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
