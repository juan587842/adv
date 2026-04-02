"use client";

import { AlertTriangle, Clock, CalendarDays, Loader2, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { differenceInDays } from "date-fns";

export function UrgentDeadlinesZone() {
  const { tenantId } = useTenantId();

  const { data: events, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('calendar_events')
        .select(`
          id, title, start_at,
          cases:case_id(case_number)
        `)
        .eq('tenant_id', tenantId)
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(3);
    },
    [tenantId]
  );

  const deadlines = useMemo(() => {
    if (!events) return [];
    return events.map(e => {
      const daysLeft = e.start_at ? differenceInDays(new Date(e.start_at), new Date()) : 0;
      let type = "Planejado";
      let color = "primary";
      
      if (daysLeft <= 2) {
        type = "Crítico";
        color = "error";
      } else if (daysLeft <= 5) {
        type = "Atenção";
        color = "orange-400";
      }

      return {
        id: e.id,
        title: e.title || "Prazo processual",
        case: e.cases?.case_number ? `Proc. ${e.cases.case_number}` : "Processo não informado",
        daysLeft,
        type,
        color,
        avatar: "https://ui-avatars.com/api/?name=P&background=random"
      };
    });
  }, [events]);

  return (
    <div className={`backdrop-blur-md rounded-2xl p-6 overflow-hidden relative ${
      deadlines.length > 0 
        ? "bg-surface-container-highest/40 border-l-4 border-error" 
        : "bg-surface-container-low/40 border border-outline-variant/20"
    }`}>
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <AlertTriangle size={120} />
      </div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-on-surface tracking-tight flex items-center gap-3">
          {deadlines.length > 0 ? (
           <AlertTriangle className="text-error" fill="currentColor" size={24} /> 
          ) : (
           <CalendarDays className="text-primary" size={24} />
          )}
          Prazos Urgentes
        </h2>
        <button className="text-xs uppercase tracking-widest text-primary font-black hover:opacity-80 transition-opacity">
          Ver Todos
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : deadlines.length === 0 ? (
         <div className="flex flex-col items-center justify-center p-6 text-center z-10 relative">
          <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3">
            <CheckCircle2 className="text-green-500" size={24} />
          </div>
          <p className="text-sm font-bold text-on-surface">Tudo em dia!</p>
          <p className="text-xs text-outline">Não há prazos críticos para os próximos dias.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {deadlines.map((item) => {
            const isError = item.color === "error";
            const isWarning = item.color === "orange-400";
            
            return (
              <div key={item.id} className="bg-surface-container-lowest/50 p-4 rounded-xl flex flex-col gap-3 group hover:bg-surface-container-highest/40 transition-all cursor-pointer">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded
                    ${isError ? 'text-error-container bg-error/10' : 
                      isWarning ? 'text-orange-400 bg-orange-400/10' : 
                      'text-primary/80 bg-primary/10'}`}>
                    {item.type}
                  </span>
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border border-surface" alt="Avatar" src={item.avatar} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{item.title}</p>
                  <p className="text-[11px] text-outline mt-0.5 truncate">{item.case}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className={`flex items-center gap-1.5 ${isError ? 'text-error' : isWarning ? 'text-orange-400' : 'text-primary'}`}>
                    {item.type !== "Planejado" ? <Clock size={14} /> : <CalendarDays size={14} />}
                    <span className="text-xs font-bold">{item.daysLeft} dias restantes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
