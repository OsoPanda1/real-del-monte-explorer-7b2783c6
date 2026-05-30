import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { type ReactNode, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

type PageHeroVariant = 
  | "territory" 
  | "ecosystem" 
  | "governance" 
  | "heritage" 
  | "intelligence" 
  | "immersive";

type PageHeroLayout = "cinematic" | "editorial" | "minimal" | "split";

interface PageHeroProps {
  eyebrow?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  variant?: PageHeroVariant;
  layout?: PageHeroLayout;
  children?: ReactNode;
  className?: string;
  backgroundEffect?: "fog" | "grid" | "constellation" | "particles" | "none";
  parallaxIntensity?: number;
  align?: "left" | "center";
  image?: string;
  video?: string;
  overlay?: "dark" | "light" | "gradient" | "none";
}

const variantStyles: Record<
  PageHeroVariant,
  { 
    eyebrow: string; 
    title: string; 
    subtitle: string;
    accent: string;
  }
> = {
  territory: {
    eyebrow: "text-rdm-gold/90 tracking-[0.35em] drop-shadow-[0_0_12px_rgba(212,178,106,0.3)]",
    title: "bg-gradient-to-br from-rdm-gold via-rdm-copper to-rdm-gold bg-clip-text text-transparent animate-gradient-shift",
    subtitle: "text-rdm-fog/90",
    accent: "bg-rdm-gold/20 border-rdm-gold/40",
  },
  ecosystem: {
    eyebrow: "text-rdm-oxygen/90 tracking-[0.35em] drop-shadow-[0_0_12px_rgba(0,160,255,0.4)]",
    title: "bg-gradient-to-br from-rdm-oxygen via-rdm-data to-rdm-grid bg-clip-text text-transparent animate-gradient-shift",
    subtitle: "text-rdm-fog/90",
    accent: "bg-rdm-oxygen/20 border-rdm-oxygen/40",
  },
  governance: {
    eyebrow: "text-rdm-candle/90 tracking-[0.35em] drop-shadow-[0_0_12px_rgba(255,193,7,0.3)]",
    title: "bg-gradient-to-br from-rdm-candle via-rdm-gold to-rdm-amber bg-clip-text text-transparent animate-gradient-shift",
    subtitle: "text-rdm-fog/90",
    accent: "bg-rdm-candle/20 border-rdm-candle/40",
  },
  heritage: {
    eyebrow: "text-rdm-copper/90 tracking-[0.35em] font-heritage",
    title: "bg-gradient-to-br from-rdm-copper via-rdm-gold to-rdm-silver bg-clip-text text-transparent font-heritage animate-gradient-shift",
    subtitle: "text-rdm-silver/85 font-heritage italic",
    accent: "bg-rdm-copper/20 border-rdm-gold/40",
  },
  intelligence: {
    eyebrow: "text-rdm-data/90 tracking-[0.35em]",
    title: "bg-gradient-to-br from-rdm-pine via-rdm-data to-rdm-gold bg-clip-text text-transparent animate-gradient-shift",
    subtitle: "text-rdm-fog/90",
    accent: "bg-rdm-data/20 border-rdm-data/40",
  },
  immersive: {
    eyebrow: "text-white/80 tracking-[0.4em]",
    title: "text-white drop-shadow-[0_4px_40px_rgba(255,255,255,0.3)]",
    subtitle: "text-white/75",
    accent: "bg-white/10 border-white/30",
  },
};

const layoutStyles: Record<PageHeroLayout, string> = {
  cinematic: "min-h-[85vh] md:min-h-[92vh] flex items-center justify-center",
  editorial: "min-h-[70vh] md:min-h-[80vh] flex items-end pb-20 md:pb-28",
  minimal: "min-h-[50vh] md:min-h-[60vh] flex items-center justify-center",
  split: "min-h-[75vh] md:min-h-[85vh] grid md:grid-cols-2 gap-12 items-center",
};

const ParticleField = ({ variant }: { variant: PageHeroVariant }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const colors = {
      territory: "rgba(212, 178, 106, ",
      ecosystem: "rgba(0, 160, 255, ",
      governance: "rgba(255, 193, 7, ",
      heritage: "rgba(212, 178, 106, ",
      intelligence: "rgba(0, 160, 255, ",
      immersive: "rgba(255, 255, 255, ",
    };

    const color = colors[variant];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color + p.opacity + ")";
        ctx.fill();

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = color + (0.15 * (1 - dist / 120)) + ")";
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
};

const PageHero = ({
  eyebrow,
  title,
  subtitle,
  variant = "territory",
  layout = "cinematic",
  children,
  className,
  backgroundEffect = "fog",
  parallaxIntensity = 0.5,
  align = "center",
  image,
  video,
  overlay = "dark",
}: PageHeroProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 300 * parallaxIntensity]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.1]), springConfig);

  const styles = variantStyles[variant];

  const overlayStyles = {
    dark: "bg-gradient-to-b from-rdm-night/80 via-rdm-night/60 to-rdm-night/90",
    light: "bg-gradient-to-b from-white/30 via-white/20 to-white/40",
    gradient: "bg-gradient-to-br from-rdm-night/70 via-transparent to-rdm-night/80",
    none: "",
  };

  return (
    <section
      ref={ref}
      className={cn(
        "relative overflow-hidden isolate",
        layoutStyles[layout],
        className,
      )}
      style={{
        containerType: "inline-size",
      }}
    >
      {/* Background Media Layer */}
      {(image || video) && (
        <motion.div
          className="absolute inset-0 z-0"
          style={{ scale, y }}
        >
          {video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={video} type="video/mp4" />
            </video>
          ) : (
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
          <div className={cn("absolute inset-0", overlayStyles[overlay])} />
        </motion.div>
      )}

      {/* Atmospheric Effects */}
      {backgroundEffect === "fog" && (
        <motion.div
          className="fog-layer"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
          aria-hidden="true"
        />
      )}

      {backgroundEffect === "grid" && (
        <motion.div
          className="digital-grid absolute inset-0 opacity-20"
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, 150]) }}
          aria-hidden="true"
        />
      )}

      {backgroundEffect === "constellation" && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-current opacity-40"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                y: useTransform(scrollYProgress, [0, 1], [0, Math.random() * 200 - 100]),
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {backgroundEffect === "particles" && <ParticleField variant={variant} />}

      {/* Content Container */}
      <motion.div
        className={cn(
          "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12",
          align === "center" && "text-center",
          align === "left" && "text-left",
        )}
        style={{ opacity }}
      >
        {/* Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={cn(
            "h-[2px] w-24 mb-8",
            styles.accent,
            align === "center" && "mx-auto",
          )}
        />

        {/* Eyebrow */}
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "font-display text-[0.65rem] md:text-xs uppercase font-bold mb-6 md:mb-8 relative",
              styles.eyebrow,
            )}
          >
            <span className="relative z-10">{eyebrow}</span>
            <span 
              className="absolute inset-0 blur-xl opacity-50" 
              aria-hidden="true"
            >
              {eyebrow}
            </span>
          </motion.p>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8 md:mb-10",
            "will-change-transform",
            styles.title,
            align === "center" && "max-w-5xl mx-auto",
            align === "left" && "max-w-4xl",
          )}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "text-lg md:text-2xl leading-relaxed md:leading-relaxed",
              styles.subtitle,
              align === "center" && "max-w-3xl mx-auto",
              align === "left" && "max-w-2xl",
            )}
          >
            {typeof subtitle === "string" ? <p>{subtitle}</p> : subtitle}
          </motion.div>
        )}

        {/* CTA / Children */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-10 md:mt-14 flex flex-wrap gap-4 md:gap-6",
              align === "center" && "justify-center",
              align === "left" && "justify-start",
            )}
          >
            {children}
          </motion.div>
        )}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-current/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-current/60"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-rdm-night via-rdm-night/60 to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
    </section>
  );
};

export default PageHero;
export type { PageHeroProps, PageHeroVariant, PageHeroLayout };
