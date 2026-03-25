"use client";

import React, { useState, useMemo } from "react";
import {
  Zap, BookOpen, Plus, Play, Pause, Settings, Search,
  FileText, Eye, BarChart3, Clock, ChevronRight, Sparkles,
  ArrowRight, CheckCircle2, AlertTriangle, PenTool, Brain,
  Cpu, Workflow, MoreVertical, Star, Copy, Loader2
} from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";

// ============ TYPES ============
type Skill = {
  id: string;
  title: string;
  description: string;
  skill_type: string;
  legal_area: string;
  usage_count: number;
  is_active: boolean;
  prompt_preview: string;
};

type Macro = {
  id: string;
  title: string;
  description: string;
  trigger_type: string;
  steps_count: number;
  requires_hitl: boolean;
  is_active: boolean;
  execution_count: number;
  last_executed: string;
  steps: { label: string; type: string }[];
};

// ============ CONFIG ============
const skillTypeIcons: Record<string, React.ReactNode> = {
  prompt: <PenTool size={14} className="text-blue-400" />,
  analysis: <Eye size={14} className="text-green-400" />,
  generation: <Sparkles size={14} className="text-purple-400" />,
  extraction: <FileText size={14} className="text-yellow-400" />,
  classification: <BarChart3 size={14} className="text-cyan-400" />,
};

const skillTypeLabels: Record<string, string> = {
  prompt: 'Prompt',
  analysis: 'Análise',
  generation: 'Geração',
  extraction: 'Extração',
  classification: 'Classificação',
};

const triggerLabels: Record<string, string> = {
  manual: '▶ Manual',
  case_status_change: '📋 Mudança de Status',
  deadline_approaching: '⏰ Prazo Próximo',
  new_message: '💬 Nova Mensagem',
  scheduled: '📅 Agendado',
};

