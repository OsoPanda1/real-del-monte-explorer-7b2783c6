import { useEffect, useRef } from "react";

interface Props {
  starCount?: number;
  className?: string;
}

const StarfieldBackground = ({ starCount = 1200, className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 2 + 1;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.animationDuration = `${Math.random() * 6 + 2}s`;
      star.style.animationDelay = `${Math.random() * 8}s`;
      star.style.opacity = `${Math.random() * 0.8 + 0.2}`;

      if (Math.random() > 0.95) {
        star.style.background = "hsl(180, 100%, 70%)";
        star.style.boxShadow = "0 0 4px hsl(180, 100%, 70%)";
      } else if (Math.random() > 0.9) {
        star.style.background = "hsl(217, 91%, 70%)";
        star.style.boxShadow = "0 0 3px hsl(217, 91%, 70%)";
      }
      container.appendChild(star);
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [starCount]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`starfield pointer-events-none fixed inset-0 z-0 ${className}`}
    />
  );
};

export default StarfieldBackground;
