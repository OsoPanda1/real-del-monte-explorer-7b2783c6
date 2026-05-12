
-- ============================================================
-- Bloque 1: admin audit + RLS endurecido
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID,
  target_user_id UUID,
  target_email TEXT,
  action TEXT NOT NULL CHECK (action IN ('granted','revoked','denied','bootstrap')),
  reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin lee audit" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
-- No insert/update/delete policy => solo service_role escribe.

-- Endurecer admin_allowlist: quitar lectura abierta a authenticated
DROP POLICY IF EXISTS "auth read allowlist" ON public.admin_allowlist;
DROP POLICY IF EXISTS "admins manage allowlist" ON public.admin_allowlist;
CREATE POLICY "Admin gestiona allowlist" ON public.admin_allowlist
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Función segura para chequeo de allowlist sin exponer la tabla
CREATE OR REPLACE FUNCTION public.is_email_allowlisted(_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.admin_allowlist WHERE lower(email)=lower(trim(_email))) $$;

-- ============================================================
-- Bloque 3: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  kind TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_notif_user_created ON public.notifications(user_id, created_at DESC);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuario ve sus notificaciones" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Usuario marca leídas" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admin gestiona notif" ON public.notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Trigger: nueva decisión emitida → notificar admins
CREATE OR REPLACE FUNCTION public.notify_admins_new_decision()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'emitted' THEN
    INSERT INTO public.notifications (user_id, title, body, kind, link, metadata)
    SELECT ur.user_id, 'Nueva decisión Isabella',
      COALESCE(LEFT(NEW.query, 140),'(sin query)'), 'decision', '/guardian',
      jsonb_build_object('trace_id', NEW.trace_id, 'decision_id', NEW.id)
    FROM public.user_roles ur WHERE ur.role='admin';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_notify_admins_new_decision ON public.pdos_decisions;
CREATE TRIGGER trg_notify_admins_new_decision
AFTER INSERT ON public.pdos_decisions
FOR EACH ROW EXECUTE FUNCTION public.notify_admins_new_decision();

-- ============================================================
-- Bloque 5: gamificación
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gamification_points (
  user_id UUID PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  streak_days INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.gamification_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Puntos públicos (leaderboard)" ON public.gamification_points FOR SELECT USING (true);
CREATE POLICY "Admin gestiona puntos" ON public.gamification_points FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.gamification_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  kind TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gam_events_user ON public.gamification_events(user_id, created_at DESC);
ALTER TABLE public.gamification_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eventos visibles dueño" ON public.gamification_events FOR SELECT
  USING (auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Usuario inserta sus eventos" ON public.gamification_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=user_id);

CREATE TABLE IF NOT EXISTS public.gamification_badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  required_xp INTEGER NOT NULL DEFAULT 0,
  rarity TEXT NOT NULL DEFAULT 'common'
);
ALTER TABLE public.gamification_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges públicos" ON public.gamification_badges FOR SELECT USING (true);
CREATE POLICY "Admin gestiona badges" ON public.gamification_badges FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id UUID NOT NULL,
  badge_id TEXT NOT NULL REFERENCES public.gamification_badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges usuario públicos" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Sistema otorga badges" ON public.user_badges FOR INSERT TO authenticated
  WITH CHECK (auth.uid()=user_id OR public.has_role(auth.uid(),'admin'));

-- award_points: actualiza puntos y nivel (1 nivel cada 500 xp)
CREATE OR REPLACE FUNCTION public.award_points(_user_id UUID, _kind TEXT, _points INTEGER, _metadata JSONB DEFAULT '{}'::jsonb)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE old_lvl INTEGER; new_xp_v INTEGER; new_lvl INTEGER;
BEGIN
  INSERT INTO public.gamification_events(user_id, kind, points, metadata)
    VALUES (_user_id, _kind, _points, _metadata);
  INSERT INTO public.gamification_points(user_id, xp, level)
    VALUES (_user_id, GREATEST(_points,0), 1)
  ON CONFLICT (user_id) DO UPDATE
    SET xp = public.gamification_points.xp + EXCLUDED.xp,
        updated_at = now()
  RETURNING gamification_points.xp INTO new_xp_v;
  SELECT level INTO old_lvl FROM public.gamification_points WHERE user_id=_user_id;
  new_lvl := GREATEST(1, 1 + (new_xp_v / 500));
  IF new_lvl <> old_lvl THEN
    UPDATE public.gamification_points SET level=new_lvl WHERE user_id=_user_id;
  END IF;
  RETURN QUERY SELECT new_xp_v, new_lvl, (new_lvl > old_lvl);
END $$;

INSERT INTO public.gamification_badges(id,name,description,icon,required_xp,rarity) VALUES
  ('newcomer','Recién Llegado','Te uniste al Nodo Cero','sparkles',0,'common'),
  ('first_business','Comerciante','Registraste tu primer comercio','store',50,'common'),
  ('first_decision','Guardian Aprendiz','Revisaste tu primera decisión','shield',100,'rare'),
  ('cattleya_supporter','Patrocinador Cattleya','Realizaste tu primer pago','heart',150,'rare'),
  ('explorer','Explorador','Visitaste 10 secciones','compass',200,'rare'),
  ('sovereign','Soberano','Alcanzaste 1000 XP','crown',1000,'epic'),
  ('legend','Leyenda RDM','Alcanzaste 5000 XP','flame',5000,'legendary')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Storage bucket media
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media','media',true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Media pública lectura" ON storage.objects FOR SELECT USING (bucket_id='media');
CREATE POLICY "Auth sube media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id='media');
CREATE POLICY "Owner edita media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id='media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Owner borra media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id='media' AND auth.uid()::text = (storage.foldername(name))[1]);
