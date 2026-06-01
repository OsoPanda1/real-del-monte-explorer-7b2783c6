import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";

const ROUTES = [
  { label: "Portal", to: "/" },
  { label: "Mapa territorial", to: "/mapa" },
  { label: "Calles", to: "/calles" },
  { label: "Rutas", to: "/rutas" },
  { label: "Minas", to: "/minas" },
  { label: "Cementerio Inglés", to: "/cementerio" },
  { label: "Leyendas", to: "/leyendas" },
  { label: "Pastes", to: "/pastes" },
  { label: "Eventos", to: "/eventos" },
  { label: "Directorio", to: "/directorio" },
  { label: "Nuevo comercio", to: "/comercios/nuevo" },
  { label: "Ecosistema", to: "/ecosistema" },
  { label: "Atlas", to: "/atlas" },
  { label: "Nexus ELITE", to: "/nexus" },
  { label: "Isabella", to: "/isabella" },
  { label: "PDOS Core", to: "/pdos-core" },
  { label: "DM-X7", to: "/dm-x7" },
  { label: "Plataforma", to: "/plataforma" },
  { label: "Nodo Cero", to: "/nodo-cero" },
  { label: "Guardian", to: "/guardian" },
  { label: "Auditoría", to: "/auditoria" },
  { label: "Federaciones", to: "/federaciones" },
  { label: "Manifiesto", to: "/manifiesto" },
  { label: "Blueprint", to: "/blueprint" },
  { label: "Juegos", to: "/juegos" },
  { label: "Recompensas", to: "/recompensas" },
  { label: "Logros", to: "/logros" },
  { label: "Membresía", to: "/membresia" },
  { label: "Tutorial", to: "/tutorial" },
];

export default function TopSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-2.5 w-full max-w-xl px-4 py-2 rounded-full bg-white/5 hover:bg-white/8 border border-white/10 hover:border-rdm-gold/30 transition-all text-left"
      >
        <Search className="h-4 w-4 text-rdm-fog/60 group-hover:text-rdm-gold transition-colors" />
        <span className="flex-1 text-sm text-rdm-fog/55 truncate"><span className="hidden sm:inline">Buscar en RDM Digital…</span><span className="sm:hidden">Buscar…</span></span>
        <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] text-rdm-fog/45 font-mono px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Explora el territorio…" />
        <CommandList>
          <CommandEmpty>No hay coincidencias en el territorio.</CommandEmpty>
          <CommandGroup heading="Lugares y experiencias">
            {ROUTES.map(r => (
              <CommandItem
                key={r.to}
                onSelect={() => { navigate(r.to); setOpen(false); }}
              >
                {r.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
