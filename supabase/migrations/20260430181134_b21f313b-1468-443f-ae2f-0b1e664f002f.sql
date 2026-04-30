-- ============================================
-- FASE A: PDOS Core + Cattleya Payment Ledger
-- ============================================

-- Knowledge Graph nodes
CREATE TABLE public.pdos_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL DEFAULT 'concept',
  title TEXT NOT NULL,
  description TEXT,
  importance INT NOT NULL DEFAULT 50,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pdos_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node UUID NOT NULL REFERENCES public.pdos_nodes(id) ON DELETE CASCADE,
  to_node UUID NOT NULL REFERENCES public.pdos_nodes(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  weight NUMERIC NOT NULL DEFAULT 1.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pdos_edges_from ON public.pdos_edges(from_node);
CREATE INDEX idx_pdos_edges_to ON public.pdos_edges(to_node);

-- Catálogo de repositorios del ecosistema
CREATE TABLE public.pdos_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  language TEXT,
  stars INT NOT NULL DEFAULT 0,
  forks INT NOT NULL DEFAULT 0,
  score NUMERIC NOT NULL DEFAULT 0,
  role TEXT,
  highlight BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Bitácora append-only de ejecuciones del kernel (Event Log simplificado)
CREATE TABLE public.pdos_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id TEXT NOT NULL,
  stream_version BIGINT NOT NULL,
  task TEXT NOT NULL,
  domain TEXT NOT NULL DEFAULT 'kernel',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  duration_ms INT,
  trace_id UUID NOT NULL DEFAULT gen_random_uuid(),
  event_hash TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (stream_id, stream_version)
);

CREATE INDEX idx_pdos_exec_stream ON public.pdos_executions(stream_id, stream_version);
CREATE INDEX idx_pdos_exec_trace ON public.pdos_executions(trace_id);
CREATE INDEX idx_pdos_exec_created ON public.pdos_executions(created_at DESC);

-- Ledger de decisiones de Isabella con explainability
CREATE TABLE public.pdos_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trace_id UUID NOT NULL DEFAULT gen_random_uuid(),
  query TEXT,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence NUMERIC NOT NULL DEFAULT 0,
  rule_version TEXT NOT NULL DEFAULT 'v1.0',
  explanation JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'emitted', -- emitted | approved | denied
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pdos_decisions_trace ON public.pdos_decisions(trace_id);
CREATE INDEX idx_pdos_decisions_status ON public.pdos_decisions(status);

-- Cattleya Payment Ledger (idempotente)
CREATE TABLE public.cattleya_payment_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_id TEXT UNIQUE NOT NULL, -- idempotency key
  user_id UUID,
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'mxn',
  product TEXT NOT NULL,
  plan TEXT,
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_session_id TEXT,
  provider_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | succeeded | failed | refunded
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  retry_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cattleya_user ON public.cattleya_payment_ledger(user_id);
CREATE INDEX idx_cattleya_status ON public.cattleya_payment_ledger(status);

-- ============================================
-- RLS
-- ============================================
ALTER TABLE public.pdos_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdos_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdos_repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdos_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdos_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cattleya_payment_ledger ENABLE ROW LEVEL SECURITY;

