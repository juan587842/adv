import { Wallet } from "lucide-react";

export function FinancialOverviewZone() {
  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Resumo Financeiro</h2>
        <Wallet className="text-primary" size={24} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest font-black text-outline">Receitas Pendentes</p>
          <p className="text-2xl font-black text-primary">R$ 45.200</p>
        </div>
        <div className="flex justify-end items-end pb-1">
          {/* Sparkline SVG */}
          <svg className="w-24 h-8" viewBox="0 0 100 40">
            <path d="M0 35 Q 20 5, 40 25 T 80 15 T 100 5" fill="none" stroke="#e6c487" strokeWidth="2"></path>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-lowest/40 p-3 rounded-xl border border-outline-variant/10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-outline uppercase">Alvarás</span>
            <span className="text-sm font-black text-on-surface">02</span>
          </div>
          <div className="mt-2 w-full bg-outline-variant/20 h-1 rounded-full">
            <div className="bg-primary w-2/3 h-full rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest/40 p-3 rounded-xl border border-outline-variant/10">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-outline uppercase">Guias Venc.</span>
            <span className="text-sm font-black text-error">01</span>
          </div>
          <div className="mt-2 w-full bg-outline-variant/20 h-1 rounded-full">
            <div className="bg-error w-1/4 h-full rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
