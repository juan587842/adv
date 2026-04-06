/**
 * Edge Function: jusbrasil-sync
 * PRD: RF06, Integração com Jusbrasil
 *
 * Realiza a busca de movimentações pelo Jusbrasil usando web scraping/API deles
 * 
 * Configuração:
 *   Adicionar JUSBRASIL_API_KEY ou auth equivalente.
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

    const jusbrasilKey = Deno.env.get("JUSBRASIL_API_KEY");
    if (!jusbrasilKey) {
      // Mock de Sucesso para testes se não tiver chave
      return new Response(JSON.stringify({
        success: true,
        mock: true,
        message: "JUSBRASIL_API_KEY ausente. Teste mockado.",
        syncAt: new Date().toISOString()
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Chamada simulada API
    const response = await fetch("https://api.jusbrasil.com.br/v1/processos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jusbrasilKey}`
      }
    }); // Needs real endpoint

    const data = await response.json();
    
    // Save to audit
    await supabase.from("audit_logs").insert({
      tenant_id: dbCase.tenant_id,
      entity_type: "case_sync",
      entity_id: dbCase.id,
      action: "jusbrasil_sync_success",
      new_data: data
    });

    return new Response(JSON.stringify({
      success: true,
      jusbrasil_result: data
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error: any) {
    console.error("jusbrasil-sync error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
