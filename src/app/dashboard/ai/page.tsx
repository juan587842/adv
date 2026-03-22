"use client";

import { useState } from "react";
import {
  Zap, BookOpen, Plus, Play, Pause, Settings, Search,
  FileText, Eye, BarChart3, Clock, ChevronRight, Sparkles,
  ArrowRight, CheckCircle2, AlertTriangle, PenTool, Brain,
  Cpu, Workflow, MoreVertical, Star, Copy
} from "lucide-react";

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
const skillTypeIcons: Record<string, JSX.Element> = {
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

// ============ DEMO DATA ============
const demoSkills: Skill[] = [
  { id: '1', title: 'Análise de Contrato de Locação', description: 'Analisa contratos de locação identificando cláusulas abusivas, prazos e índices de reajuste.', skill_type: 'analysis', legal_area: 'Imobiliário', usage_count: 47, is_active: true, prompt_preview: 'Analise o contrato de locação a seguir e identifique: 1) Cláusulas potencialmente abusivas, 2) Prazos contratuais, 3) Índices de reajuste...' },
  { id: '2', title: 'Gerador de Resumo de Audiência', description: 'Transforma anotações brutas de audiência em resumo estruturado com próximos passos.', skill_type: 'generation', legal_area: 'Geral', usage_count: 32, is_active: true, prompt_preview: 'Com base nas anotações da audiência, gere um resumo executivo contendo: Partes, Depoimentos, Provas produzidas, Decisões do juiz...' },
  { id: '3', title: 'Classificador de Urgência Processual', description: 'Classifica o nível de urgência de uma movimentação processual em: Crítica, Alta, Média, Baixa.', skill_type: 'classification', legal_area: 'Geral', usage_count: 128, is_active: true, prompt_preview: 'Classifique a urgência da seguinte movimentação processual. Considere: tipo de decisão, prazos, consequências de inação...' },
  { id: '4', title: 'Extrator de Dados de Petição', description: 'Extrai partes, pedidos, valores e fundamentação legal de petições iniciais.', skill_type: 'extraction', legal_area: 'Geral', usage_count: 65, is_active: true, prompt_preview: 'Extraia do texto da petição os seguintes campos em JSON: autor, reu, pedidos, valor_causa, fundamentacao_legal, fatos_relevantes...' },
  { id: '5', title: 'Prompt de Análise Trabalhista', description: 'Avalia rescisões trabalhistas calculando verbas devidas e identificando irregularidades.', skill_type: 'prompt', legal_area: 'Trabalhista', usage_count: 21, is_active: true, prompt_preview: 'Analise a rescisão contratual abaixo e calcule: FGTS + 40%, férias proporcionais, 13° proporcional, aviso prévio...' },
  { id: '6', title: 'Sintetizador de Decisão Judicial', description: 'Resume decisões judiciais em linguagem leiga para comunicar ao cliente.', skill_type: 'generation', legal_area: 'Geral', usage_count: 18, is_active: false, prompt_preview: 'Traduza a decisão judicial abaixo em linguagem simples e acessível para o cliente leigo. Evite jargões...' },
];

const demoMacros: Macro[] = [
  {
    id: '1', title: 'Fechamento de Caso', description: 'Pipeline completo de encerramento: busca sentença, gera resumo, calcula custas, emite fatura e prepara comunicação ao cliente.',
    trigger_type: 'case_status_change', steps_count: 5, requires_hitl: true, is_active: true, execution_count: 8, last_executed: '20/03',
    steps: [ { label: 'Buscar Sentença (Datajud)', type: 'api_call' }, { label: 'Gerar Resumo Simplificado', type: 'skill' }, { label: 'Calcular Custas Finais', type: 'calculation' }, { label: 'Criar Fatura no Financeiro', type: 'action' }, { label: '⚠️ HITL: Aprovar Mensagem ao Cliente', type: 'hitl' } ]
  },
  {
    id: '2', title: 'Onboarding de Novo Lead', description: 'Quando um novo lead entra, a macro categoriza, pontua, prepara dossiê inicial e agenda follow-up.',
    trigger_type: 'new_message', steps_count: 4, requires_hitl: false, is_active: true, execution_count: 23, last_executed: 'Hoje',
    steps: [ { label: 'Classificar Área Jurídica', type: 'skill' }, { label: 'Pontuar Lead (Score)', type: 'skill' }, { label: 'Criar Dossiê Inicial', type: 'action' }, { label: 'Agendar Follow-up (48h)', type: 'action' } ]
  },
  {
    id: '3', title: 'Alerta de Prazo com Preparação', description: 'Quando um prazo se aproxima (48h), prepara automaticamente o dossiê, checklist e rascunho da peça.',
    trigger_type: 'deadline_approaching', steps_count: 4, requires_hitl: true, is_active: true, execution_count: 5, last_executed: '18/03',
    steps: [ { label: 'Compilar Documentos do Caso', type: 'action' }, { label: 'Gerar Rascunho da Peça', type: 'skill' }, { label: 'Montar Checklist de Audiência', type: 'skill' }, { label: '⚠️ HITL: Revisar e Protocolar', type: 'hitl' } ]
  },
];

// ============ COMPONENT ============
export default function SkillsMacrosPage() {
  const [activeTab, setActiveTab] = useState<'skills' | 'macros'>('skills');
  const [search, setSearch] = useState('');
  const [expandedMacro, setExpandedMacro] = useState<string | null>(null);

  const filteredSkills = demoSkills.filter(s =>
    !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-background rounded-xl text-sm font-medium hover:bg-primary-light transition-colors shadow-card">
          <Plus size={14} />
          {activeTab === 'skills' ? 'Nova Skill' : 'Nova Macro'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface/60 backdrop-blur-md rounded-xl p-1 w-fit border border-primary/[0.03]">
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'skills' ? 'bg-primary/15 text-primary shadow-sm' : 'text-secondary/50 hover:text-secondary/80'
          }`}
        >
          <BookOpen size={15} /> Skills ({demoSkills.length})
        </button>
        <button
          onClick={() => setActiveTab('macros')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'macros' ? 'bg-primary/15 text-primary shadow-sm' : 'text-secondary/50 hover:text-secondary/80'
          }`}
        >
          <Workflow size={15} /> Macros ({demoMacros.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={14} />
        <input
          type="text"
          placeholder={activeTab === 'skills' ? 'Buscar skills por nome ou descrição...' : 'Buscar macros...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-surface/60 rounded-xl text-sm text-secondary placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05]"
        />
      </div>

      {/* ===== SKILLS TAB ===== */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <div key={skill.id} className={`bg-surface/60 backdrop-blur-md rounded-2xl border shadow-card p-5 flex flex-col transition-all hover:shadow-lg ${skill.is_active ? 'border-primary/[0.05]' : 'border-red-500/[0.1] opacity-60'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-background/50 rounded-xl">
                    {skillTypeIcons[skill.skill_type]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-secondary/90">{skill.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] bg-primary/[0.08] text-primary/70 px-1.5 py-0.5 rounded font-medium">{skillTypeLabels[skill.skill_type]}</span>
                      <span className="text-[9px] text-secondary/30">{skill.legal_area}</span>
                    </div>
                  </div>
                </div>
                <button className="p-1.5 rounded-lg text-secondary/20 hover:bg-background/50 hover:text-secondary/50 transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
              <p className="text-xs text-secondary/50 leading-relaxed mb-3 flex-1">{skill.description}</p>
              <div className="p-2.5 bg-background/30 rounded-xl mb-3">
                <p className="text-[10px] text-secondary/30 font-mono leading-relaxed line-clamp-2">{skill.prompt_preview}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-primary/5">
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

      {/* ===== MACROS TAB ===== */}
      {activeTab === 'macros' && (
        <div className="space-y-4">
          {demoMacros.map(macro => (
            <div key={macro.id} className="bg-surface/60 backdrop-blur-md rounded-2xl border border-primary/[0.05] shadow-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-background/50 rounded-xl">
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
                        <span className="text-[10px] text-secondary/40">{triggerLabels[macro.trigger_type]}</span>
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
              </div>

              {/* Expanded Pipeline View */}
              {expandedMacro === macro.id && (
                <div className="px-5 pb-5 pt-0">
                  <div className="ml-[52px] p-4 bg-background/30 rounded-xl border border-primary/[0.03]">
                    <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-3">Pipeline de Execução</p>
                    <div className="space-y-0">
                      {macro.steps.map((step, i) => {
                        const isHitl = step.type === 'hitl';
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                isHitl ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' : 'bg-primary/10 text-primary/70'
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
          ))}
        </div>
      )}
    </div>
  );
}
