"use client";

import { useState } from "react";
import { ArrowLeft, Play, Plus, Trash2, Edit2, Zap, Settings, RefreshCw, X, Check } from "lucide-react";
import Link from "next/link";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";

export default function MacrosPage() {
  const { tenantId } = useTenantId();
  const [isAdding, setIsAdding] = useState(false);
  const [newMacro, setNewMacro] = useState({
    name: "",
    trigger_type: "manual",
    requires_hitl: false,
    steps: [{ action: "generate_document", description: "Gerar petição inicial" }]
  });

  const { data: macros, refetch, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('agent_macros')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const handleSaveMacro = async () => {
    if (!newMacro.name || !tenantId) return;

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from('agent_macros').insert({
        tenant_id: tenantId,
        created_by: userData?.user?.id,
        name: newMacro.name,
        trigger_type: newMacro.trigger_type,
        requires_hitl: newMacro.requires_hitl,
        steps: newMacro.steps,
        is_active: true
      });

      if (error) throw error;
      
      setIsAdding(false);
      setNewMacro({ name: "", trigger_type: "manual", requires_hitl: false, steps: [{ action: "generate_document", description: "" }] });
      refetch();
    } catch (err: any) {
      alert(`Erro ao salvar macro: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta macro?")) return;
    try {
      const supabase = createClient();
      await supabase.from('agent_macros').delete().eq('id', id);
      refetch();
    } catch (err: any) {
      alert(`Erro ao remover macro: ${err.message}`);
    }
  };
  
  const handleAddStep = () => {
    setNewMacro(prev => ({...prev, steps: [...prev.steps, { action: "send_message", description: "" }]}));
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-theme(spacing.16))] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6">
        <Link href="/dashboard/intelligence" className="p-2 hover:bg-surface rounded-lg text-secondary/40 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Zap className="text-yellow-500" size={20} />
            Automação por Macros
          </h1>
          <p className="text-sm text-secondary/50">Crie esteiras de execução autônoma (Pipelines).</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-light transition-colors"
        >
          <Plus size={16} /> Nova Macro
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 gap-6 flex flex-col">
        {isAdding && (
          <div className="bg-surface-container rounded-2xl p-6 border border-primary/10 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-secondary">Construir Pipeline da Macro</h2>
              <button onClick={() => setIsAdding(false)} className="text-secondary/50 hover:text-secondary"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-secondary/60 mb-1">Nome da Macro</label>
                <input 
                  type="text" value={newMacro.name} onChange={e => setNewMacro({...newMacro, name: e.target.value})}
                  className="w-full bg-surface-container-highest/50 px-4 py-2.5 rounded-xl text-sm border border-transparent focus:border-primary/30 outline-none transition-all"
                  placeholder="Ex: Macro de Onboarding Trabalhista"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary/60 mb-1">Gatilho (Trigger)</label>
                <select 
                  value={newMacro.trigger_type} onChange={e => setNewMacro({...newMacro, trigger_type: e.target.value})}
                  className="w-full bg-surface-container-highest/50 px-4 py-2.5 rounded-xl text-sm border border-transparent focus:border-primary/30 outline-none transition-all appearance-none"
                >
                  <option value="manual">Manual (Ao Clicar)</option>
                  <option value="case_status_change">Quando status de Caso muda</option>
                  <option value="deadline_approaching">Quando prazo está vencendo</option>
                  <option value="new_contact">Quando novo contato chega</option>
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-secondary font-medium cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={newMacro.requires_hitl} 
                    onChange={e => setNewMacro({...newMacro, requires_hitl: e.target.checked})}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/40 bg-surface-container-highest"
                  />
                  Exige aprovação humana (HITL) em ações críticas
                </label>
              </div>
            </div>
            
            <div className="mb-4 pt-4 border-t border-surface-container-highest">
              <label className="block text-xs font-semibold text-secondary/60 mb-3">Passos (Steps)</label>
              <div className="space-y-3">
                {newMacro.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-3 bg-background/50 p-3 rounded-xl border border-surface-container-highest">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">{index + 1}</span>
                    <select 
                      value={step.action}
                      onChange={e => {
                        const newSteps = [...newMacro.steps];
                        newSteps[index].action = e.target.value;
                        setNewMacro({...newMacro, steps: newSteps});
                      }}
                      className="bg-surface-container-highest/50 px-3 py-2 rounded-lg text-sm border border-transparent focus:border-primary/30 outline-none w-48 shrink-0 appearance-none"
                    >
                      <option value="generate_document">Gerar Documento</option>
                      <option value="send_message">Enviar WhatsApp</option>
                      <option value="update_case">Atualizar Caso</option>
                      <option value="create_task">Criar Tarefa</option>
                    </select>
                    <input 
                      type="text" 
                      value={step.description}
                      onChange={e => {
                        const newSteps = [...newMacro.steps];
                        newSteps[index].description = e.target.value;
                        setNewMacro({...newMacro, steps: newSteps});
                      }}
                      placeholder="Descrição do que este passo fará..."
                      className="flex-1 bg-surface-container-highest/50 px-3 py-2 rounded-lg text-sm border border-transparent focus:border-primary/30 outline-none"
                    />
                    <button 
                      onClick={() => {
                        const newSteps = newMacro.steps.filter((_, i) => i !== index);
                        setNewMacro({...newMacro, steps: newSteps});
                      }}
                      className="text-secondary/40 hover:text-red-500 shrink-0"
                    ><Trash2 size={16}/></button>
                  </div>
                ))}
                
                <button onClick={handleAddStep} className="flex items-center justify-center gap-2 w-full py-3 bg-surface-container-highest/30 hover:bg-surface-container-highest/70 rounded-xl text-sm font-medium text-secondary/60 border border-dashed border-secondary/20 transition-all">
                  <Plus size={16}/> Adicionar Passo
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2 text-sm text-secondary/70 font-medium hover:bg-surface-container-highest rounded-lg transition-colors">Cancelar</button>
              <button disabled={!newMacro.name || newMacro.steps.length === 0} onClick={handleSaveMacro} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                <Check size={16}/> Salvar Macro
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : macros?.length === 0 && !isAdding ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-surface-container rounded-3xl border border-dashed border-primary/20 p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <Zap size={32} />
            </div>
            <h3 className="text-secondary font-semibold text-lg mb-2">Nenhuma macro configurada</h3>
            <p className="text-secondary/60 text-sm max-w-sm mb-6">As macros permitem orquestrar ações em sequência (pipelines), poupando tempo em tarefas rotineiras.</p>
            <button onClick={() => setIsAdding(true)} className="bg-primary/10 text-primary hover:bg-primary/20 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Construir primeira Macro
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {macros?.map((macro) => (
              <div key={macro.id} className="bg-surface-container rounded-2xl p-5 border border-surface-container-highest flex flex-col group hover:border-primary/30 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                    macro.trigger_type === 'manual' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                  }`}>
                    Gatilho: {macro.trigger_type.replace(/_/g, ' ')}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-secondary/40 hover:text-blue-500 bg-surface rounded-md"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(macro.id)} className="p-1.5 text-secondary/40 hover:text-red-500 bg-surface rounded-md"><Trash2 size={14}/></button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-secondary text-base line-clamp-1">{macro.name}</h3>
                  {macro.requires_hitl && (
                    <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded font-bold" title="Requer validação humana">HITL</span>
                  )}
                </div>
                
                <div className="text-xs text-secondary/50 mb-4 bg-background/50 rounded-lg p-3">
                  <div className="font-medium mb-2 text-secondary/70 text-[10px] uppercase">Pipeline de Execução ({macro.steps.length} passos):</div>
                  <ul className="space-y-1.5">
                    {macro.steps.slice(0, 3).map((s: any, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center text-[8px] font-bold">{idx + 1}</span>
                        <span className="truncate">{s.description || s.action}</span>
                      </li>
                    ))}
                    {macro.steps.length > 3 && (
                      <li className="text-[10px] text-secondary/40 pl-6 italic">... e mais {macro.steps.length - 3} passos</li>
                    )}
                  </ul>
                </div>

                <div className="mt-auto flex gap-2">
                  <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-1.5">
                    <Play size={14}/> Executar Agora
                  </button>
                  <button className="p-2 bg-surface border border-surface-container-highest text-secondary/60 rounded-lg hover:text-secondary hover:bg-surface-container-highest transition-colors">
                    <Settings size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
