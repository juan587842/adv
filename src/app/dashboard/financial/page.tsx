import { DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, Plus, Filter, Download, MoreVertical, FileCheck } from "lucide-react";

export default function FinancialPage() {
  const transactions = [
    { id: "1", type: "income", category: "Honorários", title: "Honorários Iniciais - Contrato TechNova", case: "0012345-67.2023.5.02.0001", amount: "R$ 15.000,00", date: "Hoje", status: "Recebido" },
    { id: "2", type: "expense", category: "Custas", title: "Guia DARE-SP (Agravo de Instrumento)", case: "Consultivo Cível", amount: "R$ 450,25", date: "Ontem", status: "Pago" },
    { id: "3", type: "income", category: "Alvará", title: "Levantamento de Alvará Judicial", case: "0055443-22.2020.8.26.0001", amount: "R$ 85.400,00", date: "10 Mar", status: "Pendente" },
    { id: "4", type: "income", category: "Partido", title: "Mensalidade Partido - Março", case: "TechNova Corp", amount: "R$ 3.500,00", date: "05 Mar", status: "Recebido" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Financeiro e Faturamento</h1>
          <p className="text-sm text-secondary/40 mt-1">Gestão de fluxo de caixa, honorários, custas e alvarás.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-background/50 text-secondary/60 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors flex items-center gap-2">
            <Download size={14} /> Relatório
          </button>
          <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
            <Plus size={16} /> Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 shadow-card">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Receita do Mês</p>
            <div className="p-1.5 bg-green-500/[0.08] text-green-400/70 rounded-lg"><ArrowUpRight size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-secondary">R$ 48.500,00</p>
          <p className="text-[10px] text-green-400/70 mt-2 font-medium">+12% vs. mês passado</p>
        </div>
        
        <div className="bg-surface rounded-xl p-5 shadow-card">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Despesas e Custas</p>
            <div className="p-1.5 bg-red-500/[0.08] text-red-400/70 rounded-lg"><ArrowDownRight size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-secondary">R$ 5.240,00</p>
          <p className="text-[10px] text-red-400/60 mt-2 font-medium">+5% vs. mês passado</p>
        </div>
        
        <div className="bg-surface rounded-xl p-5 shadow-card">
           <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/30">A Receber (Alvarás)</p>
            <div className="p-1.5 bg-yellow-500/[0.08] text-yellow-400/70 rounded-lg"><FileCheck size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-secondary">R$ 112.400,00</p>
          <p className="text-[10px] text-secondary/30 mt-2 font-medium">Previsão: 30 dias</p>
        </div>
        
        <div className="bg-gradient-to-br from-primary/[0.06] to-transparent rounded-xl p-5 shadow-card">
           <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">Saldo Líquido</p>
            <div className="p-1.5 bg-primary/[0.1] text-primary/70 rounded-lg"><DollarSign size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-primary">R$ 43.260,00</p>
          <p className="text-[10px] text-primary/40 mt-2 font-medium">Projeção Saudável</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border-b border-primary/[0.04]">
          <div className="flex gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
             <button className="text-xs font-bold text-primary border-b-2 border-primary pb-1 whitespace-nowrap">Todas</button>
             <button className="text-xs font-medium text-secondary/30 hover:text-secondary/60 border-b-2 border-transparent pb-1 whitespace-nowrap">Honorários</button>
             <button className="text-xs font-medium text-secondary/30 hover:text-secondary/60 border-b-2 border-transparent pb-1 whitespace-nowrap">Custas</button>
             <button className="text-xs font-medium text-secondary/30 hover:text-secondary/60 border-b-2 border-transparent pb-1 whitespace-nowrap">Alvarás</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors text-secondary/60 w-full sm:w-auto">
            <Filter size={14} className="text-primary/60" /> Filtrar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-primary/[0.04] bg-background/20">
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Lançamento</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Dossiê</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Data</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-right">Valor</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-center">Status</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-primary/[0.03] hover:bg-background/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${tx.type === 'income' ? 'bg-green-500/[0.08] text-green-400/70' : 'bg-red-500/[0.08] text-red-400/70'}`}>
                        {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-secondary/80">{tx.title}</p>
                        <p className="text-[10px] text-primary/40">{tx.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-secondary/50 flex items-center gap-1"><Briefcase size={11} className="text-secondary/20"/> {tx.case}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-secondary/50">{tx.date}</td>
                  <td className={`py-3 px-4 text-right font-bold text-sm tracking-tight ${tx.type === 'income' ? 'text-secondary/80' : 'text-red-400/70'}`}>
                    {tx.type === 'expense' ? '- ' : ''}{tx.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md ${
                      tx.status === 'Recebido' || tx.status === 'Pago' 
                        ? 'bg-green-500/[0.08] text-green-400/70' 
                        : 'bg-yellow-500/[0.08] text-yellow-400/70'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-secondary/30 hover:text-primary transition-colors p-1">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
