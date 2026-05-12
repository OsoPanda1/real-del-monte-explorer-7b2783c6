
-- Revoke execute on security definer fns from anon/authenticated
REVOKE EXECUTE ON FUNCTION public.is_email_allowlisted(TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.award_points(UUID, TEXT, INTEGER, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_new_decision() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- has_role debe seguir disponible para RLS (auth.uid()) — authenticated lo usa en políticas
GRANT EXECUTE ON FUNCTION public.has_role(UUID, app_role) TO anon, authenticated;

-- Restringir listado del bucket media: leer solo si conoces la ruta no implica listar el bucket
DROP POLICY IF EXISTS "Media pública lectura" ON storage.objects;
CREATE POLICY "Media lectura por path" ON storage.objects FOR SELECT
  USING (bucket_id='media' AND name IS NOT NULL);
-- Opcional: prohibimos LIST a anon (sólo authenticated puede listar)
-- (Mantener público lectura por path es suficiente para mostrar archivos sin listing arbitrario.)
