"use client";

import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";
import { Loader2, Activity } from "lucide-react";

export function RecentActivityZone() {
  const { tenantId } = useTenantId();

  const { data: rawLogs, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('audit_logs')
        .select(`
          id, action, created_at, entity_type,
          users:user_id(full_name)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);
    },
    [tenantId]
  );

  const activities = useMemo(() => {
    if (!rawLogs) return [];
    
    return rawLogs.map((log, index) => {
      let actor = log.users?.full_name || "Sistema";
      let isPrimary = actor !== "Sistema";
      
      let textClass = "";
      let bgClass = "bg-surface-container-high/50";
      let borderClass = "border-outline-variant/30";
      let colorClass = "bg-outline";

      // Color coding based on entity type or action
      if (log.entity_type === 'invoice' || log.entity_type === 'financial') {
        colorClass = "bg-primary";
        bgClass = "bg-primary/20";
        borderClass = "border-primary/40";
        textClass = "text-primary";
        isPrimary = true;
      } else if (log.action?.includes('delete')) {
        colorClass = "bg-error";
        bgClass = "bg-error/20";
        borderClass = "border-error/40";
        textClass = "text-error";
      } else if (log.entity_type === 'case') {
        colorClass = "bg-on-tertiary-container";
        bgClass = "bg-on-tertiary-container/20";
        borderClass = "border-on-tertiary-container/40";
      }
      
      let timeAgo = "";
      try {
        if (log.created_at) {
          timeAgo = formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR });
        }
      } catch (e) {}

      return {
        id: log.id,
        actor,
        action: log.action || "Ação não especificada",
        time: timeAgo || "Agora",
        isPrimary,
        colorClass,
        bgClass,
        borderClass,
        textClass,
        isLast: index === rawLogs.length - 1
      };
    });
  }, [rawLogs]);

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Log de Atividade</h2>
        <button className="text-[10px] uppercase font-black text-outline hover:text-primary transition-colors">
          Ver Log Completo
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-1 justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
          <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3">
            <Activity className="text-outline" size={24} />
          </div>
          <p className="text-sm font-bold text-on-surface">Nenhuma atividade recente</p>
          <p className="text-xs text-outline mt-1">O histórico de ações aparecerá aqui.</p>
        </div>
      ) : (
        <div className="space-y-5 flex-1 relative">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 relative">
              {!activity.isLast && (
                <div className="absolute left-2 top-6 bottom-[-14px] w-px bg-outline-variant/20"></div>
              )}
              
              <div className={`w-4 h-4 rounded-full ${activity.bgClass} border ${activity.borderClass} flex items-center justify-center z-10 shrink-0`}>
                <div className={`w-1.5 h-1.5 ${activity.colorClass} rounded-full`}></div>
              </div>
              
              <div className="flex-1 -mt-1 overflow-hidden">
                <p className="text-xs text-on-surface">
                  <span className={`font-bold ${activity.isPrimary ? activity.textClass || '' : ''}`}>
                    {activity.actor}
                  </span>
                  {" "}{activity.action}
                </p>
                <p className="text-[10px] text-outline mt-1 uppercase font-bold tracking-tighter truncate">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
