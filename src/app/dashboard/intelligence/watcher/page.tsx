"use client";

import React, { useState } from "react";
import { 
  ArrowLeft, Eye, AlertTriangle, Clock, Mail, DollarSign, FileText, 
  CheckCircle2, XCircle, Play, RefreshCw, Shield, Zap, MessageCircle
} from "lucide-react";
import Link from "next/link";

type AgentTask = {
  id: string;
  type: 'inbox_triage' | 'process_alert' | 'deadline_warning' | 'email_categorization' | 'dossier_prep' | 'financial_alert';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  summary: string;
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  created_at: string;
};

const priorityConfig = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/[0.08]', border: 'border-red-500/[0.15]', dot: 'bg-red-500', glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]', label: 'CRÍTICO' },
  high:     { color: 'text-yellow-400', bg: 'bg-yellow-500/[0.06]', border: 'border-yellow-500/[0.1]', dot: 'bg-yellow-500', glow: 'shadow-[0_0_8px_rgba(234,179,8,0.2)]', label: 'ALTO' },
  medium:   { color: 'text-blue-400', bg: 'bg-blue-500/[0.06]', border: 'border-blue-500/[0.08]', dot: 'bg-blue-500', glow: '', label: 'MÉDIO' },
  low:      { color: 'text-secondary/40', bg: 'bg-surface', border: 'border-primary/[0.03]', dot: 'bg-secondary/30', glow: '', label: 'BAIXO' },
};

const typeIcons: Record<string, React.ReactNode> = {
  inbox_triage: <MessageCircle size={16} className="text-green-500" />,
  process_alert: <AlertTriangle size={16} className="text-red-500" />,
  deadline_warning: <Clock size={16} className="text-yellow-500" />,
  email_categorization: <Mail size={16} className="text-blue-400" />,
  dossier_prep: <FileText size={16} className="text-purple-400" />,
  financial_alert: <DollarSign size={16} className="text-emerald-500" />,
};

const typeLabels: Record<string, string> = {
  inbox_triage: 'Triagem Inbox',
  process_alert: 'Alerta Processual',
  deadline_warning: 'Prazo Fatal',
  email_categorization: 'E-mail',
  dossier_prep: 'Dossiê',
  financial_alert: 'Financeiro',
};

// Demo tasks
const demoTasks: AgentTask[] = [
  {
    id: '1', type: 'deadline_warning', priority: 'critical',
    title: 'Prazo fatal em 24h: Contestação – Processo 1234567-89.2025.5.02.0001',
    summary: 'O prazo para Contestação Trabalhista do caso "Alves vs. TechNova Corp" vence amanhã, 23/03/2026. A peça ainda não foi protocolada. Ação imediata necessária.',
    status: 'pending', created_at: '08:05'
  },
  {
    id: '2', type: 'inbox_triage', priority: 'high',
    title: 'Conversa sem resposta há 45 min (WhatsApp)',
    summary: 'O lead "Família Oliveira" enviou mensagem sobre ITCMD às 08:45 e não recebeu resposta humana. A IA está ativa mas o topic requer intervenção.',
    status: 'pending', created_at: '09:30'
  },
  {
    id: '3', type: 'financial_alert', priority: 'high',
    title: 'Fatura vencida: R$ 4.500,00 — Maria Conceição',
    summary: 'A fatura de honorários advocatícios referente ao Inventário Extrajudicial venceu há 5 dias. Considere enviar cobrança automática pelo WhatsApp.',
    status: 'pending', created_at: '07:00'
  },
  {
    id: '4', type: 'email_categorization', priority: 'medium',
    title: 'E-mail categorizado: Notificação Extrajudicial recebida',
    summary: 'Recebido e-mail do escritório adversário com notificação extrajudicial referente ao Contrato de Locação do cliente Roberto Alves. Necessita de análise.',
    status: 'pending', created_at: '06:30'
  },
  {
    id: '5', type: 'dossier_prep', priority: 'medium',
    title: 'Dossiê preparado: Audiência de Instrução amanhã',
    summary: 'O Vigia compilou automaticamente: resumo do caso, documentos relevantes, jurisprudência similar e checklist de perguntas para a audiência.',
    status: 'completed', created_at: 'Ontem'
  },
  {
    id: '6', type: 'process_alert', priority: 'low',
    title: 'Movimentação detectada: Despacho de mero expediente',
    summary: 'Detectada movimentação no processo 9876543-21.2025.8.26.0100 — despacho de mero expediente. Nenhuma ação necessária.',
    status: 'dismissed', created_at: 'Ontem'
  },
];

