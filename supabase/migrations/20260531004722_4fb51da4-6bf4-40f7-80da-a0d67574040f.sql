
-- MEMBERSHIPS
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan TEXT NOT NULL DEFAULT 'habitante_digital',
  price_cents INTEGER NOT NULL DEFAULT 12900,
  currency TEXT NOT NULL DEFAULT 'mxn',
  provider TEXT NOT NULL DEFAULT 'stripe',
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.memberships TO authenticated;
GRANT ALL ON public.memberships TO service_role;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuario ve su membresia" ON public.memberships FOR SELECT TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gestiona memberships" ON public.memberships FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_memberships_updated BEFORE UPDATE ON public.memberships FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RDM COINS WALLET
CREATE TABLE public.rdm_coins_wallet (
  user_id UUID NOT NULL PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0,
  total_earned INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rdm_coins_wallet TO authenticated;
GRANT ALL ON public.rdm_coins_wallet TO service_role;
ALTER TABLE public.rdm_coins_wallet ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallet propio" ON public.rdm_coins_wallet FOR SELECT TO authenticated USING (auth.uid()=user_id OR has_role(auth.uid(),'admin'));

-- COIN TRANSACTIONS
CREATE TABLE public.coin_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  kind TEXT NOT NULL,
  reference TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coin_transactions TO authenticated;
GRANT ALL ON public.coin_transactions TO service_role;
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tx propias" ON public.coin_transactions FOR SELECT TO authenticated USING (auth.uid()=user_id OR has_role(auth.uid(),'admin'));

-- GAME SESSIONS
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  game TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.game_sessions TO authenticated;
GRANT ALL ON public.game_sessions TO service_role;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sesiones propias" ON public.game_sessions FOR SELECT TO authenticated USING (auth.uid()=user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Insertar sesion" ON public.game_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid()=user_id);

-- TRIVIA QUESTIONS
CREATE TABLE public.trivia_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'historia',
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  difficulty INTEGER NOT NULL DEFAULT 1,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trivia_questions TO anon, authenticated;
GRANT ALL ON public.trivia_questions TO service_role;
ALTER TABLE public.trivia_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trivia publica" ON public.trivia_questions FOR SELECT USING (active=true);
CREATE POLICY "Admin gestiona trivia" ON public.trivia_questions FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- REWARDS CATALOG
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  cost_coins INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'gastronomia',
  image_url TEXT,
  stock INTEGER,
  partner TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.rewards TO anon, authenticated;
GRANT ALL ON public.rewards TO service_role;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rewards publicos" ON public.rewards FOR SELECT USING (active=true);
CREATE POLICY "Admin gestiona rewards" ON public.rewards FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- REDEMPTIONS
CREATE TABLE public.reward_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reward_id UUID NOT NULL REFERENCES public.rewards(id),
  cost_coins INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  redemption_code TEXT NOT NULL DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,10)),
  fulfilled_at TIMESTAMPTZ,
  fulfilled_by UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reward_redemptions TO authenticated;
GRANT ALL ON public.reward_redemptions TO service_role;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mis canjes" ON public.reward_redemptions FOR SELECT TO authenticated USING (auth.uid()=user_id OR has_role(auth.uid(),'admin'));
CREATE POLICY "Admin gestiona canjes" ON public.reward_redemptions FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- HELPERS
CREATE OR REPLACE FUNCTION public.is_member_active(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS(SELECT 1 FROM public.memberships WHERE user_id=_user_id AND status='active' AND (current_period_end IS NULL OR current_period_end > now()))
$$;

-- AWARD COINS RPC
CREATE OR REPLACE FUNCTION public.award_coins(_user_id uuid, _amount int, _kind text, _reference text DEFAULT NULL, _metadata jsonb DEFAULT '{}'::jsonb)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE new_balance int;
BEGIN
  INSERT INTO public.rdm_coins_wallet(user_id, balance, total_earned, total_spent)
    VALUES (_user_id, GREATEST(_amount,0), GREATEST(_amount,0), 0)
  ON CONFLICT (user_id) DO UPDATE SET
    balance = public.rdm_coins_wallet.balance + _amount,
    total_earned = public.rdm_coins_wallet.total_earned + GREATEST(_amount,0),
    total_spent = public.rdm_coins_wallet.total_spent + GREATEST(-_amount,0),
    updated_at = now()
  RETURNING balance INTO new_balance;
  INSERT INTO public.coin_transactions(user_id, amount, kind, reference, metadata)
    VALUES (_user_id, _amount, _kind, _reference, _metadata);
  RETURN new_balance;
END $$;

-- REDEEM REWARD RPC
CREATE OR REPLACE FUNCTION public.redeem_reward(_reward_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _uid uuid; _r record; _bal int; _red_id uuid; _code text;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN RAISE EXCEPTION 'auth_required'; END IF;
  IF NOT public.is_member_active(_uid) THEN RAISE EXCEPTION 'membership_required'; END IF;
  SELECT * INTO _r FROM public.rewards WHERE id=_reward_id AND active=true;
  IF NOT FOUND THEN RAISE EXCEPTION 'reward_not_found'; END IF;
  SELECT balance INTO _bal FROM public.rdm_coins_wallet WHERE user_id=_uid;
  IF COALESCE(_bal,0) < _r.cost_coins THEN RAISE EXCEPTION 'insufficient_coins'; END IF;
  PERFORM public.award_coins(_uid, -_r.cost_coins, 'redeem', _r.name, jsonb_build_object('reward_id', _r.id));
  INSERT INTO public.reward_redemptions(user_id, reward_id, cost_coins)
    VALUES (_uid, _r.id, _r.cost_coins) RETURNING id, redemption_code INTO _red_id, _code;
  RETURN jsonb_build_object('id', _red_id, 'code', _code, 'reward', _r.name);
END $$;

-- SUBMIT GAME SCORE RPC
CREATE OR REPLACE FUNCTION public.submit_game_score(_game text, _score int, _duration int DEFAULT NULL, _metadata jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE _uid uuid; _coins int; _xp int; _bal int;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN RAISE EXCEPTION 'auth_required'; END IF;
  IF NOT public.is_member_active(_uid) THEN RAISE EXCEPTION 'membership_required'; END IF;
  _coins := LEAST(GREATEST(_score / 10, 1), 200);
  _xp := LEAST(GREATEST(_score / 5, 5), 500);
  INSERT INTO public.game_sessions(user_id, game, score, coins_earned, xp_earned, duration_seconds, metadata)
    VALUES (_uid, _game, _score, _coins, _xp, _duration, _metadata);
  _bal := public.award_coins(_uid, _coins, 'game', _game, jsonb_build_object('score',_score));
  PERFORM public.award_points(_uid, 'game_'||_game, _xp, jsonb_build_object('score',_score));
  RETURN jsonb_build_object('coins_earned',_coins,'xp_earned',_xp,'balance',_bal);
END $$;
