/**
 * Edge Function: datajud-sync
 * PRD: RF06, Integrar com API Pública do DataJud (CNJ)
 *
 * Esta função deve ser chamada diariamente por um CRON Job ou manualmente via botão de "Sincronizar".
 * Realiza as chamadas reais à API do DataJud.
 * Como o acesso requer chave, deixamos a estrutura base da requisição usando fetch().
 * 
 * Configuração:
 *   Adicionar DATAJUD_API_KEY aos secrets do Supabase.
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
    const caseId = body.case_id;

    if (!caseId) {
      // Se não passou ID específico, roda para todos os casos ativos
      return new Response(JSON.stringify({ 
        message: "Operação em lote não implementada neste script standalone. Passe case_id." 
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: dbCase } = await supabase
      .from("cases")
      .select("id, case_number, tenant_id")
      .eq("id", caseId)
      .single();

    if (!dbCase || !dbCase.case_number) {
      throw new Error("Caso não encontrado ou sem número de processo");
    }

    const unformattedNumber = dbCase.case_number.replace(/\D/g, "");

    const datajudKey = Deno.env.get("DATAJUD_API_KEY");
    if (!datajudKey) {
      // Mock de Sucesso para testes se não tiver chave
      return new Response(JSON.stringify({
        success: true,
        mock: true,
        message: "DATAJUD_API_KEY ausente. Teste mockado.",
        syncAt: new Date().toISOString()
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Chamada real à API: (Exemplo hipotético da estrutura do DataJud do CNJ)
    // endpoint publico ex: https://api-publica.datajud.cnj.jus.br/api_publica_stub/acoes/descobrir
    const response = await fetch("https://api-publica.datajud.cnj.jus.br/api_publica_stub/acoes/descobrir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `APIKey ${datajudKey}` // ou formato Header correto do DataJud
      },
      body: JSON.stringify({
        numeroProcesso: unformattedNumber
      })
    });

    if (!response.ok) {
      throw new Error(`DataJud API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save to audit
    await supabase.from("audit_logs").insert({
      tenant_id: dbCase.tenant_id,
      entity_type: "case_sync",
      entity_id: dbCase.id,
      action: "datajud_sync_success",
      new_data: data
    });

    return new Response(JSON.stringify({
      success: true,
      datajud_result: data
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("datajud-sync error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
