"use client";

import { BrainCircuit, Database, FileText, Zap, Settings, Activity, ShieldCheck, Cpu } from "lucide-react";
import Link from "next/link";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";

export default function IntelligenceDashboard() {
  const { tenantId } = useTenantId();
  const { data: stats } = useSupabaseQuery(
    async (supabase) => {
      if (!tenantId) return { data: { kbCount: 0, automationsCount: 0, hitlRate: 0 }, error: null };
      
      const p1 = supabase.from('knowledge_base').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId);
      const p2 = supabase.from('ai_drafts').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId);
      const p3 = supabase.from('ai_drafts').select('id', { count: 'exact', head: true }).eq('tenant_id', tenantId).eq('status', 'rejeitado');
      
      const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
      
      const totalAutomations = r2.count || 0;
      const hitlRate = totalAutomations > 0 && r3.count ? Math.round((r3.count / totalAutomations) * 100) : 0;

      return { 
        data: { 
          kbCount: r1.count || 0, 
          automationsCount: totalAutomations, 
          hitlRate 
        }, 
        error: null 
      };
    },
    [tenantId]
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            Central de Inteligência
          </h1>
          <p className="text-secondary/50 mt-1">Gerencie os agentes autônomos, integrações LLM e a base de conhecimento vetorial (RAG).</p>
        </div>
      </div>

      {/* Global AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Cpu size={12} /> Modelo Principal</p>
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-secondary/90">MiniMax M2.7</span>
            <span className="text-xs text-green-500 font-medium mb-1">Online</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Database size={12} /> Base de Conhecimento</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">{stats?.kbCount !== undefined ? stats.kbCount : '...'}</span>
            <span className="text-xs text-secondary/40 font-medium mb-1">Documentos RAG</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Zap size={12} /> Automações Executadas</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">{stats?.automationsCount !== undefined ? stats.automationsCount : '...'}</span>
            <span className="text-xs text-green-500 font-medium mb-1">Este mês</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><ShieldCheck size={12} /> HITL Intervenções</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">{stats?.hitlRate !== undefined ? `${stats.hitlRate}%` : '...'}</span>
            <span className="text-xs text-yellow-500 font-medium mb-1">Transbordos</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module: Base de Conhecimento (RAG) */}
        <div className="lg:col-span-2 bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] p-6 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Database size={20} />
              </div>
              <h2 className="text-lg font-bold text-secondary">Base de Conhecimento (RAG)</h2>
              <p className="text-sm text-secondary/50 mt-1 max-w-lg">
                Abasteça o cérebro do escritório usando embeddings vetoriais. A IA utilizará estes documentos como contexto absoluto (ground truth) para responder perguntas e redigir petições.
              </p>
            </div>
          </div>
          
          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-primary/[0.02]">
               <div className="flex items-center gap-3">
                  <FileText size={16} className="text-secondary/40" />
                  <div>
                    <p className="text-sm font-medium text-secondary/80">Jurisprudência Interna</p>
                    <p className="text-[10px] text-secondary/40">{stats?.kbCount || 0} Documentos ativos • pgvector HNSW</p>
                  </div>
               </div>
               <span className="text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-1 rounded">Ativo</span>
            </div>

            <Link href="/dashboard/intelligence/knowledge" className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-background rounded-xl font-medium hover:bg-primary-light transition-all shadow-card hover:shadow-card-hover mt-4">
              Gerenciar Base e Testar (Chat)
            </Link>
          </div>
        </div>

        {/* Module: Agentes Autônomos */}
        <div className="bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] p-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
            <BrainCircuit size={20} />
          </div>
          <h2 className="text-lg font-bold text-secondary">Agentes Autônomos</h2>
          <p className="text-sm text-secondary/50 mt-1 mb-6">
            Configure as diretrizes, personalidade e ferramentas (skills) aos quais os agentes têm acesso.
          </p>

          <div className="space-y-3">
            <div className="p-3 border border-primary/5 rounded-xl hover:bg-background/20 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-secondary/90 group-hover:text-primary transition-colors">Agente WhatsApp (Agno)</p>
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
              </div>
              <p className="text-xs text-secondary/40">Atendimento primário e triagem de leads.</p>
            </div>

            <div className="p-3 border border-primary/5 rounded-xl hover:bg-background/20 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-secondary/90 group-hover:text-primary transition-colors">Agente Onisciente (Vigia)</p>
                <span className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
              </div>
              <p className="text-xs text-secondary/40">Background worker para leitura de Diários Oficiais.</p>
            </div>
            
            <Link 
              href="/dashboard/settings/channels"
              className="w-full py-2.5 mt-2 text-xs font-semibold text-secondary/60 hover:text-primary bg-background/50 rounded-xl border border-primary/[0.02] hover:bg-surface transition-all flex items-center justify-center gap-2"
            >
              <Settings size={14} />
              Configurar Agentes
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
