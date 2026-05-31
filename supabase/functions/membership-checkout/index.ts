// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "auth_required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user?.email) return new Response(JSON.stringify({ error: "auth_required" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return new Response(JSON.stringify({ error: "stripe_not_configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // find or create customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customerId = customers.data[0]?.id ?? (await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } })).id;

    const origin = req.headers.get("origin") ?? "https://rdm.lovable.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{
        price_data: {
          currency: "mxn",
          product_data: { name: "Habitante Digital RDM", description: "Membresía mensual RDM Digital — juegos y recompensas" },
          unit_amount: 12900,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      success_url: `${origin}/membresia?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/membresia?status=cancel`,
      metadata: { user_id: user.id },
    });

    // upsert membership pending
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await admin.from("memberships").upsert({
      user_id: user.id,
      status: "pending",
      provider: "stripe",
      provider_customer_id: customerId,
      metadata: { last_session: session.id },
    }, { onConflict: "user_id" });

    return new Response(JSON.stringify({ url: session.url }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
