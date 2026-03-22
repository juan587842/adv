import { DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function FinancialOverviewZone() {
  const transactions = [
    { title: "Alvará Liberado - Proc. 001", amount: "R$ 15.400,00", type: "in", date: "Hoje" },
    { title: "Custas Iniciais - Silva Adv", amount: "R$ 450,00", type: "out", date: "Ontem" },
    { title: "Honorários Sucesso - M&A", amount: "R$ 8.200,00", type: "in", date: "20 Mar" },
  ];

  return (
    <div className="bg-surface rounded-xl p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-secondary">
          <DollarSign size={18} className="text-primary/70" />
          <span>Financeiro</span>
        </h2>
        <a href="/dashboard/financial" className="text-xs text-primary/50 hover:text-primary transition-colors">Ver módulo</a>
      </div>

      <div className="mb-4 p-3 bg-gradient-to-r from-green-950/20 to-transparent rounded-lg">
        <p className="text-[10px] text-secondary/40 font-medium uppercase tracking-wider">Receitas a Liquidar (7 dias)</p>
        <p className="text-xl font-bold text-green-400 mt-1">R$ 23.600<span className="text-sm text-green-600">,00</span></p>
      </div>

      <div className="space-y-0">
        {transactions.map((tx, idx) => (
          <div key={idx} className="flex items-center justify-between py-2.5 border-b border-primary/[0.04] last:border-0">
            <div>
              <p className="text-sm font-medium text-secondary/80">{tx.title}</p>
              <p className="text-[10px] text-secondary/30 mt-0.5">{tx.date}</p>
            </div>
            <div className={`flex items-center gap-1 font-semibold text-sm ${tx.type === 'in' ? 'text-green-400/80' : 'text-red-400/80'}`}>
              {tx.type === 'in' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
