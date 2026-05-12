import { useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface Props {
  src: string;
  poster?: string;
  alt?: string;
  type?: "image" | "audio" | "video";
  className?: string;
  autoPlay?: boolean;
}

export default function MediaPlayer({ src, poster, alt, type = "image", className = "", autoPlay = false }: Props) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(autoPlay);

  if (type === "image") {
    return (
      <picture className={className}>
        <img src={src} alt={alt ?? ""} loading="lazy" decoding="async"
          className="w-full h-full object-cover" />
      </picture>
    );
  }

  if (type === "video") {
    return (
      <div className={`relative ${className}`}>
        <video
          src={src} poster={poster} muted={muted} autoPlay={autoPlay} loop playsInline
          className="w-full h-full object-cover"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        />
        <button onClick={() => setMuted((m) => !m)}
          className="absolute bottom-3 right-3 bg-foreground/60 text-background p-2 rounded-full hover:bg-foreground/80 transition">
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  // audio
  return (
    <div className={`flex items-center gap-2 p-3 rounded-md bg-card border border-border ${className}`}>
      <audio
        src={src} controls
        className="w-full" preload="metadata"
        muted={muted}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      />
    </div>
  );
}
