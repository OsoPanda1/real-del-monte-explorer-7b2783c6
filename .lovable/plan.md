# Plan: RDM Digital — Territorio Inteligente Vivo

Rediseño de navegación, gamificación jugable con recompensas reales y membresía de pago, alineado al ADN visual "patrimonio + niebla + datos + lujo discreto".

---

## 1. Reestructura de layout (shell global)

Modifico `src/App.tsx` para envolver todas las rutas privadas en un nuevo `TerritoryShell`:

- **Barra superior fija** con buscador global (`SearchOverlay` integrado como input persistente, no overlay) + `NotificationsBell` + avatar de usuario + indicador de membresía/XP.
- **Sidebar izquierdo retráctil tipo acordeón** usando shadcn `Sidebar` (`collapsible="icon"`) + `SidebarGroup` colapsables por categoría:
  - Territorio (Mapa, Calles, Rutas, Minas, Cementerio)
  - Patrimonio (Manifiesto, Leyendas, Blueprint)
  - Comunidad (Directorio, Eventos, Pastes, Nuevo Comercio)
  - Inteligencia (Atlas, Nexus, Isabella, PDOS Core, DM-X7)
  - Gobernanza (Guardian, Auditoría, Federaciones)
  - Juego (Logros, **Juegos**, **Recompensas**, **Membresía**)
- `SidebarTrigger` visible siempre en el header.
- `CompassNav` actual se retira (su contenido migra al nuevo Sidebar).

## 2. CSS fundacional `index.css`

Ya existen los tokens `--rdm-*` y gradientes narrativos solicitados. Añado:

- **Capa niebla animada** (`.fog-layer` ya existe — la promuevo a personaje global en el shell con un `<FogLayer />` montado en `TerritoryShell`).
- Nuevas keyframes solicitadas: `trail-reveal`, `heritage-glow`, `path-discovery`, `constellation-links`.
- `.heritage-glass` (piedra + vidrio + niebla + oro) reemplazando cualquier uso restante de glass corporativo.
- Elimino referencias a `scan-line`, `radar-marker`, `radar-ping` si aparecen en componentes.
- Mapeo tokens shadcn (`--background`, `--primary`, `--card`, etc.) a la paleta RDM para que todo componente UI herede el ADN sin clases custom.

## 3. Gamificación jugable (`/juegos`)

Nueva página `src/pages/Juegos.tsx` con **3 mini-juegos territoriales**:

1. **"Memoria de las Minas"** — memorama con imágenes de patrimonio (minas, pastes, calles). Premia 10–50 XP + monedas RDM.
2. **"Niebla de Real del Monte"** — quiz cronometrado sobre historia/gastronomía/leyendas (preguntas servidas desde tabla `trivia_questions`).
3. **"Ruta del Paste"** — mini-juego de trazado de ruta sobre cuadrícula territorial (canvas SVG), gana monedas por completar antes del límite.

Cada partida:
- Requiere membresía activa (si no, modal "Activa tu membresía").
- Registra en `game_sessions` (user_id, game, score, coins_earned, played_at).
- Suma a `gamification_points` existentes + a un nuevo wallet `rdm_coins`.

## 4. Catálogo de recompensas (`/recompensas`)

Nueva página + tabla `rewards`:

| Recompensa | Costo (monedas RDM) |
|---|---|
| 1 Paste artesanal | 200 |
| Refresco / Café | 150 |
| Comida en restaurante local | 800 |
| Cena para 2 | 1500 |
| Noche de hospedaje | 4000 |
| Fin de semana todo pagado | 15000 |

- Usuario canjea → se crea `reward_redemptions` (status: pending → fulfilled), genera código QR de canje.
- Solo miembros activos pueden canjear.

## 5. Membresía de pago (129 MXN/mes)

Nueva página `/membresia` con plan único **"Habitante Digital RDM" — $129 MXN/mes**.

- Tabla `memberships` (user_id, status, current_period_end, provider_subscription_id).
- Hook `useMembership()` que expone `isActive`.
- Bloqueo de juegos y canje de recompensas si `!isActive`.

**Procesador de pagos:** recomiendo **Stripe (built-in `enable_stripe_payments`)** porque MXN está soportado, suscripciones recurrentes son nativas, y no requiere que el usuario abra cuenta de Stripe propia. Antes de habilitar, ejecutaré `recommend_payment_provider`.

## 6. Backend (Lovable Cloud)

Migración con:
- `memberships` (RLS: usuario ve la suya, admin todas)
- `rdm_coins_wallet` (balance por user_id)
- `coin_transactions` (auditoría)
- `game_sessions`
- `trivia_questions` (semilla con 20 preguntas de Real del Monte)
- `rewards` (catálogo, lectura pública)
- `reward_redemptions` (RLS por user_id)
- Trigger `award_coins_after_game` que actualiza wallet + transaction
- Función `redeem_reward(reward_id)` SECURITY DEFINER que valida saldo + membresía

## 7. Detalles técnicos

- Sidebar acordeón: `SidebarProvider` en `TerritoryShell`, grupos con `Collapsible` y `defaultOpen` según ruta activa.
- Buscador superior: input controlado + `Command` (shadcn) en popover con resultados de rutas + corpus TAMV (`tamvCorpus.ts`).
- Juegos: Framer Motion para feedback (XP popups, monedas cayendo, confetti existente).
- Niebla global: `<FogLayer />` con `position: fixed; pointer-events: none; z-index: 1`.
- Animación `trail-reveal` aplicada a tarjetas de descubrimiento al entrar al viewport (IntersectionObserver).
- Edge function `stripe-create-subscription` + `stripe-webhook` para sincronizar `memberships`.

## Orden de ejecución

1. Migración DB (memberships, wallet, games, rewards, trivia seed).
2. `recommend_payment_provider` → `enable_stripe_payments` → producto suscripción 129 MXN.
3. `TerritoryShell` + Sidebar acordeón + buscador superior + FogLayer.
4. Refuerzo `index.css` (heritage-glass, trail-reveal, etc.) + mapeo shadcn → RDM.
5. Páginas: `Juegos.tsx`, `Recompensas.tsx`, `Membresia.tsx` + hook `useMembership`.
6. Edge functions Stripe + webhook + redeem_reward RPC.
7. Integración en navegación, gating por membresía, polish visual.

Confirma para proceder (o ajusta el procesador de pagos si prefieres Paddle).
