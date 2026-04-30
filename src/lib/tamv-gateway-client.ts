// Cliente unificado para llamar al DM-X7 Gateway desde el frontend.
import { supabase } from "@/integrations/supabase/client";

export interface GatewayResponse<T = unknown> {
  ok: boolean;
  action?: string;
  result?: T;
  error?: string;
  duration_ms?: number;
}

export async function callGateway<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const { data, error } = await supabase.functions.invoke("dm-x7-gateway", {
    body: { action, payload },
  });
  if (error) throw error;
  const res = data as GatewayResponse<T>;
  if (!res.ok) throw new Error(res.error ?? "gateway error");
  return res.result as T;
}

export async function askIsabella(query: string) {
  const { data, error } = await supabase.functions.invoke("isabella-core", {
    body: { query, op: "query" },
  });
  if (error) throw error;
  return data as {
    ok: boolean;
    trace_id: string;
    decisions: Array<{ type: string; message?: string; priority: number; [k: string]: unknown }>;
    confidence: number;
    explanation: Record<string, unknown>;
    context: { nodes: Array<{ slug: string; title: string }>; repos: Array<{ name: string }> };
  };
}

export async function startCattleyaCheckout(args: {
  product: string;
  amount_cents: number;
  plan?: string;
  currency?: string;
}) {
  const operation_id = `op_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const { data, error } = await supabase.functions.invoke("cattleya-charge", {
    body: { ...args, operation_id, success_url: `${window.location.origin}/propuesta?ok=1`, cancel_url: `${window.location.origin}/propuesta?cancel=1` },
  });
  if (error) throw error;
  return data as { ok: boolean; url?: string; session_id?: string; error?: string };
}