export default function WatcherDashboard() {
  const [tasks, setTasks] = useState(demoTasks);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isScanning, setIsScanning] = useState(false);

  const handleResolve = (id: string, action: 'completed' | 'dismissed') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: action } : t));
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const filtered = filterPriority === 'all' ? tasks : tasks.filter(t => t.priority === filterPriority);
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const criticalCount = tasks.filter(t => t.priority === 'critical' && t.status === 'pending').length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/intelligence" className="p-2 hover:bg-surface rounded-lg text-secondary/40 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Eye className="text-primary" size={20} />
            Agente Onisciente — Vigia 24/7
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
          </h1>
          <p className="text-sm text-secondary/50">Feed proativo de tarefas detectadas pelo worker background em tempo real.</p>
        </div>
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/15 transition-colors"
        >
          <RefreshCw size={14} className={isScanning ? 'animate-spin' : ''} />
          {isScanning ? 'Varrendo...' : 'Forçar Varredura'}
        </button>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Shield size={12} className="text-secondary/60" /> Status</p>
          <p className="text-xl font-bold text-green-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span> Ativo
          </p>
        </div>
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Zap size={12} className="text-blue-400" /> Pendentes</p>
          <p className="text-2xl font-bold text-secondary/90">{pendingCount}</p>
        </div>
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle size={12} className="text-red-400" /> Críticos</p>
          <p className={`text-2xl font-bold ${criticalCount > 0 ? 'text-red-500' : 'text-secondary/30'}`}>{criticalCount}</p>
        </div>
        <div className="p-5 glass-panel rounded-3xl shadow-card border border-surface-container-highest/30">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Clock size={12} className="text-secondary/60" /> Último Scan</p>
          <p className="text-lg font-bold text-secondary/50">Há 3 min</p>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="inline-flex gap-2 p-1.5 bg-surface-container-highest/50 rounded-xl shadow-inner border border-transparent">
        {[ { key: 'all', label: 'Todas' }, { key: 'critical', label: '🔴 Críticas' }, { key: 'high', label: '🟡 Altas' }, { key: 'medium', label: '🔵 Médias' }, { key: 'low', label: '⚪ Baixas' } ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterPriority(f.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
              filterPriority === f.key ? 'bg-surface-container text-primary shadow-sm' : 'text-secondary/50 hover:text-secondary/80 hover:bg-surface-container/50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task Feed */}
      <div className="space-y-3">
        {filtered.map(task => {
          const pc = priorityConfig[task.priority];
          const isDone = task.status === 'completed' || task.status === 'dismissed';
          
          return (
            <div 
              key={task.id} 
              className={`p-5 glass-panel rounded-2xl transition-all duration-500 shadow-sm hover:shadow-card hover:border-outline-variant/30 ${isDone ? 'opacity-50 grayscale-[50%]' : ''} ${pc.bg} ${!isDone ? pc.glow : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className="p-3 bg-surface-container-highest/50 rounded-xl flex-shrink-0 mt-1 shadow-inner border border-transparent">
                  {typeIcons[task.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${pc.dot} flex-shrink-0`}></span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${pc.color}`}>{pc.label}</span>
                    <span className="text-[9px] text-secondary/30 bg-surface px-1.5 py-0.5 rounded">{typeLabels[task.type]}</span>
                    <span className="text-[9px] text-secondary/20 ml-auto">{task.created_at}</span>
                  </div>
                  <p className={`text-sm font-medium ${isDone ? 'text-secondary/40 line-through' : 'text-secondary/90'}`}>{task.title}</p>
                  <p className="text-xs text-secondary/45 mt-1 leading-relaxed">{task.summary}</p>
                </div>

                {/* Actions */}
                {!isDone && (
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button onClick={() => handleResolve(task.id, 'completed')} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-medium hover:bg-green-500/20 transition-colors">
                      <Play size={10} /> Executar
                    </button>
                    <button onClick={() => handleResolve(task.id, 'dismissed')} className="flex items-center gap-1 px-2.5 py-1.5 bg-secondary/[0.05] text-secondary/40 rounded-lg text-[10px] font-medium hover:bg-secondary/[0.1] transition-colors">
                      <XCircle size={10} /> Dispensar
                    </button>
                  </div>
                )}
                {task.status === 'completed' && (
                  <span className="flex items-center gap-1 text-[10px] text-green-400/60 font-medium"><CheckCircle2 size={12} /> Feito</span>
                )}
                {task.status === 'dismissed' && (
                  <span className="flex items-center gap-1 text-[10px] text-secondary/30 font-medium"><XCircle size={12} /> Dispensado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
