import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/integrations/supabase/client";
import PageHero from "@/components/PageHero";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Comercio {
  id: string;
  nombre: string;
  federacion: string;
  direccion: string | null;
  whatsapp: string | null;
  latitud: number | null;
  longitud: number | null;
}

// Real del Monte centro
const RDM_CENTER: [number, number] = [20.1394, -98.6731];

const Mapa = () => {
  const [comercios, setComercios] = useState<Comercio[]>([]);

  useEffect(() => {
    supabase
      .from("comercios")
      .select("id,nombre,federacion,direccion,whatsapp,latitud,longitud")
      .eq("activo", true)
      .not("latitud", "is", null)
      .not("longitud", "is", null)
      .then(({ data }) => setComercios((data ?? []) as Comercio[]));
  }, []);

  return (
    <main>
      <PageHero
        eyebrow="GEOLOCALIZACIÓN SOBERANA"
        title="Mapa interactivo de Real del Monte"
        subtitle="Cada comercio registrado aparece como un nodo del territorio. Haz clic para ver detalles."
      />
      <section className="pb-32">
        <div className="narrative-column max-w-6xl">
          <div className="bg-card border border-border rounded-sm overflow-hidden" style={{ height: "70vh" }}>
            <MapContainer center={RDM_CENTER} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {comercios.map((c) => (
                <Marker key={c.id} position={[c.latitud!, c.longitud!]}>
                  <Popup>
                    <div style={{ fontFamily: "Lora, serif" }}>
                      <strong>{c.nombre}</strong>
                      <br />
                      <em style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                        {c.federacion}
                      </em>
                      {c.direccion && (
                        <>
                          <br />
                          {c.direccion}
                        </>
                      )}
                      {c.whatsapp && (
                        <>
                          <br />
                          <a
                            href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <p className="text-center font-body italic text-muted-foreground text-sm mt-6">
            {comercios.length === 0
              ? "Aún no hay comercios geolocalizados. Sé el primero desde /directorio."
              : `${comercios.length} comercio${comercios.length !== 1 ? "s" : ""} en el mapa`}
          </p>
        </div>
      </section>
    </main>
  );
};

export default Mapa;
