/**
 * Edge Function: omniscient-watcher (Vigia 24/7)
 * PRD: RF12 — Varredura proativa do escritório
 *
 * Corrige as colunas e enums para refletir o schema real:
 *   - conversations.status = 'aberta' (não 'open')
 *   - deadlines table (JOIN com cases), não cases.next_deadline
 *   - webhook_logs.status = 'received' (não processed = false)
 *   - invoices.contact_id (não client_id), invoices.amount (não total_amount)
 *   - invoices.invoice_status in ('vencida')
 *
 * Modelo LLM: minimax-m2.7:cloud (via Ollama VPS)
 *
 * Deploy:
 *   npx supabase functions deploy omniscient-watcher --project-ref voosldmiiwxzfofazviq
 *   Ou via MCP: deploy_edge_function(...)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const alerts: string[] = [];
    const now = new Date().toISOString();

    // ─── SCAN 1: Conversas Abertas sem Resposta ─────────────────────
    // Busca conversas com status 'aberta' que não receberam reply há mais de 2h
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const { data: openConversations } = await supabase
      .from("conversations")
      .select("id, contact_id, updated_at")
      .eq("status", "aberta")
      .lt("updated_at", twoHoursAgo)
      .limit(20);

    if (openConversations && openConversations.length > 0) {
      alerts.push(
        `⚠️ ${openConversations.length} conversa(s) abertas sem resposta há +2h`
      );
    }

    // ─── SCAN 2: Prazos Vencendo em 48h ─────────────────────────────
    // Usa a tabela 'deadlines' com JOIN em 'cases' (não cases.next_deadline)
    const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    const { data: urgentDeadlines } = await supabase
      .from("deadlines")
      .select(`
        id, title, end_date, deadline_type,
        cases:case_id(id, title, case_number)
      `)
      .gte("end_date", now)
      .lte("end_date", in48h)
      .eq("status", "pendente")
      .limit(20);

    if (urgentDeadlines && urgentDeadlines.length > 0) {
      alerts.push(
        `🔴 ${urgentDeadlines.length} prazo(s) processual(is) vencendo em 48h`
      );
    }

    // ─── SCAN 3: Webhook Logs Não Processados ───────────────────────
    // Usa webhook_logs.status = 'received' (não processed = false)
    const { data: pendingWebhooks } = await supabase
      .from("webhook_logs")
      .select("id, event_type, created_at")
      .eq("status", "received")
      .limit(50);

    if (pendingWebhooks && pendingWebhooks.length > 0) {
      alerts.push(
        `📩 ${pendingWebhooks.length} webhook(s) pendente(s) de processamento`
      );

      // Mark as processed
      const ids = pendingWebhooks.map((w: any) => w.id);
      await supabase
        .from("webhook_logs")
        .update({ status: "processed" })
        .in("id", ids);
    }

    // ─── SCAN 4: Faturas Vencidas ───────────────────────────────────
    // Usa contact_id (não client_id), amount (não total_amount), invoice_status = 'vencida'
    const { data: overdueInvoices } = await supabase
      .from("invoices")
      .select("id, contact_id, amount, due_date, invoice_status")
      .eq("invoice_status", "vencida")
      .is("deleted_at", null)
      .limit(20);

    if (overdueInvoices && overdueInvoices.length > 0) {
      const totalOverdue = overdueInvoices.reduce(
        (sum: number, inv: any) => sum + Number(inv.amount || 0),
        0
      );
      alerts.push(
        `💰 ${overdueInvoices.length} fatura(s) vencida(s) — Total: R$ ${totalOverdue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
      );
    }

    // ─── REGISTRAR EXECUÇÃO EM AUDIT_LOGS ───────────────────────────
    if (alerts.length > 0) {
      await supabase.from("audit_logs").insert({
        action: "watcher_scan",
        entity_type: "system",
        entity_id: null,
        new_data: { alerts, scanned_at: now }
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        scanned_at: now,
        alerts_count: alerts.length,
        alerts,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
