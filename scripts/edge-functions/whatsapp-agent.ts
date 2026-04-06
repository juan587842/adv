/**
 * Edge Function: whatsapp-agent
 * RNF02: Conformidade com LGPD
 * 
 * Atua como o agente de IA que responde as mensagens do WhatsApp.
 * Modifica o modelo para `minimax-m2.7:cloud` via Ollama VPS (Item 4)
 * Mascara a PI (Item 7)
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { maskPII } from "./lgpd_mask.ts";

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
    const contactId = body.contact_id;
    const messageText = body.message || "";
    // const conversationId = body.conversation_id;

    if (!messageText || !contactId) {
      throw new Error("Parâmetros contact_id e message obrigatórios");
    }

    // 1. Mascarar dados pessoais
    const cleanMessage = maskPII(messageText);

    // 2. Setup Ollama via VPS API
    const openaiUrl = Deno.env.get("OPENAI_BASE_URL");
    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "ollama";

    if (!openaiUrl) {
      throw new Error("OPENAI_BASE_URL (Ollama VPS) não configurada nos secrets");
    }

    // (Opcional) buscar agent_memory ou contexto anterior via "conversations"

    const prompt = `Você é um assistente virtual de um escritório de advocacia. Responda de forma cortês e profissional à seguinte mensagem do cliente:
"${cleanMessage}"

Não forneça retornos sensíveis ou confidenciais sem confirmar a identidade.`;

    const res = await fetch(`${openaiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "minimax-m2.7:cloud", 
        messages: [{ role: "system", content: prompt }]
      })
    });

    if (!res.ok) throw new Error("Erro na comunicação com Ollama.");
    const llmData = await res.json();
    const replyText = llmData.choices[0].message.content;

    return new Response(JSON.stringify({ 
      success: true, 
      text: replyText 
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("whatsapp-agent error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
