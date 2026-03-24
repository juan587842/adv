"use client";

import { Search, ChevronDown, Clock, MoreVertical, Calendar, ChevronLeft, ChevronRight, Loader2, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { DashboardFAB } from "@/components/dashboard/DashboardFAB";
import { useTenantId } from "@/hooks/useTenantId";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const { tenantId } = useTenantId();

  const { data: rawCases, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('cases')
        .select(`
          *,
          contacts:contact_id ( full_name ),
          profiles:assigned_to ( full_name )
        `)
        .eq('tenant_id', tenantId)
        .order('updated_at', { ascending: false });
    },
    [tenantId]
  );

  const filters = ["Todos", "novo", "em_andamento", "aguardando_prazo", "arquivado"];

  const cases = useMemo(() => {
    if (!rawCases) return [];
    return rawCases.filter(c => activeFilter === "Todos" || c.status === activeFilter);
  }, [rawCases, activeFilter]);

  // Transform to view model
  const viewCases = cases.map(c => {
    const clientName = c.contacts?.full_name || "Cliente não informado";
    const lawyerName = c.profiles?.full_name || "Não atribuído";
    const clientInitials = clientName.substring(0, 2).toUpperCase();
    const lawyerInitials = lawyerName.substring(0, 2).toUpperCase();
    
    // Status mapping
    let statusClass = "text-yellow-500/80";
    let statusDot = "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]";
    if (c.status === "em_andamento") {
      statusClass = "text-green-400";
      statusDot = "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]";
    }

    // Days since update
    const diffTime = Math.abs(new Date().getTime() - new Date(c.updated_at).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const activity = `Atualizado há ${diffDays} dias`;

    return {
      id: c.id,
      title: c.title,
      category: c.area || "Outro",
      number: c.case_number || "Sem número",
      activity,
      clientName,
      clientInitials,
      lawyerName,
      lawyerInitials,
      action: "Ver detalhes", // Placeholder - real deadlines would join deadlines table
      actionColor: "outline",
      status: c.status?.replace('_', ' ') || "novo",
      statusClass,
      statusDot,
      borderColor: c.area === 'civil' ? "bg-secondary shadow-[0_0_15px_rgba(201,169,110,0.4)]" : "bg-primary shadow-[0_0_15px_rgba(230,196,135,0.4)]"
    };
  });

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Dossiês Processuais</h1>
      </div>

      {/* Filters Bar */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all 
                ${activeFilter === filter 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-highest/40 text-on-surface hover:bg-surface-container-highest ring-1 ring-inset ring-outline-variant/30"
                }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select className="appearance-none bg-surface-container-low border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium text-on-surface focus:ring-primary/20 cursor-pointer outline-none">
              <option>Área do Direito</option>
              <option>Trabalhista</option>
              <option>Civil</option>
              <option>Criminal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
          </div>
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 text-outline">
          <Loader2 size={32} className="animate-spin mb-4 text-primary" />
          <p>Carregando dossiês...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && viewCases.length === 0 && (
        <div className="bg-surface-variant/20 border border-outline-variant/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 text-outline/50">
            <FolderOpen size={32} />
          </div>
          <h2 className="text-lg font-bold text-on-surface mb-2">Nenhum dossiê encontrado</h2>
          <p className="text-outline text-sm max-w-sm mb-6">
            Não há processos registrados com os filtros selecionados no momento.
          </p>
        </div>
      )}

      {/* Case Cards Grid */}
      {!isLoading && viewCases.length > 0 && (
        <div className="space-y-4">
          {viewCases.map((c) => (
            <Link key={c.id} href={`/dashboard/cases/${c.id}`} className="block">
              <div className="bg-surface-variant/40 hover:bg-surface-variant/60 backdrop-blur-md p-6 rounded-xl relative transition-all duration-300 group overflow-hidden opacity-95">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.borderColor}`}></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0 md:pr-8">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">{c.title}</h3>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset 
                        bg-surface-container-high text-outline ring-outline-variant/50`}>
                        {c.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-outline mb-4">
                      <span className="font-mono">{c.number}</span>
                      <span className="flex items-center"><Clock size={12} className="mr-1" /> {c.activity}</span>
                    </div>
                    
                    <div className="flex items-center space-x-6 md:space-x-12">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline text-xs font-bold">
                          {c.clientInitials}
                        </div>
                        <div className="text-xs">
                          <p className="text-outline uppercase tracking-tighter text-[9px]">Cliente</p>
                          <p className="font-semibold text-on-surface truncate max-w-[120px] md:max-w-none">{c.clientName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold ring-1 ring-primary/20">
                          {c.lawyerInitials}
                        </div>
                        <div className="text-xs">
                          <p className="text-outline uppercase tracking-tighter text-[9px]">Responsável</p>
                          <p className="font-semibold text-on-surface truncate max-w-[120px] md:max-w-none">{c.lawyerName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col md:items-end justify-between items-center space-y-0 md:space-y-4 md:text-right mt-4 md:mt-0 pt-4 md:pt-0 border-t border-outline/10 md:border-0">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-lg border text-outline border-transparent`}>
                        {c.action}
                      </span>
                      <button onClick={(e) => e.preventDefault()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-outline">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${c.statusDot}`}></span>
                      <span className={`text-xs font-medium uppercase tracking-wider ${c.statusClass}`}>{c.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && viewCases.length > 0 && (
        <footer className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-outline-variant/10 pt-8 gap-4">
          <p className="text-xs text-outline font-medium tracking-tight">Mostrando <span className="text-on-surface">{viewCases.length}</span> casos</p>
        </footer>
      )}

      {/* Ambient Glow Effects */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Centralized FAB */}
      <DashboardFAB />
    </div>
  );
}
