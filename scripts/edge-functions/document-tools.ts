/**
 * Edge Function: document-tools
 * RNF02: Conformidade com LGPD
 * 
 * Processa 'synthesize' ou 'draft' usando LLM (Ollama via VPS).
 * Incorpora o LGPD mask antes de bater no modelo.
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
    const body = await req.json();
    const mode = body.mode;
    
    // Obtém URL do Ollama na VPS que foi setada nos secrets
    const openaiUrl = Deno.env.get("OPENAI_BASE_URL") || "https://projetos-ollama.fbnowr.easypanel.host:11434/v1";
    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "ollama";

    if (!openaiUrl) {
      throw new Error("OPENAI_BASE_URL (URL do Ollama VPS) não configurada nos secrets do Supabase");
    }

    let resultText = "";

    if (mode === "synthesize") {
      const dirtyText = body.text || "";
      const cleanText = maskPII(dirtyText);

      const prompt = `Faça um resumo analítico e uma síntese cronológica detalhada sobre o texto jurídico abaixo.\n\nTexto:\n${cleanText}`;

      const res = await fetch(`${openaiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "minimax-m2.7:cloud", 
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!res.ok) throw new Error("Erro ao chamar LLM via " + openaiUrl);
      const llmData = await res.json();
      resultText = llmData.choices[0].message.content;

    } else if (mode === "draft") {
      const pieceType = body.piece_type || "Petição";
      const legalArea = body.legal_area || "Geral";
      const draftContext = body.case_context || "";
      
      const cleanContext = maskPII(draftContext);

      const prompt = `Atue como um advogado especialista em direito ${legalArea}.
Escreva uma primeira versão de ${pieceType} usando como base o seguinte contexto:
${cleanContext}

Use formatação Markdown. Crie as seções habituais da peça, deixando espaços [COMO ESTE] para os dados e qualificações precisas que o advogado preencherá.`;

      const res = await fetch(`${openaiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "minimax-m2.7:cloud",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!res.ok) throw new Error("Erro ao chamar LLM via " + openaiUrl);
      const llmData = await res.json();
      resultText = llmData.choices[0].message.content;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      result: resultText 
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("document-tools error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
