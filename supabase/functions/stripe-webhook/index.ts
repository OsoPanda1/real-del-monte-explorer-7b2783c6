// deno-lint-ignore-file
// Webhook Stripe → sincroniza memberships automáticamente (sin pedir al usuario "sincronizar")
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) return new Response("stripe_not_configured", { status: 500, headers: corsHeaders });

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    if (webhookSecret) {
      const sig = req.headers.get("stripe-signature") || "";
      event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
    } else {
      event = JSON.parse(raw) as Stripe.Event;
    }
  } catch (e) {
    return new Response(`bad_signature: ${e}`, { status: 400, headers: corsHeaders });
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const upsertFromSubscription = async (sub: Stripe.Subscription) => {
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
    let userId = (customer.metadata as any)?.user_id as string | undefined;
    if (!userId && customer.email) {
      const { data } = await admin.from("memberships").select("user_id").eq("provider_customer_id", customerId).maybeSingle();
      userId = data?.user_id;
    }
    if (!userId) return;
    const active = ["active", "trialing"].includes(sub.status);
    await admin.from("memberships").upsert({
      user_id: userId,
      status: active ? "active" : sub.status === "past_due" ? "past_due" : "inactive",
      provider: "stripe",
      provider_customer_id: customerId,
      provider_subscription_id: sub.id,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
    }, { onConflict: "user_id" });
  };

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.subscription) {
          const sub = await stripe.subscriptions.retrieve(s.subscription as string);
          await upsertFromSubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "invoice.payment_succeeded":
      case "invoice.payment_failed": {
        const obj: any = event.data.object;
        const subId = obj.subscription || obj.id;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId as string);
          await upsertFromSubscription(sub);
        }
        break;
      }
    }
    return new Response(JSON.stringify({ received: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("webhook_error", e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