-- Knowledge Graph: lectura pública, escritura admin
CREATE POLICY "Nodes públicos" ON public.pdos_nodes FOR SELECT USING (true);
CREATE POLICY "Admin gestiona nodes" ON public.pdos_nodes FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Edges públicos" ON public.pdos_edges FOR SELECT USING (true);
CREATE POLICY "Admin gestiona edges" ON public.pdos_edges FOR ALL USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Repos públicos" ON public.pdos_repos FOR SELECT USING (true);
CREATE POLICY "Admin gestiona repos" ON public.pdos_repos FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Executions: lectura pública (transparencia), escritura solo via service-role
CREATE POLICY "Executions públicas" ON public.pdos_executions FOR SELECT USING (true);
CREATE POLICY "Admin gestiona executions" ON public.pdos_executions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Decisions: lectura pública (auditabilidad), revisión solo admin
CREATE POLICY "Decisions públicas" ON public.pdos_decisions FOR SELECT USING (true);
CREATE POLICY "Admin revisa decisions" ON public.pdos_decisions FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gestiona decisions" ON public.pdos_decisions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Cattleya: el dueño ve sus pagos, admin todos
CREATE POLICY "Usuario ve sus pagos" ON public.cattleya_payment_ledger FOR SELECT
  USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gestiona pagos" ON public.cattleya_payment_ledger FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Trigger updated_at para cattleya
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER cattleya_updated_at BEFORE UPDATE ON public.cattleya_payment_ledger
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- SEED: Knowledge Graph inicial
-- ============================================
INSERT INTO public.pdos_nodes (slug, type, title, description, importance) VALUES
  ('tamv-core', 'system', 'TAMV Core', 'Núcleo civilizatorio del ecosistema', 100),
  ('isabella', 'system', 'Isabella IA', 'Decision Engine explicable (XAI)', 95),
  ('nodo-cero', 'identity', 'Nodo Cero', 'Identidad raíz soberana', 100),
  ('rdm-digital', 'system', 'RDM Digital OS', 'Sistema operativo territorial Real del Monte', 90),
  ('bookpi', 'system', 'BookPI / DataGit', 'Ledger inmutable con sellado SHA-256', 90),
  ('phoenix', 'system', 'Phoenix Protocol', 'Resiliencia P2P 33% tolerancia', 88),
  ('cattleya-pay', 'system', 'Cattleya Pay', 'Economía transaccional con idempotencia', 85),
  ('dekateotl', 'governance', 'Dekateotl', 'Gobernanza ética XAI', 92),
  ('anubis-sentinel', 'security', 'Anubis Sentinel', 'Seguridad post-cuántica IAM', 95),
  ('kaos', 'experience', 'KAOS', 'XR sensorialidad WCAG 2.2 AA', 80),
  ('chronos', 'orchestration', 'Chronos Planning', 'Gestión de rutas territoriales', 78),
  ('mdd-tamv', 'economy', 'MDD / TAMV Credits', 'Modelo económico 20/30/50', 85),
  ('dm-x7', 'gateway', 'DM-X7 Gateway', 'Gateway unificado de servicios', 88),
  ('event-store', 'kernel', 'Event Store', 'Append-only log con replay', 90),
  ('guardian-console', 'governance', 'Guardian Console', 'HITL para decisiones críticas', 85)
ON CONFLICT (slug) DO NOTHING;

-- Edges: relaciones del ecosistema
INSERT INTO public.pdos_edges (from_node, to_node, relation_type, weight)
SELECT a.id, b.id, rel, w FROM (VALUES
  ('tamv-core', 'isabella', 'orchestrates', 1.0),
  ('tamv-core', 'event-store', 'persists_via', 1.0),
  ('tamv-core', 'dm-x7', 'exposes_via', 0.9),
  ('isabella', 'pdos_decisions', 'writes_to', 1.0),
  ('isabella', 'guardian-console', 'escalates_to', 0.8),
  ('nodo-cero', 'tamv-core', 'roots', 1.0),
  ('rdm-digital', 'tamv-core', 'instantiates', 0.95),
  ('rdm-digital', 'chronos', 'uses', 0.7),
  ('bookpi', 'event-store', 'seals', 0.95),
  ('cattleya-pay', 'mdd-tamv', 'implements', 0.85),
  ('anubis-sentinel', 'dm-x7', 'protects', 0.9),
  ('phoenix', 'tamv-core', 'replicates', 0.85),
  ('dekateotl', 'isabella', 'governs', 0.95),
  ('kaos', 'rdm-digital', 'renders', 0.7)
) AS rel_data(from_slug, to_slug, rel, w)
JOIN public.pdos_nodes a ON a.slug = rel_data.from_slug
JOIN public.pdos_nodes b ON b.slug = rel_data.to_slug OR b.slug = 'isabella'
WHERE b.slug = rel_data.to_slug
ON CONFLICT DO NOTHING;