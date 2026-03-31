import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "guide";
  content: string;
  timestamp: Date;
}

const GUIDE_RESPONSES: Record<string, string> = {
  pastes: "Los pastes llegaron con los mineros de Cornwall en 1824. La receta original era papa con carne, pero aquí evolucionó: tinga, mole, rajas... Te recomiendo probar los de El Portal, frente a la plaza principal.",
  minas: "La Mina de Acosta es la más visitada. Bajas 400 metros por túneles que tienen más de 500 años. Lleva ropa abrigadora — adentro hace frío todo el año.",
  cementerio: "El Panteón Inglés tiene 755 tumbas de mineros británicos. Las lápidas miran hacia Inglaterra. Está en el bosque de oyamel, a 10 minutos del centro.",
  calles: "Las calles empedradas son del siglo XVIII. La calle principal sube desde la plaza hasta la iglesia. En días de niebla, el pueblo parece suspendido en el tiempo.",
  clima: "A 2,660 metros de altitud, el clima es frío y húmedo casi todo el año. En invierno puede nevar. Trae chamarra y paraguas siempre.",
  comer: "Además de los pastes, prueba la barbacoa de los domingos, el pulque curado en La Providencia, y las gorditas del mercado. Para algo más formal, el restaurante del Hotel Real tiene vista al valle.",
  llegar: "Desde CDMX son unas 2.5 horas por la autopista México-Pachuca. Desde Pachuca son 20 minutos subiendo por la carretera federal. Hay autobuses cada hora desde la Terminal Norte.",
  default: "Real del Monte guarda muchos secretos. Pregúntame sobre los pastes, las minas, el cementerio inglés, las calles, el clima, dónde comer, o cómo llegar.",
};

function getGuideResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("paste") || lower.includes("comer") || lower.includes("comida")) return GUIDE_RESPONSES.comer;
  if (lower.includes("mina")) return GUIDE_RESPONSES.minas;
  if (lower.includes("cementerio") || lower.includes("panteón") || lower.includes("panteon") || lower.includes("inglés")) return GUIDE_RESPONSES.cementerio;
  if (lower.includes("calle") || lower.includes("caminar") || lower.includes("recorrer")) return GUIDE_RESPONSES.calles;
  if (lower.includes("clima") || lower.includes("frío") || lower.includes("lluv") || lower.includes("niev")) return GUIDE_RESPONSES.clima;
  if (lower.includes("llegar") || lower.includes("transporte") || lower.includes("autobús") || lower.includes("carro")) return GUIDE_RESPONSES.llegar;
  if (lower.includes("paste")) return GUIDE_RESPONSES.pastes;
  return GUIDE_RESPONSES.default;
}

const GuideOrb = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Animated lantern orb
  useEffect(() => {
    if (isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 80;
    canvas.height = 80;
    let time = 0;
    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, 80, 80);
      const cx = 40, cy = 40, r = 22;

      // Outer glow rings
      for (let i = 0; i < 3; i++) {
        const pr = r + 6 + Math.sin(time * 0.03 + i * 0.7) * 4;
        ctx.beginPath();
        ctx.arc(cx, cy, pr + i * 5, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(13, 63%, 43%, ${0.2 - i * 0.06})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Core gradient (warm lantern)
      const g = ctx.createRadialGradient(cx - 5, cy - 5, 3, cx, cy, r);
      g.addColorStop(0, "hsla(30, 60%, 75%, 0.9)");
      g.addColorStop(0.5, "hsla(13, 63%, 50%, 0.7)");
      g.addColorStop(1, "hsla(13, 63%, 35%, 0.4)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Inner bright core (flickering)
      const flicker = 8 + Math.sin(time * 0.08) * 2 + Math.sin(time * 0.13) * 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, flicker, 0, Math.PI * 2);
      ctx.fillStyle = "hsla(30, 80%, 85%, 0.6)";
      ctx.fill();

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim(), timestamp: new Date() };
    const guideMsg: Message = { role: "guide", content: getGuideResponse(input), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg, guideMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating orb - bottom left to not conflict with compass nav */}
      <div className="fixed bottom-8 left-8 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-20 h-20 cursor-pointer group"
            aria-label="Abrir guía del pueblo"
          >
            <canvas ref={canvasRef} className="w-full h-full" />
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 font-display text-[10px] tracking-widest text-foreground/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              GUÍA
            </motion.span>
          </button>
        )}
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-8 z-50 w-[340px] max-h-[480px] rounded-sm border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h3 className="font-display text-sm tracking-widest">GUÍA DEL PUEBLO</h3>
                <p className="font-body text-xs text-muted-foreground italic mt-0.5">Real del Monte, Hidalgo</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="font-display text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-5 py-4 max-h-[320px]">
              {messages.length === 0 && (
                <div className="text-center py-6">
                  <p className="font-body text-sm text-muted-foreground italic leading-relaxed">
                    Pregúntame sobre el pueblo — los pastes, las minas, el cementerio inglés, las calles, el clima, o cómo llegar.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block max-w-[85%] px-3 py-2 rounded-sm text-sm font-body leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="¿Qué quieres saber?"
                  className="flex-1 px-3 py-2 text-sm font-body bg-background border border-input rounded-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button
                  onClick={handleSend}
                  className="px-3 py-2 font-display text-xs tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GuideOrb;
