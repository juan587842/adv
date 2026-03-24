"use client";

import { DollarSign, ArrowUpRight, ArrowDownRight, Briefcase, Plus, Filter, Download, MoreVertical, FileCheck, Loader2, Receipt } from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function FinancialPage() {
  const { tenantId } = useTenantId();
  const [filter, setFilter] = useState("Todas");

  const { data: rawInvoices, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('invoices')
        .select(`
          id, description, amount, status, type, due_date, created_at,
          cases:case_id(title, number)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const { transactions, kpis } = useMemo(() => {
    if (!rawInvoices) {
      return { 
        transactions: [], 
        kpis: { income: 0, expense: 0, alvaras: 0, balance: 0 } 
      };
    }

    let income = 0;
    let expense = 0;
    let alvaras = 0;

    const mapped = rawInvoices.map(inv => {
      const amountNum = Number(inv.amount || 0);
      const isExpense = inv.type === 'guia' || inv.type === 'custas' || inv.type === 'expense';
      const isAlvara = inv.type === 'alvara';
      
      const typeStr = isExpense ? 'expense' : 'income';
      
      const isPaid = inv.status?.toLowerCase() === 'paid' || inv.status?.toLowerCase() === 'pago' || inv.status?.toLowerCase() === 'recebido';
      const statusLabel = isPaid ? (isExpense ? 'Pago' : 'Recebido') : 'Pendente';

      if (isPaid) {
        if (isExpense) expense += amountNum;
        else income += amountNum;
      } else if (isAlvara) {
        alvaras += amountNum;
      }

      let dateStr = "N/A";
      try {
        if (inv.due_date) dateStr = format(parseISO(inv.due_date), "dd MMM", { locale: ptBR });
        else if (inv.created_at) dateStr = format(parseISO(inv.created_at), "dd MMM", { locale: ptBR });
      } catch(e) {}

      let category = "Transação";
      if (inv.type === 'honorarios' || inv.type === 'income') category = 'Honorários';
      else if (inv.type === 'guia' || inv.type === 'custas') category = 'Custas';
      else if (isAlvara) category = 'Alvará';

      return {
        id: inv.id,
        type: typeStr,
        category,
        title: inv.description || "Lançamento sem descrição",
        case: inv.cases?.number || inv.cases?.title || "Sem dossiê vinculado",
        amountNum,
        amount: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amountNum),
        date: dateStr,
        status: statusLabel
      };
    });

    return { 
      transactions: mapped,
      kpis: {
        income,
        expense,
        alvaras,
        balance: income - expense
      }
    };
  }, [rawInvoices]);

  const filteredTransactions = useMemo(() => {
    if (filter === "Todas") return transactions;
    return transactions.filter(t => t.category === filter);
  }, [transactions, filter]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

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
        <div className="glass-panel rounded-3xl p-5 shadow-card border border-surface-container-highest/30">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Receita Recebida</p>
            <div className="p-1.5 bg-green-500/[0.08] text-green-400/70 rounded-lg"><ArrowUpRight size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-secondary truncate" title={formatCurrency(kpis.income)}>{formatCurrency(kpis.income)}</p>
          <p className="text-[10px] text-green-400/70 mt-2 font-medium">+0% vs. mês passado</p>
        </div>
        
        <div className="glass-panel rounded-3xl p-5 shadow-card border border-surface-container-highest/30">
          <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Despesas e Custas Pagas</p>
            <div className="p-1.5 bg-red-500/[0.08] text-red-400/70 rounded-lg"><ArrowDownRight size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-secondary truncate" title={formatCurrency(kpis.expense)}>{formatCurrency(kpis.expense)}</p>
          <p className="text-[10px] text-red-400/60 mt-2 font-medium">+0% vs. mês passado</p>
        </div>
        
        <div className="glass-panel rounded-3xl p-5 shadow-card border border-surface-container-highest/30">
           <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/30">A Receber (Alvarás)</p>
            <div className="p-1.5 bg-yellow-500/[0.08] text-yellow-400/70 rounded-lg"><FileCheck size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-secondary truncate" title={formatCurrency(kpis.alvaras)}>{formatCurrency(kpis.alvaras)}</p>
          <p className="text-[10px] text-secondary/30 mt-2 font-medium">Previsão: Variável</p>
        </div>
        
        <div className="bg-gradient-to-br from-primary/[0.06] to-transparent rounded-3xl p-5 shadow-card border border-surface-container-highest/30">
           <div className="flex justify-between items-start mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/60">Saldo Líquido</p>
            <div className="p-1.5 bg-primary/[0.1] text-primary/70 rounded-lg"><DollarSign size={16} /></div>
          </div>
          <p className="text-2xl font-bold text-primary truncate" title={formatCurrency(kpis.balance)}>{formatCurrency(kpis.balance)}</p>
          <p className="text-[10px] text-primary/40 mt-2 font-medium">{kpis.balance >= 0 ? "Projeção Saudável" : "Déficit Detectado"}</p>
        </div>
      </div>

      <div className="bg-surface-container rounded-3xl shadow-card overflow-hidden border border-surface-container-highest/30 min-h-[400px] flex flex-col">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 border-b border-surface-container-highest/30">
          <div className="flex gap-4 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
             {["Todas", "Honorários", "Custas", "Alvará"].map(f => (
               <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs whitespace-nowrap pb-1 border-b-2 transition-colors ${filter === f ? 'font-bold text-primary border-primary' : 'font-medium text-secondary/30 hover:text-secondary/60 border-transparent'}`}
                >
                  {f === "Alvará" ? "Alvarás" : f}
                </button>
             ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors text-secondary/60 w-full sm:w-auto">
            <Filter size={14} className="text-primary/60" /> Filtrar
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
             <div className="w-16 h-16 bg-surface-container-highest/50 rounded-full flex items-center justify-center mb-4">
                <Receipt className="text-secondary/30" size={32} />
             </div>
             <p className="text-base font-bold text-secondary">Nenhum lançamento encontrado</p>
             <p className="text-sm text-secondary/40 mt-1 max-w-sm">Você ainda não tem lançamentos financeiros ou nenhum item corresponde ao filtro atual.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface-container-highest/30 bg-surface-container-highest/20">
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Lançamento</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Dossiê</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Data</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-right">Valor</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-center">Status</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-surface-container-highest/20 hover:bg-surface-container-highest/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-full ${tx.type === 'income' ? 'bg-green-500/[0.08] text-green-400/70' : 'bg-red-500/[0.08] text-red-400/70'}`}>
                          {tx.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        </div>
                        <div className="max-w-[180px]">
                          <p className="font-medium text-sm text-secondary/80 truncate">{tx.title}</p>
                          <p className="text-[10px] text-primary/40">{tx.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-[150px]">
                      <p className="text-sm text-secondary/50 flex items-center gap-1 truncate" title={tx.case}><Briefcase size={11} className="text-secondary/20 shrink-0"/> {tx.case}</p>
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
        )}
      </div>
    </div>
  );
}
