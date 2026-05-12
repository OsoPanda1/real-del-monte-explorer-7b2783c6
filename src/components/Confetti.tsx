// Lightweight CSS-only confetti overlay
export default function Confetti({ count = 60 }: { count?: number }) {
  const colors = ["bg-primary", "bg-oxido", "bg-niebla", "bg-secondary"];
  return (
    <div className="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const dur = 2 + Math.random() * 2;
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className={`confetti-piece ${color}`}
            style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
          />
        );
      })}
    </div>
  );
}
