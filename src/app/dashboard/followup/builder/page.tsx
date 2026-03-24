"use client";

import { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Save, Plus, MessageCircle, Mail, GripVertical, Clock, MoreVertical, Trash2, Tag, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";

type Step = {
  id: string; // temporary id for UI or real UUID
  delayDays: number;
  delayHours: number;
  channel: "whatsapp" | "email";
  template: string;
};

const defaultSteps: Step[] = [
  { id: "1", delayDays: 2, delayHours: 0, channel: "whatsapp", template: "Olá {{contact_name}}, aqui é do escritório. Ficou alguma dúvida sobre a proposta que enviamos?" },
];

function CampaignBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const { tenantId } = useTenantId();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [steps, setSteps] = useState<Step[]>(defaultSteps);
  const [campaignName, setCampaignName] = useState("");
  const [audience, setAudience] = useState("Prospecção");

  useEffect(() => {
    if (campaignId && tenantId) {
      loadCampaign(campaignId);
    } else {
      setCampaignName("Nova Régua de Cadência");
    }
  }, [campaignId, tenantId]);

  const loadCampaign = async (id: string) => {
    try {
      setIsLoading(true);
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .single();
      
      if (campaignError) throw campaignError;
      
      if (campaign) {
        setCampaignName(campaign.name);
        
        let mappedAudience = "Prospecção";
        if (campaign.type === 'pre_consult' || campaign.type === 'pré-consulta') mappedAudience = "Pré-Consulta";
        else if (campaign.type === 'procedural_phase' || campaign.type === 'Fase Processual') mappedAudience = "Fase Processual";
        else if (campaign.type === 'post_sale' || campaign.type === 'pós-venda') mappedAudience = "Pós-Venda";
        else mappedAudience = "Prospecção"; // fallback

        setAudience(mappedAudience);
      }

      const { data: stepsData, error: stepsError } = await supabase
        .from('campaign_steps')
        .select('*')
        .eq('campaign_id', id)
        .order('step_order', { ascending: true });

      if (stepsError) throw stepsError;

      if (stepsData && stepsData.length > 0) {
        setSteps(stepsData.map(s => ({
          id: s.id,
          delayDays: s.delay_days || 0,
          delayHours: s.delay_hours || 0,
          channel: s.channel as any,
          template: s.template || ""
        })));
      } else {
        setSteps([]);
      }
    } catch (e: any) {
      alert("Erro ao carregar campanha: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (activate: boolean) => {
    if (!tenantId) return;
    try {
      setIsSaving(true);
      
      let typeData = 'prospect';
      if (audience === 'Pré-Consulta') typeData = 'pre_consult';
      else if (audience === 'Fase Processual') typeData = 'procedural_phase';
      else if (audience === 'Pós-Venda') typeData = 'post_sale';

      let savedCampaignId = campaignId;

      if (!campaignId) {
        // Create new
        const { data, error } = await supabase.from('campaigns').insert({
          tenant_id: tenantId,
          name: campaignName,
          type: typeData,
          status: activate ? 'active' : 'paused'
        }).select().single();

        if (error) throw error;
        savedCampaignId = data.id;
      } else {
        // Update existing
        const { error } = await supabase.from('campaigns').update({
          name: campaignName,
          type: typeData,
          status: activate ? 'active' : 'paused'
        }).eq('id', campaignId);
        if (error) throw error;
      }

      // Save steps
      if (savedCampaignId) {
        // Delete old steps first to simplify ordering
        await supabase.from('campaign_steps').delete().eq('campaign_id', savedCampaignId);

        if (steps.length > 0) {
          const insertSteps = steps.map((s, index) => ({
            tenant_id: tenantId,
            campaign_id: savedCampaignId,
            step_order: index + 1,
            delay_days: s.delayDays,
            delay_hours: s.delayHours,
            channel: s.channel,
            template: s.template
          }));

          const { error: stepsError } = await supabase.from('campaign_steps').insert(insertSteps);
          if (stepsError) throw stepsError;
        }
      }

      alert(`Campanha ${activate ? 'arquivada e ativada' : 'salva como rascunho'} com sucesso!`);
      router.push('/dashboard/followup');
    } catch (e: any) {
      alert("Erro ao salvar campanha: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addStep = () => {
    setSteps([...steps, { 
      id: Math.random().toString(), 
      delayDays: 1, 
      delayHours: 0, 
      channel: "whatsapp", 
      template: "" 
    }]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-primary/10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/followup" className="p-2 hover:bg-surface rounded-lg text-secondary/40 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-secondary">{campaignId ? "Editar Régua" : "Construtor de Follow-up"}</h1>
            <p className="text-sm text-secondary/50">Configure os disparos automatizados desta régua.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={isSaving}
            onClick={() => handleSave(false)}
            className="px-4 py-2 border border-primary/20 text-secondary/70 font-medium rounded-xl hover:bg-surface transition-all text-sm disabled:opacity-50"
          >
            Salvar Rascunho
          </button>
          <button 
            disabled={isSaving}
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium rounded-xl hover:bg-primary-light transition-all shadow-card text-sm disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Ativar Régua
          </button>
        </div>
      </div>

      {/* Campaign Config */}
      <div className="bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Nome da Régua</label>
          <input 
            type="text" 
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            className="w-full px-4 py-2.5 bg-background/50 rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Público-Alvo / Gatilho</label>
          <select 
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-4 py-2.5 bg-background/50 rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05] appearance-none"
          >
            <option value="Prospecção">Novos Leads (Prospecção)</option>
            <option value="Pré-Consulta">Clientes Agendados (Lembretes)</option>
            <option value="Fase Processual">Clientes Ativos (Tradução de Andamento)</option>
            <option value="Pós-Venda">Clientes Antigos (NPS e Informativos)</option>
          </select>
        </div>
      </div>

      {/* Steps Builder */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-secondary flex items-center gap-2">
          Sequência de Disparos
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{steps.length} passos</span>
        </h2>

        {/* Trigger start icon */}
        <div className="flex justify-center -mb-2">
          <div className="w-8 h-8 rounded-full bg-surface border border-primary/10 flex items-center justify-center text-primary/40 shadow-sm relative z-10">
            <Play size={14} className="ml-0.5" />
          </div>
        </div>

        {/* Steps List */}
        <div className="relative space-y-4">
          {/* Vertical line connecting steps */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-primary/10 -translate-x-1/2 rounded-full hidden sm:block"></div>

          {steps.map((step, index) => (
            <div key={step.id} className="relative z-10 sm:w-3/4 sm:mx-auto bg-surface/80 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.05] flex overflow-hidden group">
              
              {/* Drag Handle */}
              <div className="w-8 bg-black/10 flex flex-col items-center justify-center cursor-move border-r border-primary/[0.02]">
                <GripVertical size={16} className="text-secondary/20 group-hover:text-secondary/50 transition-colors" />
              </div>

              {/* Step Content */}
              <div className="flex-1 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-lg border border-primary/[0.03]">
                      <Clock size={14} className="text-secondary/40" />
                      <span className="text-xs text-secondary/60">Aguardar</span>
                      <input 
                        type="number" 
                        value={step.delayDays}
                        onChange={(e) => {
                          const newSteps = [...steps];
                          newSteps[index].delayDays = parseInt(e.target.value) || 0;
                          setSteps(newSteps);
                        }}
                        className="w-12 px-1 py-0.5 bg-surface rounded text-xs text-center border border-primary/10 focus:outline-none focus:ring-1 focus:ring-primary/20" 
                      />
                      <span className="text-xs text-secondary/60">dias</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select 
                      value={step.channel}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].channel = e.target.value as "whatsapp" | "email";
                        setSteps(newSteps);
                      }}
                      className="text-xs px-3 py-1.5 bg-background/50 rounded-lg border border-primary/[0.03] text-secondary/80 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      <option value="whatsapp">📱 WhatsApp</option>
                      <option value="email">📧 E-mail</option>
                    </select>

                    <button onClick={() => removeStep(step.id)} className="p-1.5 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <textarea 
                    value={step.template}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[index].template = e.target.value;
                      setSteps(newSteps);
                    }}
                    placeholder="Digite a mensagem..."
                    className="w-full p-4 bg-background/30 rounded-xl text-sm text-secondary/90 placeholder:text-secondary/30 resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05] min-h-[100px]"
                  />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                    <span className="flex items-center gap-1 text-[10px] text-primary/60 bg-primary/[0.05] px-2 py-1 rounded-md backdrop-blur-sm pointer-events-auto cursor-pointer hover:bg-primary/10 transition-colors">
                      <Tag size={12} /> Variáveis: {`{{contact_name}}`}, {`{{user_name}}`}
                    </span>
                    <span className="text-[10px] text-secondary/30 bg-background/80 px-1.5 rounded pointer-events-auto">
                      {step.template.length}/1024
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Add Step Button */}
          <div className="flex justify-center relative z-10 pt-2">
            <button 
              onClick={addStep}
              className="flex items-center gap-2 px-5 py-2.5 bg-secondary/[0.03] border border-dashed border-secondary/20 text-secondary/60 font-medium rounded-full hover:bg-secondary/[0.08] hover:text-secondary/90 hover:border-secondary/30 transition-all text-sm group"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform" />
              Adicionar Passo à Sequência
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CampaignBuilder() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    }>
      <CampaignBuilderContent />
    </Suspense>
  )
}
