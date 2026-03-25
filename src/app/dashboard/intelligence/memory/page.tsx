"use client";

import React, { useState, useMemo } from "react";
import { ArrowLeft, Brain, User, Heart, Scale, Clock, MessageCircle,
  Sparkles, Trash2, Plus, Search, ChevronDown, Star, Shield, Loader2
} from "lucide-react";
import Link from "next/link";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

type Memory = {
  id: string;
  contact_name: string;
  memory_type: string;
  memory_key: string;
  content: string;
  importance: number;
  updated_at: string;
  source: 'manual' | 'auto';
};

const typeIcons: Record<string, React.ReactNode> = {
  client_profile: <User size={14} className="text-blue-400" />,
  preference: <Heart size={14} className="text-pink-400" />,
  interaction_summary: <MessageCircle size={14} className="text-green-400" />,
  legal_context: <Scale size={14} className="text-yellow-400" />,
  relationship: <User size={14} className="text-purple-400" />,
  behavioral_pattern: <Brain size={14} className="text-cyan-400" />,
  custom: <Star size={14} className="text-secondary/40" />,
};

const typeLabels: Record<string, string> = {
  client_profile: 'Perfil',
  preference: 'Preferência',
  interaction_summary: 'Interação',
  legal_context: 'Contexto Jurídico',
  relationship: 'Relacionamento',
  behavioral_pattern: 'Padrão',
  custom: 'Personalizado',
};

export default function MemoryExplorerPage() {
  const { tenantId } = useTenantId();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterContact, setFilterContact] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: rawMemories, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('contact_memories')
        .select(`
          id, memory_type, memory_key, content, importance, source, updated_at,
          contacts(name)
        `)
        .eq('tenant_id', tenantId)
        .order('updated_at', { ascending: false });
    },
    [tenantId]
  );

  const memories = useMemo(() => {
    if (!rawMemories) return [];
    return rawMemories.map((m: any) => ({
      id: m.id,
      contact_name: m.contacts?.name || 'Contato Desconhecido',
      memory_type: m.memory_type || 'custom',
      memory_key: m.memory_key || '-',
      content: m.content || '',
      importance: m.importance || 50,
      updated_at: m.updated_at ? formatRelative(new Date(m.updated_at), new Date(), { locale: ptBR }) : '-',
      source: m.source || 'auto',
    } as Memory));
  }, [rawMemories]);

  const contacts = [...new Set(memories.map(m => m.contact_name))].sort();
  
  const filtered = memories.filter(m => {
    if (filterType !== 'all' && m.memory_type !== filterType) return false;
    if (filterContact !== 'all' && m.contact_name !== filterContact) return false;
    if (search && !m.content.toLowerCase().includes(search.toLowerCase()) && !m.memory_key.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const importanceBar = (val: number) => {
    const color = val >= 85 ? 'bg-red-500' : val >= 60 ? 'bg-yellow-500' : 'bg-blue-500';
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-16 h-1.5 bg-background/50 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${val}%` }} />
        </div>
        <span className="text-[9px] text-secondary/30 font-mono">{val}</span>
      </div>
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/intelligence" className="p-2 hover:bg-surface rounded-lg text-secondary/40 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Brain className="text-primary" size={20} />
            Memória Persistente (Agentic Memory)
          </h1>
          <p className="text-sm text-secondary/50">Tudo que a IA sabe sobre seus contatos — extraído automaticamente ou adicionado manualmente.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/15 transition-colors"
        >
          <Plus size={14} /> Adicionar Memória
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Brain size={12} className="text-primary/60" /> Total</p>
          <p className="text-2xl font-bold text-secondary/90">{memories.length}</p>
        </div>
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><User size={12} className="text-blue-400" /> Contatos</p>
          <p className="text-2xl font-bold text-secondary/90">{contacts.length}</p>
        </div>
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sparkles size={12} className="text-green-400" /> Auto-extraídas</p>
          <p className="text-2xl font-bold text-green-500">{memories.filter(m => m.source === 'auto').length}</p>
        </div>
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Shield size={12} className="text-red-400" /> Críticas (85+)</p>
          <p className="text-2xl font-bold text-red-500/90">{memories.filter(m => m.importance >= 85).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
          <input
            type="text"
            placeholder="Buscar memórias por conteúdo ou chave..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface-container-highest/50 rounded-xl text-sm text-secondary placeholder:text-outline-variant focus:outline-none focus:ring-1 focus:ring-primary/40 border border-transparent hover:bg-surface-container transition-colors shadow-inner"
          />
        </div>
        <select 
          value={filterContact}
          onChange={e => setFilterContact(e.target.value)}
          className="px-4 py-3 bg-surface-container-highest/50 rounded-xl text-sm text-secondary focus:outline-none border border-transparent shadow-inner appearance-none min-w-[180px]"
        >
          <option value="all">Todos Contatos</option>
          {contacts.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-4 py-3 bg-surface-container-highest/50 rounded-xl text-sm text-secondary focus:outline-none border border-transparent shadow-inner appearance-none min-w-[180px]"
        >
          <option value="all">Todos Tipos</option>
          {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Memory List */}
      <div className="flex flex-col gap-2.5">
        <div className="grid grid-cols-[200px_120px_160px_1fr_100px_80px] px-6 py-2 text-[10px] font-bold text-secondary/30 uppercase tracking-widest">
          <span>Contato</span>
          <span>Tipo de Dado</span>
          <span>Metadata Key</span>
          <span>Conteúdo / Contexto</span>
          <span>Relevância</span>
          <span className="text-right">Sync</span>
        </div>
        
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center bg-surface-container rounded-2xl">
             <div className="w-16 h-16 bg-surface-container-highest/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="text-secondary/40" size={32} />
             </div>
             <h3 className="text-lg font-bold text-secondary">Nenhuma memória encontrada</h3>
             <p className="text-sm text-secondary/50 mt-2 max-w-sm mx-auto">
                A IA ainda não extraiu ou registrou nenhuma memória para os contatos com este filtro.
             </p>
          </div>
        ) : (
          filtered.map(mem => (
            <div key={mem.id} className="grid grid-cols-[200px_120px_160px_1fr_100px_80px] bg-surface-container hover:bg-surface-container-highest rounded-2xl px-6 py-4 transition-all duration-300 items-center group shadow-sm border border-transparent hover:border-outline-variant/30 hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-[10px] font-bold flex-shrink-0 shadow-inner group-hover:from-primary/30 transition-colors uppercase">
                  {mem.contact_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <span className="text-xs text-secondary/80 font-medium truncate">{mem.contact_name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {typeIcons[mem.memory_type] || typeIcons.custom}
                <span className="text-[10px] text-secondary/50">{typeLabels[mem.memory_type] || typeLabels.custom}</span>
              </div>
              <span className="text-[10px] font-mono text-primary/60 truncate">{mem.memory_key}</span>
              <div className="flex items-center gap-2">
                <p className="text-xs text-secondary/70 truncate leading-relaxed max-w-sm" title={mem.content}>{mem.content}</p>
                {mem.source === 'auto' && (
                  <span className="flex-shrink-0 text-[8px] bg-green-500/10 text-green-400/70 px-1.5 py-0.5 rounded font-bold">AUTO</span>
                )}
              </div>
              {importanceBar(mem.importance)}
              <span className="text-[10px] font-medium text-secondary/30 text-right truncate pl-2">{mem.updated_at}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
