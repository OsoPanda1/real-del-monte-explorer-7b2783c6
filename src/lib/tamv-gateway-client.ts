// Cliente unificado del DM-X7 Gateway.
import { supabase } from "@/integrations/supabase/client";

export interface GatewayResponse<T = unknown> {
  ok: boolean;
  action?: string;
  result?: T;
  error?: string;
  duration_ms?: number;
  new_trace_id?: string;
  replay_of?: string;
}

export async function callGatewayFull<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {},
  opts: { replay_of?: string } = {},
): Promise<GatewayResponse<T>> {
  const body: Record<string, unknown> = { action, payload };
  if (opts.replay_of) body.replay_of = opts.replay_of;
  const { data, error } = await supabase.functions.invoke("dm-x7-gateway", { body });
  if (error) throw error;
  const res = data as GatewayResponse<T>;
  if (!res.ok) throw new Error(res.error ?? "gateway error");
  return res;
}

export async function callGateway<T = unknown>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const res = await callGatewayFull<T>(action, payload);
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

export interface GuardianListReq {
  tab?: "pending" | "history";
  trace_id?: string;
  status?: string;
  query_text?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}
export async function listGuardian(req: GuardianListReq) {
  const { data, error } = await supabase.functions.invoke("guardian-list", { body: req });
  if (error) throw error;
  return data as { ok: boolean; rows: any[]; total: number; page: number; page_size: number };
}

export interface ExecListReq {
  trace_id?: string;
  task?: string;
  stream_id?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}
export async function listExecutions(req: ExecListReq) {
  const { data, error } = await supabase.functions.invoke("executions-list", { body: req });
  if (error) throw error;
  return data as { ok: boolean; rows: any[]; total: number; page: number; page_size: number };
}
