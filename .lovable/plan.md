# Plan de implementación — Fase Refuerzo Total

Voy a dividir el trabajo en 6 bloques. Los ejecuto en orden, en una sola pasada larga, salvo que rechaces algún bloque.

## Bloque 1 — Seguridad y auditoría de admin (migración)
- Nueva tabla `admin_audit_log` (append-only): `actor_id`, `target_user_id`, `target_email`, `action` (`granted`|`revoked`|`denied`|`bootstrap`), `reason`, `metadata`, `created_at`. RLS: solo admin lee; insert solo vía `service_role` desde la edge function.
- Endurecer RLS de `admin_allowlist`:
  - quitar `auth read allowlist` (cualquier autenticado podía leer correos) → solo admin lee.
  - mantener `admins manage allowlist`.
- Función `public.is_email_allowlisted(_email text)` `SECURITY DEFINER` para que la edge la consulte sin exponer la tabla.
- Edge `promote-admin` reescrita: idempotente (no inserta dup), normaliza email (`lower(trim())`), registra cada intento (granted/denied/bootstrap) en `admin_audit_log`, retorna `{ok, reason, audit_id}`.
- Nueva edge `revoke-admin` (solo admin) que también queda auditada.

## Bloque 2 — Guardian y DM-X7 con paginación/filtros server-side
- Nueva edge `guardian-list`: recibe `{tab: 'pending'|'history', trace_id?, status?, from?, to?, page, page_size, query?}`, devuelve `{rows, total, page, page_size}`. Usa `service_role` y valida `has_role(admin)` por JWT del caller.
- Nueva edge `executions-list` análoga para `pdos_executions` (trace_id, action/task, status, fechas, paginación).
- `Guardian.tsx`:
  - elimina filtrado/paginación en cliente, llama `guardian-list`.
  - export CSV/PDF con dos botones: "Página actual" y "Todos los filtrados" (segundo hace request con `page_size` grande server-side, máx 5000).
  - PDF/CSV incluyen `query` completo (sin truncar) y `reviewed_at` ISO.
- `DmX7.tsx` historial:
  - usa `executions-list` con búsqueda por `trace_id`, `task`, `status`, fechas, paginación.
  - botón "Repetir": abre `AlertDialog` de confirmación. Al confirmar, llama gateway con un `replay_of` en payload; el gateway genera **nuevo `trace_id`** y registra entrada en `pdos_executions` con `metadata.replay_of = original_trace_id`. Mostrar el nuevo trace_id en toast con link.

## Bloque 3 — Multimedia (imágenes, audio, video) y notificaciones
- Bucket `media` (público lectura, admin/owner escribe) vía migración.
- Componente `<MediaPlayer />` (image/audio/video lazy, con `<picture>` y `loading="lazy"`).
- Hero/landing: imagen generada para RDM + audio ambiental opcional silenciado por defecto, video corto en `/` (poster + autoplay muted loop).
- Sistema de notificaciones:
  - Tabla `notifications` (`user_id`, `title`, `body`, `kind`, `link`, `read_at`).
  - Realtime subscribe en hook `useNotifications`.
  - `<NotificationsBell />` en `CompassNav`, panel con marcar leído / marcar todas.
  - Disparadores: nueva decisión emitida → notifica a admins; replay → notifica al actor.

## Bloque 4 — Tutorial / onboarding
- Página `/tutorial` con pasos (Territorio → Ecosistema → Gobernanza → Cattleya → Guardian → DM-X7).
- `useFirstVisit` muestra modal de bienvenida con CTA "Hacer recorrido" la primera vez (persiste en `localStorage` + `profiles.metadata`).
- Tour interactivo ligero (sin dep externa): overlay con `framer-motion` ya disponible vía animaciones tailwind, paso a paso resaltando elementos por `data-tour`.

## Bloque 5 — Gamificación reforzada
- Tablas `gamification_points` (user_id, points, level, xp), `gamification_events` (kind, points, metadata), `gamification_badges` (catálogo) y `user_badges`.
- Función `award_points(_user, _kind, _points)` con trigger que recalcula nivel.
- Página `/logros` rediseñada:
  - barra XP animada (Tailwind keyframes ya configurados, + nuevas `progress-fill`, `badge-pop`, `confetti`).
  - badges con hover-scale, tilt y glow; estados locked/unlocked.
  - leaderboard top 20 con avatares y animación de entrada en cascada.
  - toast de "subiste de nivel" con animación scale-in + sonido suave.
- Hook `useGamification` que dispara eventos: registro, primer comercio, primera decisión revisada, primer pago Cattleya, etc.

## Bloque 6 — Auth y build
- Revisar `Auth.tsx`: añadir Google OAuth, validación zod, mensajes de error claros, link "olvidé contraseña" + página `/reset-password` funcional.
- Asegurar `emailRedirectTo: window.location.origin` en signUp.
- Pasar `bunx tsc --noEmit` mental: revisar todos los imports nuevos, regenerar `types.ts` se hace solo tras migraciones.
- Unificar `App.tsx`, `CompassNav.tsx` con nuevas rutas (`/tutorial`, `/logros`, `/reset-password`).

---

## Detalles técnicos clave

### Paginación server-side (patrón)
```ts
const from = (page-1)*page_size; const to = from + page_size - 1;
let q = supabase.from('pdos_decisions').select('*', { count: 'exact' }).range(from,to);
if (status) q = q.eq('status', status);
if (trace_id) q = q.ilike('trace_id::text', `%${trace_id}%`);
if (from_date) q = q.gte('created_at', from_date);
if (to_date) q = q.lte('created_at', to_date);
```

### Replay con nuevo trace_id
- Frontend: `await callGateway('kernel.event.replay', { original_trace_id, action, payload })`
- Gateway crea nueva ejecución con `trace_id = gen_random_uuid()` y `metadata.replay_of = original_trace_id`, después invoca el `action` original.

### admin_audit_log RLS
- `SELECT`: `has_role(auth.uid(),'admin')`
- `INSERT/UPDATE/DELETE`: nadie por RLS; solo `service_role` (bypass).

---

## Lo que NO incluyo (dímelo si lo quieres)
- Push notifications (web push) — solo in-app realtime.
- Tour con librería externa (driver.js / shepherd) — implementación propia.
- Sonidos personalizados subidos por ti — uso uno libre embebido pequeño.

¿Procedo con los 6 bloques completos?
