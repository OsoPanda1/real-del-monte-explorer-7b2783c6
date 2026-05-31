// deno-lint-ignore-file
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verifica el estado de la suscripción del usuario en Stripe y sincroniza memberships
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "auth_required" }), { status: 401, headers: corsHeaders });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return new Response(JSON.stringify({ error: "auth_required" }), { status: 401, headers: corsHeaders });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) return new Response(JSON.stringify({ active: false, error: "no_stripe" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = customers.data[0];
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    if (!customer) {
      await admin.from("memberships").upsert({ user_id: user.id, status: "inactive" }, { onConflict: "user_id" });
      return new Response(JSON.stringify({ active: false }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 5 });
    const active = subs.data.find(s => ["active","trialing"].includes(s.status));
    if (active) {
      await admin.from("memberships").upsert({
        user_id: user.id,
        status: "active",
        provider: "stripe",
        provider_customer_id: customer.id,
        provider_subscription_id: active.id,
        current_period_end: new Date(active.current_period_end * 1000).toISOString(),
        cancel_at_period_end: active.cancel_at_period_end,
      }, { onConflict: "user_id" });
      return new Response(JSON.stringify({ active: true, current_period_end: active.current_period_end }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    await admin.from("memberships").upsert({ user_id: user.id, status: "inactive", provider_customer_id: customer.id }, { onConflict: "user_id" });
    return new Response(JSON.stringify({ active: false }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
