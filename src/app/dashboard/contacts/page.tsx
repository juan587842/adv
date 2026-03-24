"use client";

import { Search, Filter, Plus, ChevronDown, Star, MessageCircle, ChevronDownSquare, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useTenantId } from "@/hooks/useTenantId";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState("Todos");
  const tabs = ["Todos", "Clientes", "Leads", "Ex-clientes"];
  const { tenantId } = useTenantId();

  const { data: rawContacts, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('contacts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const viewContacts = useMemo(() => {
    if (!rawContacts) return [];
    
    return rawContacts
      .filter(c => {
        if (activeTab === "Todos") return true;
        if (activeTab === "Clientes" && c.type === "cliente") return true;
        if (activeTab === "Leads" && c.type === "lead") return true;
        // Map any other status logic as needed
        return false;
      })
      .map(c => {
        // Aesthetic assignments based on type
        const isClient = c.type === "cliente";
        const isLead = c.type === "lead";

        const typeColor = isClient 
          ? "bg-primary/10 text-primary" 
          : isLead 
            ? "bg-secondary-container text-secondary" 
            : "bg-outline/10 text-outline";
            
        const statusColor = isClient ? "bg-green-500" : "bg-yellow-500";
        // Calculate a mock rank from lead_score for now
        const rating = c.lead_score ? Math.min(5, Math.floor(c.lead_score / 20)) : 3;

        return {
          id: c.id,
          name: c.full_name || "Sem Nome",
          type: c.type ? c.type.charAt(0).toUpperCase() + c.type.slice(1) : "Outro",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name || "A")}&background=random`,
          statusColor,
          typeColor,
          rating,
          linkedInfoLabel: isClient ? "Score:" : "Última interação:",
          linkedInfoValue: isClient ? `${c.lead_score || 0} pts` : "Desconhecida",
          progressLabel: "Saúde: 85%",
          progressValue: 85,
          progressColor: "bg-primary",
          buttonText: isLead ? "Ver Lead Detalhes" : "Ver Perfil Completo",
          hasInterest: isLead,
          interest: "Serviços Jurídicos"
        };
      });
  }, [rawContacts, activeTab]);

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold font-headline text-on-surface tracking-tight mb-2">Gestão de Contatos</h2>
          <p className="text-outline max-w-lg">Central de inteligência para relacionamento com clientes e prospecção de leads ativos.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline/20 hover:border-primary/40 hover:bg-surface-container transition-all text-sm font-medium">
            <Filter size={20} /> Filtros Avançados
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
            <Plus size={20} /> Novo Contato
          </button>
        </div>
      </div>

      {/* Filters & Chips Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-surface-container-low p-3 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all 
                ${activeTab === tab 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-bright"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-outline uppercase tracking-widest hidden sm:inline-block">Score:</span>
          <div className="relative">
            <select className="appearance-none bg-surface border-none text-sm rounded-xl py-2 pl-4 pr-10 focus:ring-1 focus:ring-primary text-on-surface min-w-[140px] outline-none cursor-pointer">
              <option>Lead Score</option>
              <option>Prioridade Alta</option>
              <option>Prioridade Média</option>
              <option>Prioridade Baixa</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-outline">
          <Loader2 size={32} className="animate-spin mb-4 text-primary" />
          <p>Carregando contatos...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && viewContacts.length === 0 && (
        <div className="bg-surface-variant/20 border border-outline-variant/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-outline/50">
            <Users size={32} />
          </div>
          <h2 className="text-lg font-bold text-on-surface mb-2">Nenhum contato encontrado</h2>
          <p className="text-outline text-sm max-w-sm mb-6">
            Não há registros compatíveis com os filtros selecionados.
          </p>
        </div>
      )}

      {/* Bento Grid of Contacts */}
      {!isLoading && viewContacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {viewContacts.map((c) => (
            <div key={c.id} className="bg-surface-variant/40 hover:bg-surface-variant/60 backdrop-blur-md group p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full">
              <div className="absolute top-0 right-0 p-4">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${c.typeColor}`}>
                  {c.type}
                </span>
              </div>
              
              <div className="flex items-start gap-4 mb-6">
                <div className="relative">
                  <img alt={c.name} className="w-16 h-16 rounded-2xl bg-surface-container object-cover" src={c.avatar} />
                  {c.statusColor && (
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${c.statusColor} border-4 border-surface rounded-full`}></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface leading-tight mb-1 group-hover:text-primary transition-colors">{c.name}</h3>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(c.rating) ? "fill-current" : "text-outline/40"} />
                    ))}
                    <span className="text-xs text-outline ml-1">({c.rating.toFixed(1)})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-outline">{c.linkedInfoLabel}</span>
                  <span className="font-bold text-on-surface">{c.linkedInfoValue}</span>
                </div>
                
                {c.hasInterest ? (
                  <div className="bg-surface-container-high/50 p-3 rounded-xl border-l-4 border-primary">
                    <p className="text-[11px] text-outline leading-tight">Interessado em: <span className="text-on-surface font-semibold italic">{c.interest}</span></p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${c.progressColor} rounded-full`} style={{ width: `${c.progressValue}%` }}></div>
                    </div>
                    <span className="text-[10px] text-primary font-bold uppercase">{c.progressLabel}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button className="flex-1 bg-surface-container-highest hover:bg-surface-bright p-2.5 rounded-xl transition-all group/btn flex items-center justify-center">
                  <MessageCircle size={20} className="text-green-400 group-hover/btn:scale-110 transition-transform" />
                </button>
                <Link href={`/dashboard/contacts/${c.id}`} className="flex-[3] bg-surface-container-highest hover:bg-primary hover:text-on-primary py-2.5 rounded-xl text-sm font-bold transition-all text-center">
                  {c.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (Asymmetric Layout element) */}
      {!isLoading && viewContacts.length > 0 && (
        <div className="mt-12 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            <button className="relative px-8 py-3 rounded-2xl bg-surface-container border border-outline/20 hover:border-primary/50 text-outline hover:text-primary transition-all font-medium text-sm flex items-center gap-3">
              Carregar mais contatos
              <ChevronDown size={20} className="animate-bounce" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