// ============ COMPONENT ============
export default function SkillsMacrosPage() {
  const { tenantId } = useTenantId();
  const [activeTab, setActiveTab] = useState<'skills' | 'macros'>('skills');
  const [search, setSearch] = useState('');
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);

  const { data: rawSkills, isLoading: isLoadingSkills } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('ai_skills')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('title');
    },
    [tenantId]
  );
  
  const { data: rawMacros, isLoading: isLoadingMacros } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('ai_macros')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('title');
    },
    [tenantId]
  );

  const skills: Skill[] = useMemo(() => {
    return (rawSkills || []).map(s => ({
      ...s,
      skill_type: s.skill_type || 'prompt',
      legal_area: s.legal_area || 'Geral',
      usage_count: s.usage_count || 0,
    }));
  }, [rawSkills]);

  const macros: Macro[] = useMemo(() => {
    return (rawMacros || []).map(m => ({
      ...m,
      trigger_type: m.trigger_type || 'manual',
      steps_count: m.steps_count || (m.steps ? m.steps.length : 0),
      requires_hitl: m.requires_hitl || false,
      execution_count: m.execution_count || 0,
      steps: m.steps || [],
      last_executed: m.last_executed || 'Nunca'
    }));
  }, [rawMacros]);

  const filteredSkills = skills.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredMacros = macros.filter(m =>
    !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
            <BookOpen className="text-primary" size={20} />
            Biblioteca de Skills & Motor de Macros
          </h1>
          <p className="text-sm text-secondary/50">Ensine novas habilidades à IA e crie pipelines de automação inteligentes.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-background rounded-xl text-sm font-medium hover:bg-primary-light transition-colors shadow-card border border-transparent">
          <Plus size={14} />
          {activeTab === 'skills' ? 'Nova Skill' : 'Nova Macro'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-highest/50 rounded-xl p-1 w-fit border border-transparent shadow-inner">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'skills' ? 'bg-surface-container text-primary shadow-sm' : 'text-secondary/50 hover:text-secondary/80'
          }`}
        >
          <BookOpen size={15} /> Skills ({skills.length})
        </button>
        <button
          onClick={() => setActiveTab('macros')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'macros' ? 'bg-surface-container text-primary shadow-sm' : 'text-secondary/50 hover:text-secondary/80'
          }`}
        >
          <Workflow size={15} /> Macros ({macros.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
        <input
          type="text"
          placeholder={activeTab === 'skills' ? 'Buscar skills por nome ou descrição...' : 'Buscar macros...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-container-highest/50 rounded-xl text-sm text-secondary placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary/40 border border-transparent hover:bg-surface-container transition-colors shadow-inner"
        />
      </div>

      {/* ===== SKILLS TAB ===== */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          {isLoadingSkills ? (
             <div className="p-12 flex justify-center items-center">
               <Loader2 className="animate-spin text-primary" size={32} />
             </div>
          ) : filteredSkills.length === 0 ? (
             <div className="p-12 text-center bg-surface-container rounded-2xl">
                <div className="w-16 h-16 bg-surface-container-highest/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-secondary/40" size={32} />
                </div>
                <h3 className="text-lg font-bold text-secondary">Nenhuma skill encontrada</h3>
                <p className="text-sm text-secondary/50 mt-2 max-w-sm mx-auto">
                  Sua biblioteca de skills está vazia ou os filtros de busca não encontraram resultados.
                </p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSkills.map(skill => (
                <div key={skill.id} className={`bg-surface-container hover:bg-surface-container-highest rounded-2xl p-5 flex flex-col transition-all hover:shadow-card shadow-sm border border-transparent hover:border-outline-variant/30 ${skill.is_active ? '' : 'opacity-60 grayscale-[50%]'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-background/50 rounded-xl shadow-inner border border-transparent">
                        {skillTypeIcons[skill.skill_type] || <Star size={14} className="text-secondary/40" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-secondary/90">{skill.title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] bg-primary/[0.08] text-primary/70 px-1.5 py-0.5 rounded font-medium">{skillTypeLabels[skill.skill_type] || skill.skill_type}</span>
                          <span className="text-[9px] text-secondary/30">{skill.legal_area}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-1.5 rounded-lg text-secondary/20 hover:bg-background/50 hover:text-secondary/50 transition-colors">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <p className="text-xs text-secondary/50 leading-relaxed mb-3 flex-1">{skill.description}</p>
                  <div className="p-2.5 bg-background/30 rounded-xl mb-3 shadow-inner border border-transparent">
                    <p className="text-[10px] text-secondary/30 font-mono leading-relaxed line-clamp-2">{skill.prompt_preview || 'Sem preview disponível'}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-secondary/30"><Play size={10} /> {skill.usage_count}x</span>
                      <span className={`flex items-center gap-1 text-[10px] ${skill.is_active ? 'text-green-400/60' : 'text-red-400/60'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${skill.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {skill.is_active ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-secondary/30 hover:bg-primary/10 hover:text-primary transition-colors"><Play size={12} /></button>
                      <button className="p-1.5 rounded-lg text-secondary/30 hover:bg-primary/10 hover:text-primary transition-colors"><Copy size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== MACROS TAB ===== */}
      {activeTab === 'macros' && (
        <div className="space-y-4">
          {isLoadingMacros ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredMacros.length === 0 ? (
            <div className="p-12 text-center bg-surface-container rounded-2xl">
              <div className="w-16 h-16 bg-surface-container-highest/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Workflow className="text-secondary/40" size={32} />
              </div>
              <h3 className="text-lg font-bold text-secondary">Nenhuma macro encontrada</h3>
              <p className="text-sm text-secondary/50 mt-2 max-w-sm mx-auto">
                Sua biblioteca de automações está vazia ou os filtros de busca não encontraram resultados.
              </p>
            </div>
          ) : (
            filteredMacros.map(macro => (
              <div key={macro.id} className="bg-surface-container hover:bg-surface-container-highest rounded-2xl p-5 flex flex-col transition-all hover:shadow-card shadow-sm border border-transparent hover:border-outline-variant/30 overflow-hidden">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background/50 rounded-xl shadow-inner border border-transparent">
                      <Workflow size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-secondary/90 flex items-center gap-2">
                        {macro.title}
                        {macro.requires_hitl && (
                          <span className="text-[8px] bg-yellow-500/10 text-yellow-400/80 px-1.5 py-0.5 rounded font-bold">HITL</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-secondary/40">{triggerLabels[macro.trigger_type] || macro.trigger_type}</span>
                        <span className="text-[10px] text-secondary/20">•</span>
                        <span className="text-[10px] text-secondary/30">{macro.steps_count} passos</span>
                        <span className="text-[10px] text-secondary/20">•</span>
                        <span className="text-[10px] text-secondary/30">{macro.execution_count}x executada</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/15 transition-colors">
                      <Play size={12} /> Executar
                    </button>
                    <button
                      onClick={() => setExpandedMacro(expandedMacro === macro.id ? null : macro.id)}
                      className="p-2 rounded-lg text-secondary/30 hover:bg-background/50 hover:text-secondary/60 transition-colors"
                    >
                      <ChevronRight size={14} className={`transition-transform ${expandedMacro === macro.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-secondary/50 leading-relaxed ml-[52px]">{macro.description}</p>

                {/* Expanded Pipeline View */}
                {expandedMacro === macro.id && macro.steps && macro.steps.length > 0 && (
                  <div className="px-5 pb-5 pt-4">
                    <div className="ml-[32px] p-4 bg-background/30 rounded-xl shadow-inner border border-transparent">
                      <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-3">Pipeline de Execução</p>
                      <div className="space-y-0">
                        {macro.steps.map((step, i) => {
                          const isHitl = step.type === 'hitl';
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isHitl ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' : 'bg-primary/10 text-primary/70 border border-primary/20'
                                }`}>
                                  {i + 1}
                                </div>
                                {i < macro.steps.length - 1 && (
                                  <div className="w-0.5 h-6 bg-primary/10"></div>
                                )}
                              </div>
                              <div className={`flex-1 py-1.5 ${isHitl ? 'text-yellow-400/80' : 'text-secondary/60'}`}>
                                <span className="text-xs font-medium">{step.label}</span>
                                <span className="text-[9px] text-secondary/20 ml-2">({step.type})</span>
                              </div>
                              {isHitl && <AlertTriangle size={12} className="text-yellow-500/60" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
