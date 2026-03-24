"use client";

import { MoreHorizontal, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";

export function ActiveCasesZone() {
  const { tenantId } = useTenantId();

  const { data: cases, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('cases')
        .select('status')
        .eq('tenant_id', tenantId);
    },
    [tenantId]
  );

  const stats = useMemo(() => {
    if (!cases) return { novos: 0, andamento: 0, espera: 0, concluidos: 0 };
    return {
      novos: cases.filter(c => c.status === 'novo').length,
      andamento: cases.filter(c => c.status === 'em_andamento').length,
      espera: cases.filter(c => c.status === 'aguardando_prazo' || c.status === 'em_espera').length,
      concluidos: cases.filter(c => c.status === 'resolvido' || c.status === 'concluido' || c.status === 'arquivado').length,
    };
  }, [cases]);

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Casos Ativos</h2>
        <button className="text-outline hover:text-primary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-1 justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : (
        <div className="flex flex-col space-y-6 flex-1 justify-center">
          {/* Pipeline Bar */}
          <div className="flex items-center w-full bg-surface-container-lowest/30 p-1 rounded-full border border-outline-variant/5">
            <div className="flex-1 text-center py-2 px-1">
              <p className="text-[10px] uppercase tracking-tighter font-black text-outline">Novos</p>
              <p className="text-lg font-bold text-primary">{stats.novos.toString().padStart(2, '0')}</p>
            </div>
            <div className="w-px h-8 bg-outline-variant/20"></div>
            <div className="flex-1 text-center py-2 px-1 bg-surface-container-highest/60 rounded-full">
              <p className="text-[10px] uppercase tracking-tighter font-black text-on-surface">Em andamento</p>
              <p className="text-lg font-black text-primary">{stats.andamento.toString().padStart(2, '0')}</p>
            </div>
            <div className="w-px h-8 bg-outline-variant/20"></div>
            <div className="flex-1 text-center py-2 px-1">
              <p className="text-[10px] uppercase tracking-tighter font-black text-outline">Espera</p>
              <p className="text-lg font-bold text-outline">{stats.espera.toString().padStart(2, '0')}</p>
            </div>
            <div className="w-px h-8 bg-outline-variant/20"></div>
            <div className="flex-1 text-center py-2 px-1">
              <p className="text-[10px] uppercase tracking-tighter font-black text-outline">Concluídos</p>
              <p className="text-lg font-bold text-outline">{stats.concluidos.toString().padStart(2, '0')}</p>
            </div>
          </div>

          {/* Performance Stats - Keeping static visual for now or can compute growth based on updated_at */}
          <div className="flex justify-between items-end pt-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-black text-outline">Performance Mensal</p>
              <p className="text-2xl font-black text-on-surface">+18% <span className="text-primary text-sm font-medium">vs último mês</span></p>
            </div>
            <div className="flex gap-1 h-12 items-end">
              <div className="w-1.5 h-6 bg-primary/20 rounded-full"></div>
              <div className="w-1.5 h-8 bg-primary/40 rounded-full"></div>
              <div className="w-1.5 h-10 bg-primary/60 rounded-full"></div>
              <div className="w-1.5 h-12 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
