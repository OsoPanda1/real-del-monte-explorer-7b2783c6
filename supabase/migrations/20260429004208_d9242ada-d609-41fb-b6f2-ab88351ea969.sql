-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'comerciante', 'ciudadano');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles públicos" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuario edita su perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuario inserta su perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Roles visibles por dueño" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gestiona roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger para crear perfil + rol ciudadano
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'ciudadano');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Federaciones
CREATE TYPE public.federacion AS ENUM ('hospedaje','gastronomica','plateria','comercio','guias','cultura','inteligencia');

-- Comercios (directorio)
CREATE TABLE public.comercios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  federacion federacion NOT NULL,
  direccion TEXT,
  telefono TEXT,
  whatsapp TEXT,
  instagram TEXT,
  sitio_web TEXT,
  imagen_url TEXT,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  plan TEXT NOT NULL DEFAULT 'basico',
  verificado BOOLEAN NOT NULL DEFAULT false,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.comercios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comercios activos públicos" ON public.comercios FOR SELECT USING (activo = true OR auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Comerciantes crean sus comercios" ON public.comercios FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Dueño edita su comercio" ON public.comercios FOR UPDATE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Dueño borra su comercio" ON public.comercios FOR DELETE USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- Eventos
CREATE TABLE public.eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TIMESTAMPTZ NOT NULL,
  fecha_fin TIMESTAMPTZ,
  ubicacion TEXT,
  imagen_url TEXT,
  categoria TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  publicado BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eventos públicos" ON public.eventos FOR SELECT USING (publicado = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admin gestiona eventos" ON public.eventos FOR ALL USING (public.has_role(auth.uid(),'admin'));

-- Métricas Nodo Cero (snapshot público de lectura)
CREATE TABLE public.metricas_nodo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metrica TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  unidad TEXT,
  capturado_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.metricas_nodo ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Métricas públicas" ON public.metricas_nodo FOR SELECT USING (true);
CREATE POLICY "Admin escribe métricas" ON public.metricas_nodo FOR ALL USING (public.has_role(auth.uid(),'admin'));
