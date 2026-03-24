"use client";

import { Wallet, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";

export function FinancialOverviewZone() {
  const { tenantId } = useTenantId();

  const { data: invoices, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('invoices')
        .select('amount, status, type')
        .eq('tenant_id', tenantId);
    },
    [tenantId]
  );

  const stats = useMemo(() => {
    if (!invoices) return { totalPending: 0, alvaras: 0, guiasVencidas: 0 };
    
    let totalPending = 0;
    let alvaras = 0;
    let guiasVencidas = 0;

    invoices.forEach(inv => {
      if (inv.status === 'pending' || inv.status === 'pendente') {
        totalPending += Number(inv.amount || 0);
        if (inv.type === 'alvara') alvaras++;
        if (inv.type === 'guia') guiasVencidas++;
      } else if (inv.status === 'overdue' || inv.status === 'vencido') {
        totalPending += Number(inv.amount || 0);
        if (inv.type === 'guia') guiasVencidas++;
      }
    });

    return { totalPending, alvaras, guiasVencidas };
  }, [invoices]);

  const formattedTotal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalPending);

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Resumo Financeiro</h2>
        <Wallet className="text-primary" size={24} />
      </div>

      {isLoading ? (
        <div className="flex flex-1 justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest font-black text-outline">Receitas Pendentes</p>
              <p className="text-2xl font-black text-primary truncate" title={formattedTotal}>{formattedTotal}</p>
            </div>
            <div className="flex justify-end items-end pb-1">
              {/* Sparkline SVG - Keep Static for Visual Effect For Now */}
              <svg className="w-24 h-8" viewBox="0 0 100 40">
                <path d="M0 35 Q 20 5, 40 25 T 80 15 T 100 5" fill="none" stroke="#e6c487" strokeWidth="2"></path>
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-surface-container-lowest/40 p-3 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase truncate mr-2">Alvarás Pend.</span>
                <span className="text-sm font-black text-on-surface">{stats.alvaras.toString().padStart(2, '0')}</span>
              </div>
              <div className="mt-2 w-full bg-outline-variant/20 h-1 rounded-full">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.min(100, (stats.alvaras / 5) * 100)}%` }}></div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest/40 p-3 rounded-xl border border-outline-variant/10">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-outline uppercase truncate mr-2">Guias Venc.</span>
                <span className="text-sm font-black text-error">{stats.guiasVencidas.toString().padStart(2, '0')}</span>
              </div>
              <div className="mt-2 w-full bg-outline-variant/20 h-1 rounded-full">
                <div className="bg-error h-full rounded-full transition-all" style={{ width: `${Math.min(100, (stats.guiasVencidas / 5) * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
