import { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function NotificationsBell() {
  const { user } = useAuth();
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-8 right-40 z-50 w-12 h-12 flex items-center justify-center text-foreground hover:text-primary transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center animate-badge-pop">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <p className="font-display text-xs tracking-widest">NOTIFICACIONES</p>
          {unreadCount > 0 && (
            <Button size="sm" variant="ghost" onClick={markAllRead}>
              <CheckCheck className="h-3 w-3 mr-1" /> Marcar todo
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Sin notificaciones</p>
          ) : items.map((n) => (
            <div key={n.id} className={`px-4 py-3 border-b border-border/50 ${!n.read_at ? "bg-primary/5" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(n.created_at).toLocaleString("es-MX")}
                    </span>
                    {n.link && (
                      <Link to={n.link} onClick={() => { markRead(n.id); setOpen(false); }}
                        className="text-[10px] text-primary hover:underline">
                        Abrir →
                      </Link>
                    )}
                  </div>
                </div>
                {!n.read_at && (
                  <button onClick={() => markRead(n.id)} className="text-muted-foreground hover:text-primary">
                    <Check className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
