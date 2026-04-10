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
    
    const openaiUrl = Deno.env.get("OPENAI_BASE_URL") || "https://projetos-ollama.fbnowr.easypanel.host/v1";
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
      const parties = body.parties || {};
      const court = body.court || {};
      const lawyer = body.lawyer || {};
      
      const cleanContext = maskPII(draftContext);

      let partyBlock = "";
      if (parties.autor || parties.reu) {
        partyBlock += "\nPARTES:";
        if (parties.autor) partyBlock += ` Autor: ${parties.autor}.`;
        if (parties.reu) partyBlock += ` Réu: ${parties.reu}.`;
      }

      let courtBlock = "";
      if (court.judge || court.vara || court.comarca || court.process_number) {
        courtBlock += "\nJUÍZO:";
        if (court.vara) courtBlock += ` ${court.vara}`;
        if (court.comarca) courtBlock += ` - ${court.comarca}`;
        if (court.judge) courtBlock += ` - Juiz: ${court.judge}`;
        if (court.process_number) courtBlock += ` - Proc. ${court.process_number}`;
      }

      let lawyerBlock = "";
      if (lawyer.name || lawyer.oab) {
        lawyerBlock += "\nADVOGADO:";
        if (lawyer.name) lawyerBlock += ` ${lawyer.name}`;
        if (lawyer.oab) lawyerBlock += ` - OAB ${lawyer.oab}`;
      }

      const prompt = `[SYSTEM] Você é um advogado sênior em ${legalArea}. Gere APENAS a peça jurídica em Markdown, sem comentários.\n\n[TAREFA] Redigir: ${pieceType}\n[CONTEXTO] ${cleanContext}${partyBlock}${courtBlock}${lawyerBlock}\n\n[FORMATO MARKDOWN]\n# TÍTULO DA PEÇA (centralizado, maiúsculo)\nEndereçamento ao juízo com **negrito** nos dados.\n## DOS FATOS\nParágrafos justificados com fundamentação.\n## DO DIREITO\nCitações legais com > blockquote. Artigos em **negrito**.\n## DOS PEDIDOS\n1. Lista ordenada de pedidos.\n---\nNestes termos, pede deferimento.\nLocal, data.\nAssinatura.\n\n[REGRAS]\n- Use dados fornecidos; para dados faltantes, use [PLACEHOLDER].\n- Separe seções com --- (hr).\n- Use > para citações jurisprudenciais.\n- Fundamente com artigos reais (CPC, CC, CLT, CDC, CF).\n- Saída: APENAS o documento Markdown puro.`;

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
