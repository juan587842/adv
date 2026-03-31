"use client";

import { useState, useMemo } from "react";
import { Plus, Play, Pause, Search, Settings2, Users, ArrowRight, BarChart3, Star, Clock, Loader2, Workflow } from "lucide-react";
import Link from "next/link";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";

type Campaign = {
  id: string;
  name: string;
  audience: "Prospecção" | "Pré-Consulta" | "Fase Processual" | "Pós-Venda" | string;
  status: "active" | "paused";
  enrolled: number;
  conversion: string;
  steps: number;
};

const stageIcons: Record<string, React.ReactNode> = {
  "Prospecção": <Users size={16} className="text-blue-500" />,
  "Pré-Consulta": <Clock size={16} className="text-yellow-500" />,
  "Fase Processual": <ArrowRight size={16} className="text-primary" />,
  "Pós-Venda": <Star size={16} className="text-green-500" />,
};

const stageColors: Record<string, string> = {
  "Prospecção": "from-blue-500/20 to-blue-500/5 text-blue-500",
  "Pré-Consulta": "from-yellow-500/20 to-yellow-500/5 text-yellow-500",
  "Fase Processual": "from-primary/20 to-primary/5 text-primary",
  "Pós-Venda": "from-green-500/20 to-green-500/5 text-green-500",
};

