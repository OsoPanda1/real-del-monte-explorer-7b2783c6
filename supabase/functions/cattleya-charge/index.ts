// Cattleya Pay — Stripe Checkout Session con idempotencia + ledger
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return json({ ok: false, error: "STRIPE_SECRET_KEY no configurada" }, 500);

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { product, plan, amount_cents, currency = "mxn", operation_id, success_url, cancel_url } = await req.json();
    if (!product || !amount_cents || !operation_id) {
      return json({ ok: false, error: "product, amount_cents y operation_id requeridos" }, 400);
    }

    // Idempotencia: si ya existe operation_id, devolver lo previo
    const { data: existing } = await supabase
      .from("cattleya_payment_ledger")
      .select("*")
      .eq("operation_id", operation_id)
      .maybeSingle();
    if (existing && existing.status !== "failed") {
      return json({ ok: true, idempotent: true, ledger: existing });
    }

    // Identificar usuario si viene token
    let userId: string | null = null;
    const auth = req.headers.get("Authorization");
    if (auth) {
      const { data: { user } } = await supabase.auth.getUser(auth.replace("Bearer ", ""));
      userId = user?.id ?? null;
    }

    const session = await stripe.checkout.sessions.create({
      mode: plan ? "subscription" : "payment",
      line_items: [{
        price_data: {
          currency,
          product_data: { name: product },
          unit_amount: amount_cents,
          ...(plan ? { recurring: { interval: "month" } } : {}),
        },
        quantity: 1,
      }],
      success_url: success_url ?? `${req.headers.get("origin")}/propuesta?ok=1`,
      cancel_url: cancel_url ?? `${req.headers.get("origin")}/propuesta?cancel=1`,
      client_reference_id: operation_id,
    });

    const { data: ledger } = await supabase
      .from("cattleya_payment_ledger")
      .insert({
        operation_id,
        user_id: userId,
        amount_cents,
        currency,
        product,
        plan: plan ?? null,
        provider: "stripe",
        provider_session_id: session.id,
        status: "pending",
        metadata: { url: session.url },
      })
      .select()
      .single();

    return json({ ok: true, url: session.url, session_id: session.id, ledger });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
