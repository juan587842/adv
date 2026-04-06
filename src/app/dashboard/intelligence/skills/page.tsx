"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, Plus, Search, Edit2, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";
import { formatDateBR } from "@/utils/dateFormat";

export default function SkillsPage() {
  const { tenantId } = useTenantId();
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState({
    title: "",
    skill_type: "analise_documental",
    legal_area: "",
    prompt_template: "",
    input_variables: [] as string[]
  });

  const { data: skills, refetch, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('agent_skills')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const handleSaveSkill = async () => {
    if (!newSkill.title || !newSkill.prompt_template || !tenantId) return;

    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from('agent_skills').insert({
        tenant_id: tenantId,
        created_by: userData?.user?.id,
        title: newSkill.title,
        skill_type: newSkill.skill_type,
        legal_area: newSkill.legal_area || null,
        prompt_template: newSkill.prompt_template,
        input_variables: newSkill.input_variables,
        is_active: true
      });

      if (error) throw error;
      
      setIsAdding(false);
      setNewSkill({ title: "", skill_type: "analise_documental", legal_area: "", prompt_template: "", input_variables: [] });
      refetch();
    } catch (err: any) {
      alert(`Erro ao salvar skill: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta skill?")) return;
    try {
      const supabase = createClient();
      await supabase.from('agent_skills').delete().eq('id', id);
      refetch();
    } catch (err: any) {
      alert(`Erro ao remover skill: ${err.message}`);
    }
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
            <BookOpen className="text-primary" size={20} />
            Biblioteca de Skills (Habilidades)
          </h1>
          <p className="text-sm text-secondary/50">Crie e gerencie comandos cognitivos reutilizáveis para os agentes.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-light transition-colors"
        >
          <Plus size={16} /> Nova Skill
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 gap-6 flex flex-col">
        {isAdding && (
          <div className="bg-surface-container rounded-2xl p-6 border border-primary/10 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-secondary">Criar Nova Skill</h2>
              <button onClick={() => setIsAdding(false)} className="text-secondary/50 hover:text-secondary"><X size={20}/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-secondary/60 mb-1">Título</label>
                <input 
                  type="text" value={newSkill.title} onChange={e => setNewSkill({...newSkill, title: e.target.value})}
                  className="w-full bg-surface-container-highest/50 px-4 py-2.5 rounded-xl text-sm border border-transparent focus:border-primary/30 outline-none transition-all"
                  placeholder="Ex: Análise de Inicial Trabalhista"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-secondary/60 mb-1">Tipo de Skill</label>
                <select 
                  value={newSkill.skill_type} onChange={e => setNewSkill({...newSkill, skill_type: e.target.value})}
                  className="w-full bg-surface-container-highest/50 px-4 py-2.5 rounded-xl text-sm border border-transparent focus:border-primary/30 outline-none transition-all"
                >
                  <option value="analise_documental">Análise Documental</option>
                  <option value="extracao_dados">Extração de Dados</option>
                  <option value="geracao_minuta">Geração de Minuta</option>
                  <option value="atendimento">Atendimento (Chat)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-secondary/60 mb-1">Template do Prompt (Instrução para a IA)</label>
                <textarea 
                  value={newSkill.prompt_template} onChange={e => setNewSkill({...newSkill, prompt_template: e.target.value})}
                  className="w-full min-h-[120px] bg-surface-container-highest/50 px-4 py-3 rounded-xl text-sm border border-transparent focus:border-primary/30 outline-none transition-all resize-y"
                  placeholder="Você é um especialista em direito. Analise o seguinte documento: {{documento}}..."
                />
                <p className="text-[10px] text-secondary/40 mt-1">Use chaves duplas para criar variáveis. Ex: `{"{{variavel}}"}`.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2 text-sm text-secondary/70 font-medium hover:bg-surface-container-highest rounded-lg transition-colors">Cancelar</button>
              <button disabled={!newSkill.title || !newSkill.prompt_template} onClick={handleSaveSkill} className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50">
                <Check size={16}/> Salvar Skill
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
        ) : skills?.length === 0 && !isAdding ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-surface-container rounded-3xl border border-dashed border-primary/20 p-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-secondary font-semibold text-lg mb-2">Nenhuma skill configurada</h3>
            <p className="text-secondary/60 text-sm max-w-sm mb-6">As skills permitem criar comandos reutilizáveis para a inteligência artificial, especificando prompts refinados.</p>
            <button onClick={() => setIsAdding(true)} className="bg-primary/10 text-primary hover:bg-primary/20 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
              Criar primeira skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills?.map((skill) => (
              <div key={skill.id} className="bg-surface-container rounded-2xl p-5 border border-surface-container-highest flex flex-col group hover:border-primary/30 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                    {skill.skill_type.replace('_', ' ')}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-secondary/40 hover:text-blue-500 bg-surface rounded-md"><Edit2 size={14}/></button>
                    <button onClick={() => handleDelete(skill.id)} className="p-1.5 text-secondary/40 hover:text-red-500 bg-surface rounded-md"><Trash2 size={14}/></button>
                  </div>
                </div>
                <h3 className="font-semibold text-secondary text-base mb-2 line-clamp-1">{skill.title}</h3>
                <p className="text-xs text-secondary/50 line-clamp-3 mb-4 flex-1">
                  {skill.prompt_template}
                </p>
                <div className="text-[10px] text-secondary/40 pt-3 border-t border-surface-container-highest flex justify-between items-center">
                  <span>Criado em {formatDateBR(skill.created_at)}</span>
                  <span className={`w-2 h-2 rounded-full ${skill.is_active ? 'bg-green-500' : 'bg-red-500'}`} title={skill.is_active ? "Ativa" : "Inativa"}></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
