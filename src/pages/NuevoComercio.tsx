import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  nombre: z.string().trim().min(2).max(120),
  descripcion: z.string().trim().max(500).optional(),
  federacion: z.enum(["hospedaje", "gastronomica", "plateria", "comercio", "guias", "cultura", "inteligencia"]),
  direccion: z.string().trim().max(200).optional(),
  telefono: z.string().trim().max(30).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  instagram: z.string().trim().max(60).optional(),
  sitio_web: z.string().trim().url().max(200).optional().or(z.literal("")),
  imagen_url: z.string().trim().url().max(500).optional().or(z.literal("")),
  latitud: z.coerce.number().min(-90).max(90).optional(),
  longitud: z.coerce.number().min(-180).max(180).optional(),
});

const NuevoComercio = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    federacion: "comercio" as const,
    direccion: "",
    telefono: "",
    whatsapp: "",
    instagram: "",
    sitio_web: "",
    imagen_url: "",
    latitud: "",
    longitud: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const payload = {
      ...form,
      latitud: form.latitud ? Number(form.latitud) : undefined,
      longitud: form.longitud ? Number(form.longitud) : undefined,
    };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("comercios").insert({
      ...parsed.data,
      sitio_web: parsed.data.sitio_web || null,
      imagen_url: parsed.data.imagen_url || null,
      owner_id: user.id,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Comercio registrado");
      navigate("/directorio");
    }
    setSubmitting(false);
  };

  return (
    <main>
      <PageHero
        eyebrow="REGISTRO COMERCIAL"
        title="Registra tu comercio"
        subtitle="Plan Soberano básico. Tu negocio queda en el directorio público y en el mapa interactivo del Pueblo Mágico."
      />
      <section className="pb-32">
        <div className="narrative-column max-w-2xl">
          <form onSubmit={submit} className="space-y-5 bg-card border border-border p-8 rounded-sm">
            <div>
              <Label htmlFor="nombre">Nombre del comercio *</Label>
              <Input id="nombre" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} required maxLength={120} />
            </div>
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" value={form.descripcion} onChange={(e) => update("descripcion", e.target.value)} maxLength={500} rows={3} />
            </div>
            <div>
              <Label>Federación *</Label>
              <Select value={form.federacion} onValueChange={(v) => update("federacion", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospedaje">Hospedaje</SelectItem>
                  <SelectItem value="gastronomica">Gastronómica</SelectItem>
                  <SelectItem value="plateria">Platería</SelectItem>
                  <SelectItem value="comercio">Comercio y servicios</SelectItem>
                  <SelectItem value="guias">Guías y experiencias</SelectItem>
                  <SelectItem value="cultura">Cultura y memoria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" value={form.direccion} onChange={(e) => update("direccion", e.target.value)} maxLength={200} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} maxLength={30} />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} maxLength={30} placeholder="+52..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} maxLength={60} placeholder="@cuenta" />
              </div>
              <div>
                <Label htmlFor="sitio_web">Sitio web</Label>
                <Input id="sitio_web" value={form.sitio_web} onChange={(e) => update("sitio_web", e.target.value)} maxLength={200} placeholder="https://" />
              </div>
            </div>
            <div>
              <Label htmlFor="imagen_url">URL de imagen</Label>
              <Input id="imagen_url" value={form.imagen_url} onChange={(e) => update("imagen_url", e.target.value)} maxLength={500} placeholder="https://" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitud">Latitud</Label>
                <Input id="latitud" type="number" step="any" value={form.latitud} onChange={(e) => update("latitud", e.target.value)} placeholder="20.1394" />
              </div>
              <div>
                <Label htmlFor="longitud">Longitud</Label>
                <Input id="longitud" type="number" step="any" value={form.longitud} onChange={(e) => update("longitud", e.target.value)} placeholder="-98.6731" />
              </div>
            </div>
            <p className="font-body text-xs italic text-muted-foreground">
              Tip: usa Google Maps → clic derecho sobre tu ubicación → copia "lat, lng".
            </p>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Guardando…" : "Registrar comercio"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default NuevoComercio;
