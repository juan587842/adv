/**
 * Edge Function: evolution-webhook → whatsapp-agent chain
 * PRD: RF02, RF03 (Inbox + HITL)
 *
 * Fluxo:
 *   1. Evolution API envia POST com mensagem recebida
 *   2. Este webhook salva em conversations + messages
 *   3. Invoca whatsapp-agent para gerar resposta de IA
 *   4. Salva resposta como message (sender_type: 'agent', is_ai_generated: true)
 *   5. Encaminha resposta para o WhatsApp via Evolution API
 *
 * Deploy:
 *   npx supabase functions deploy evolution-webhook --project-ref voosldmiiwxzfofazviq
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

    const body = await req.json();

    // Evolution API v2 webhook payload
    const event = body.event;
    const instance = body.instance || Deno.env.get("EVOLUTION_INSTANCE") || "Prospecção";

    // Only process incoming text messages
    if (event !== "messages.upsert") {
      return new Response(JSON.stringify({ ignored: true, event }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const messageData = body.data;
    const remoteJid = messageData?.key?.remoteJid;
    const fromMe = messageData?.key?.fromMe;
    const messageText =
      messageData?.message?.conversation ||
      messageData?.message?.extendedTextMessage?.text ||
      "";

    // Ignore our own outgoing messages
    if (fromMe || !messageText) {
      return new Response(JSON.stringify({ ignored: true, reason: "from_me or empty" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract phone number from JID (e.g. "5511999999999@s.whatsapp.net")
    const phone = remoteJid?.replace("@s.whatsapp.net", "").replace("@g.us", "") || "";
    const pushName = messageData?.pushName || "Desconhecido";

    // Log webhook receipt
    await supabase.from("webhook_logs").insert({
      event_type: event,
      payload: body,
      status: "received",
    });

    // ─── 1. Find or create contact ──────────────────────────────────
    let { data: contact } = await supabase
      .from("contacts")
      .select("id, tenant_id")
      .eq("phone", phone)
      .single();

    if (!contact) {
      // Auto-create contact with first available tenant
      const { data: firstTenant } = await supabase
        .from("tenants")
        .select("id")
        .limit(1)
        .single();

      if (!firstTenant) throw new Error("No tenant found");

      const { data: newContact } = await supabase
        .from("contacts")
        .insert({
          tenant_id: firstTenant.id,
          full_name: pushName,
          phone,
          contact_type: "lead",
        })
        .select("id, tenant_id")
        .single();

      contact = newContact;
    }

    if (!contact) throw new Error("Failed to create/find contact");

    // ─── 2. Find or create conversation ─────────────────────────────
    let { data: conversation } = await supabase
      .from("conversations")
      .select("id")
      .eq("contact_id", contact.id)
      .eq("status", "aberta")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!conversation) {
      const { data: newConv } = await supabase
        .from("conversations")
        .insert({
          tenant_id: contact.tenant_id,
          contact_id: contact.id,
          channel: "whatsapp",
          status: "aberta",
        })
        .select("id")
        .single();

      conversation = newConv;
    }

    if (!conversation) throw new Error("Failed to create/find conversation");

    // ─── 3. Save incoming message ───────────────────────────────────
    await supabase.from("messages").insert({
      tenant_id: contact.tenant_id,
      conversation_id: conversation.id,
      contact_id: contact.id,
      content: messageText,
      sender_type: "contact",
      channel: "whatsapp",
      is_ai_generated: false,
      metadata: {
        remote_jid: remoteJid,
        push_name: pushName,
        instance: instance,
      },
    });

    // ─── 4. Invoke whatsapp-agent for AI response ───────────────────
    const { data: agentResponse, error: agentError } = await supabase.functions.invoke(
      "whatsapp-agent",
      {
        body: {
          contact_id: contact.id,
          tenant_id: contact.tenant_id,
          message: messageText,
          conversation_id: conversation.id,
        },
      }
    );

    if (agentError) {
      console.error("whatsapp-agent error:", agentError);
      // Still return 200 to Evolution so it doesn't retry
      return new Response(
        JSON.stringify({ saved: true, agent_error: agentError.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiReply = agentResponse?.reply || agentResponse?.text || "";

    if (aiReply) {
      // ─── 5. Save AI response as message ─────────────────────────
      await supabase.from("messages").insert({
        tenant_id: contact.tenant_id,
        conversation_id: conversation.id,
        contact_id: contact.id,
        content: aiReply,
        sender_type: "agent",
        channel: "whatsapp",
        is_ai_generated: true,
        metadata: { model: "minimax-m2.7:cloud" },
      });

      // ─── 6. Send reply via Evolution API ──────────────────────────
      const evolutionUrl = Deno.env.get("EVOLUTION_API_URL");
      const evolutionKey = Deno.env.get("EVOLUTION_API_KEY");

      if (evolutionUrl && evolutionKey && instance) {
        try {
          await fetch(
            `${evolutionUrl}/message/sendText/${instance}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: evolutionKey,
              },
              body: JSON.stringify({
                number: phone,
                text: aiReply,
              }),
            }
          );
        } catch (sendErr: any) {
          console.error("Evolution sendText error:", sendErr.message);
        }
      }
    }

    // Mark webhook as processed
    await supabase
      .from("webhook_logs")
      .update({ status: "processed" })
      .eq("event_type", event)
      .eq("status", "received")
      .order("created_at", { ascending: false })
      .limit(1);

    return new Response(
      JSON.stringify({
        success: true,
        contact_id: contact.id,
        conversation_id: conversation.id,
        ai_replied: !!aiReply,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("evolution-webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
