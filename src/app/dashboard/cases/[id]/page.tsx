"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, FileText, Lock, Scale, Upload, AlertCircle, CalendarClock, ChevronDown, RefreshCw, ServerCog, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type CaseInfo = {
  id: string;
  case_number: string;
  title: string;
  court: string;
  status: string;
  urgency: string;
  value_estimate: number;
  datajud_last_sync_at: string | null;
};

type CaseMovement = {
  id: string;
  occurred_at: string;
  title: string;
  external_id: string;
  description: string;
  source: string;
  metadata: any;
};

export default function CaseDetailsPage() {
  const params = useParams();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseInfo | null>(null);
  const [movements, setMovements] = useState<CaseMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const supabase = createClient();

  const fetchCaseData = async () => {
    try {
      // Fetch case details
      const { data: cData, error: cError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();
      
      if (cError) throw cError;
      setCaseData(cData);

      // Fetch timeline (case_movements)
      const { data: mData, error: mError } = await supabase
        .from('case_movements')
        .select('*')
        .eq('case_id', caseId)
        .order('occurred_at', { ascending: false });

      if (mError) throw mError;
      setMovements(mData || []);
    } catch (err) {
      console.error("Error fetching case data:", err);
    } finally {
      setLoading(false);
    }
  };

  const logCaseView = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: mData } = await supabase.from('tenant_members').select('tenant_id').eq('user_id', user.id).single();
      if (!mData) return;

      await supabase.from('audit_logs').insert({
        tenant_id: mData.tenant_id,
        user_id: user.id,
        action_type: 'CASE_VIEW',
        resource_id: caseId,
        metadata: {
          userAgent: window.navigator.userAgent,
          path: window.location.pathname
        }
      });
    } catch(err) {
      console.error("Audit log failed to save", err);
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchCaseData();
      logCaseView();
    }
  }, [caseId]);

  const handleSyncDatajud = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke('datajud-sync', {
        body: { case_id: caseId }
      });

      if (error) throw error;
      
      setSyncMessage(`Sincronizado! ${data.synced_movements} novos andamentos encontrados.`);
      await fetchCaseData(); // Refresh UI
    } catch (err: any) {
      console.error("Sync error:", err);
      setSyncMessage("Erro ao tentar conectar ao Datajud.");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ServerCog className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (!caseData) {
    return <div className="p-8 text-center text-secondary/50">Dossiê não encontrado.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <Link href="/dashboard/cases" className="flex items-center gap-2 text-sm text-secondary/70 hover:text-primary transition-colors w-max">
        <ArrowLeft size={16} /> Voltar para Dossiês
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Process Info */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface border border-primary/20 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/20 rounded-full">Trabalhista</span>
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-green-400 bg-green-400/10 border border-green-500/20 rounded-full">
                    {caseData.status === 'em_andamento' ? 'Em Andamento' : caseData.status}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-secondary">{caseData.title}</h1>
                <p className="text-sm font-mono text-primary/70 mt-1 flex items-center gap-2">
                  <Scale size={14} /> {caseData.case_number} • {caseData.court}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors border border-primary/20">
                Ações do Dossiê <ChevronDown size={14}/>
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-primary/10">
               <div>
                <p className="text-xs text-secondary/50 uppercase tracking-wider mb-1">Valor da Causa</p>
                <p className="text-sm font-medium text-secondary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(caseData.value_estimate || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary/50 uppercase tracking-wider mb-1">Última Sincronização CNJ</p>
                <p className="text-sm font-medium text-secondary">
                  {caseData.datajud_last_sync_at 
                    ? format(new Date(caseData.datajud_last_sync_at), 'dd/MM/yy HH:mm')
                    : 'Nunca sincronizado'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline and Internal Notes */}
          <div className="bg-surface border border-primary/20 rounded-xl shadow-card overflow-hidden">
            <div className="flex border-b border-primary/10 bg-background/30">
              <button className="px-6 py-4 border-b-2 border-primary text-primary font-bold text-sm bg-primary/5 flex items-center gap-2">
                <ServerCog size={16}/> Timeline (Datajud / CNJ)
              </button>
              <button className="px-6 py-4 border-b-2 border-transparent text-secondary/50 hover:text-secondary font-medium text-sm flex items-center gap-2">
                <Lock size={14} /> Notas Internas
              </button>
              <button className="px-6 py-4 border-b-2 border-transparent text-secondary/50 hover:text-secondary font-medium text-sm">Resumo IA</button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Sync Header */}
              <div className="flex items-center justify-between pb-4 border-b border-primary/5">
                <p className="text-sm text-secondary/60">
                  Exibindo {movements.length} movimentações recuperadas da API Pública.
                </p>
                <div className="flex items-center gap-3">
                  {syncMessage && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded flex items-center gap-1">
                      <CheckCircle2 size={12}/> {syncMessage}
                    </span>
                  )}
                  <button 
                    onClick={handleSyncDatajud}
                    disabled={syncing}
                    className={`flex items-center gap-2 px-4 py-2 bg-background border border-primary/30 text-primary rounded-lg text-xs font-semibold hover:bg-primary/10 transition-colors ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
                    {syncing ? 'Conectando ao Datajud...' : 'Forçar Sincronização'}
                  </button>
                </div>
              </div>

              {/* Movements Timeline */}
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/10 before:to-transparent">
                
                {movements.length === 0 && !loading && (
                  <div className="text-center py-10 text-secondary/50 relative z-10 bg-surface">
                    <ServerCog size={32} className="mx-auto mb-3 text-primary/30" />
                    <p>Nenhuma movimentação sincronizada ainda.</p>
                    <p className="text-xs mt-1">Clique em Forçar Sincronização para buscar na API nacional.</p>
                  </div>
                )}

                {movements.map((mov, index) => {
                  const isUrgent = mov.metadata?.urgency === 'high';
                  
                  return (
                    <div key={mov.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                        isUrgent ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-primary/20 text-primary border-primary/30'
                      }`}>
                        {isUrgent ? <CalendarClock size={16} /> : <FileText size={16} />}
                      </div>
                      
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-primary/10 bg-background/50 shadow-sm">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary/40">
                              {format(new Date(mov.occurred_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </span>
                          </div>
                          {isUrgent && (
                            <span className="text-[9px] uppercase font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">
                              Atenção
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm font-semibold text-gray-200 mb-1">{mov.title}</p>
                        <p className="text-xs text-gray-300 font-mono leading-relaxed p-3 bg-surface/50 rounded-lg border border-primary/5">
                          {mov.description}
                        </p>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-[10px] text-secondary/30">
                            <Clock size={10} /> 
                            {formatDistanceToNow(new Date(mov.occurred_at), { addSuffix: true, locale: ptBR })}
                          </span>
                          <span className="text-[9px] text-secondary/40">{mov.source} • Ref: {mov.external_id || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}


              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-red-900/40 rounded-xl p-5 shadow-sm relative overflow-hidden h-max">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <h2 className="font-bold text-white flex items-center gap-2 mb-3"><AlertCircle size={18} className="text-red-400" /> Alertas do Dossiê</h2>
            <p className="text-sm text-gray-300 font-medium leading-relaxed">
              Existem prazos pendentes identificados pela IA nas últimas movimentações do Datajud.
            </p>
            <div className="mt-4 pt-3 border-t border-red-500/20">
               <span className="text-xs font-semibold text-red-200 cursor-pointer hover:text-white">Ver Tarefas Geradas →</span>
            </div>
          </div>

          <div className="bg-surface border border-primary/20 rounded-xl p-5 shadow-card">
            <h2 className="font-bold text-primary flex items-center gap-2 mb-4"><FileText size={18} /> Caixa de Arquivos</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background border border-primary/10 rounded-lg hover:border-primary/40 transition-colors cursor-pointer group">
                <FileText size={20} className="text-blue-400" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-semibold text-gray-300 truncate group-hover:text-primary transition-colors">Contrato_Original.pdf</p>
                  <p className="text-[10px] text-gray-500">1.2 MB</p>
                </div>
              </div>
              <button className="w-full py-2.5 text-xs font-semibold text-primary/70 hover:text-primary bg-primary/5 hover:bg-primary/10 rounded-lg border border-dashed border-primary/30 transition-colors flex justify-center items-center gap-2">
                <Upload size={14} /> Adicionar Documento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