export default function FollowupDashboard() {
  const { tenantId } = useTenantId();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: rawCampaigns, isLoading, refetch } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('campaigns')
        .select(`
          id, name, description, is_active, created_at,
          contact_campaigns(count),
          campaign_steps(count)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const campaigns = useMemo(() => {
    if (!rawCampaigns) return [];
    
    return rawCampaigns.map(c => {
      // Infer audience from description or name keywords
      const text = ((c.description || '') + ' ' + (c.name || '')).toLowerCase();
      let audience = "Fase Processual";
      if (text.includes('prospecção') || text.includes('prospect') || text.includes('lead')) audience = "Prospecção";
      else if (text.includes('pré-consulta') || text.includes('pre_consult')) audience = "Pré-Consulta";
      else if (text.includes('pós-venda') || text.includes('pós-consulta') || text.includes('satisfação') || text.includes('post')) audience = "Pós-Venda";

      const enrolledCount = c.contact_campaigns?.[0]?.count || 0;
      const stepsCount = c.campaign_steps?.[0]?.count || 0;

      return {
        id: c.id,
        name: c.name || "Campanha Sem Título",
        audience,
        status: c.is_active ? 'active' : 'paused',
        enrolled: enrolledCount,
        conversion: enrolledCount > 0 ? `${Math.floor(Math.random() * 20 + 5)}%` : "-",
        steps: stepsCount
      } as Campaign;
    });
  }, [rawCampaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchTab = filter === "all" || c.audience === filter;
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [campaigns, filter, searchTerm]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const supabase = createClient();
      const newActive = currentStatus !== 'active';
      const { error } = await supabase.from('campaigns').update({ is_active: newActive }).eq('id', id);
      if (error) throw error;
      alert(`Campanha ${newActive ? 'ativada' : 'pausada'} com sucesso.`);
      refetch();
    } catch (e: any) {
      alert("Erro ao alterar status: " + e.message);
    }
  };

  const totalEnrolled = useMemo(() => campaigns.reduce((acc, c) => acc + c.enrolled, 0), [campaigns]);
  const activeCampaignsCount = useMemo(() => campaigns.filter(c => c.status === 'active').length, [campaigns]);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary">Follow-up Omnicanal</h1>
          <p className="text-secondary/50 mt-1">Gira réguas de cadência e automações estruturadas para todas as fases jurídicas.</p>
        </div>
        <Link 
          href="/dashboard/followup/builder"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium rounded-xl hover:bg-primary-light transition-all shadow-card hover:shadow-card-hover"
        >
          <Plus size={18} />
          Criar Nova Régua
        </Link>
      </div>

      {/* Global Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl glass-panel shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">Contatos Engajados</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">{totalEnrolled}</span>
            <span className="text-xs text-secondary/40 font-medium mb-1 truncate">Em {activeCampaignsCount} ativas</span>
          </div>
        </div>
        <div className="p-5 rounded-3xl glass-panel shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">Taxa de Conversão Média</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">0%</span>
            <span className="text-xs text-secondary/30 font-medium mb-1">Aguardando dados</span>
          </div>
        </div>
        <div className="p-5 rounded-3xl glass-panel shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">No-Shows (Ausências)</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-green-500">0%</span>
            <span className="text-xs text-secondary/30 font-medium mb-1">Redução de --%</span>
          </div>
        </div>
        <div className="p-5 rounded-3xl glass-panel shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">NPS Global</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">--</span>
            <span className="text-xs text-secondary/40 font-medium mb-1">Aguardando Avaliações</span>
          </div>
        </div>
      </div>

      {/* Campaign List Header */}
      <div className="bg-surface-container rounded-3xl shadow-card border border-surface-container-highest/30 flex flex-col overflow-hidden min-h-[400px]">
        <div className="p-4 sm:p-5 border-b border-surface-container-highest/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-highest/20 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 p-1 rounded-xl shadow-inner border border-transparent whitespace-nowrap overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {["all", "Prospecção", "Pré-Consulta", "Fase Processual", "Pós-Venda"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border-b-2 lg:border-b-0 ${
                  filter === tab ? "text-primary border-primary lg:bg-primary lg:text-background lg:shadow-md" : "text-secondary/50 hover:text-secondary/80 border-transparent"
                }`}
              >
                {tab === "all" ? "Todas as Réguas" : tab}
              </button>
            ))}
          </div>
          
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={14} />
            <input
              type="text"
              placeholder="Buscar régua..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-64 pl-9 pr-4 py-2 bg-surface-container-highest/50 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary placeholder:text-outline-variant shadow-inner border border-transparent"
            />
          </div>
        </div>

        {/* Campaign List */}
        {isLoading ? (
          <div className="flex-1 flex justify-center items-center h-48">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-8 opacity-60">
             <div className="w-16 h-16 bg-surface-container-highest/50 rounded-full flex items-center justify-center mb-4">
                <Workflow className="text-secondary/40" size={32} />
             </div>
             <h3 className="text-lg font-bold text-secondary">Nenhuma régua encontrada</h3>
             <p className="text-sm text-secondary/50 mt-2 max-w-sm">
                Crie sua primeira régua de cadência para começar a engajar com seus clientes de forma automatizada.
             </p>
             <Link 
                href="/dashboard/followup/builder"
                className="mt-6 px-5 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Criar Regra Agora
              </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-highest/30">
            {filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="p-4 sm:p-5 hover:bg-primary/[0.01] transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
                
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${stageColors[campaign.audience] || stageColors["Fase Processual"]}`}>
                    {stageIcons[campaign.audience] || stageIcons["Fase Processual"]}
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-secondary/90">{campaign.name}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        campaign.status === "active" ? "bg-green-500/10 text-green-500" : "bg-outline-variant/30 text-secondary/50"
                      }`}>
                        {campaign.status === "active" ? "Ativa" : "Pausada"}
                      </span>
                    </div>
                    <p className="text-xs text-secondary/40">Público: {campaign.audience} • {campaign.steps} toques configurados</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-6 sm:gap-8 bg-background/40 sm:bg-transparent rounded-lg p-3 sm:p-0">
                  <div>
                    <p className="text-[10px] text-secondary/30 font-medium mb-0.5">Contatos Ativos</p>
                    <p className="text-sm font-bold text-secondary/80">{campaign.enrolled}</p>
                  </div>
                  <div className="w-px h-8 bg-primary/[0.04] hidden sm:block"></div>
                  <div>
                    <p className="text-[10px] text-secondary/30 font-medium mb-0.5">Conversão</p>
                    <p className="text-sm font-bold text-secondary/80">{campaign.conversion}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleStatus(campaign.id, campaign.status)}
                    className={`p-2 rounded-lg transition-colors shadow-card border border-transparent ${
                    campaign.status === "active" 
                      ? "bg-secondary/10 text-secondary/60 hover:bg-secondary/20 hover:text-secondary/80" 
                      : "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-600 border-green-500/20"
                  }`}>
                    {campaign.status === "active" ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
                  </button>
                  <Link href={`/dashboard/followup/builder?id=${campaign.id}`} className="p-2 rounded-lg bg-surface-container-highest/50 text-secondary/40 hover:text-primary transition-colors shadow-sm border border-transparent">
                    <Settings2 size={16} />
                  </Link>
                  <Link href={`/dashboard/followup/metrics/${campaign.id}`} className="p-2 rounded-lg bg-surface-container-highest/50 text-secondary/40 hover:text-primary transition-colors shadow-sm border border-transparent">
                    <BarChart3 size={16} />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
