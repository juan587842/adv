/**
 * Edge Function: rag-pipeline
 * Usado pelo knowledge base (Fase 3 - item 8).
 * Modelo atualizado: text-embedding-3-small -> nomic-embed-text (Ollama)
 * Chat model atualizado: gpt-4o-mini -> minimax-m2.7:cloud (Ollama)
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
    const query = body.query;
    const action = body.action || "chat"; // 'embed' ou 'chat'

    const openaiUrl = Deno.env.get("OPENAI_BASE_URL") || "https://projetos-ollama.fbnowr.easypanel.host:11434/v1";
    const openaiKey = Deno.env.get("OPENAI_API_KEY") || "ollama";

    if (!openaiUrl) {
      throw new Error("OPENAI_BASE_URL (URL do Ollama VPS) não configurada nos secrets do Supabase");
    }

    // 1. Ação para gerar embedding (Ex: Indexar um novo caso ou artigo)
    if (action === "embed") {
      const res = await fetch(`${openaiUrl}/embeddings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "nomic-embed-text", 
          input: query
        })
      });

      if (!res.ok) throw new Error("Erro no Ollama embeddings");
      const embData = await res.json();
      
      return new Response(JSON.stringify({ 
        success: true, 
        embedding: embData.data[0].embedding 
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Ação padrão: Bate-papo RAG (Recuperar contexto e responder)
    // - Para este mock simples, vamos assumir que apenas gera a resposta usando o modelo.
    // - Na vida real, recuperaríamos embeddings antes.

    const resChat = await fetch(`${openaiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "minimax-m2.7:cloud",
        messages: [{ role: "user", content: query }]
      })
    });

    if (!resChat.ok) throw new Error("Erro no Ollama chat");
    const chatData = await resChat.json();

    return new Response(JSON.stringify({ 
      success: true, 
      answer: chatData.choices[0].message.content 
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("rag-pipeline error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
