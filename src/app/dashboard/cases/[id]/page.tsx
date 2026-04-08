"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft, Clock, FileText, Lock, Scale, Upload, AlertCircle, 
  CalendarClock, ChevronDown, RefreshCw, ServerCog, CheckCircle2,
  Gavel, Copy, Activity, StickyNote, Wallet, Bot, Filter, Search, 
  Bolt, User, AlarmClock, Phone, Mail, MessageCircle, Edit, Archive
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { EditCaseModal } from "@/components/modals/EditCaseModal";

type CaseInfo = {
  id: string;
  case_number: string;
  title: string;
  court: string;
  status: string;
  urgency: string;
  value_estimate: number;
  datajud_last_sync_at: string | null;
  client_id?: string;
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
  const router = useRouter();

  const [caseData, setCaseData] = useState<CaseInfo | null>(null);
  const [movements, setMovements] = useState<CaseMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const supabase = createClient();

  const fetchCaseData = async () => {
    try {
      const { data: cData, error: cError } = await supabase
        .from('cases')
        .select('*')
        .eq('id', caseId)
        .single();
      
      if (cError) throw cError;
      setCaseData(cData);

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
        metadata: { userAgent: window.navigator.userAgent, path: window.location.pathname }
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
      setSyncMessage(`Sincronizado! ${data.synced_movements} novos andamentos.`);
      await fetchCaseData();
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
      <div className="flex justify-center items-center h-[60vh]">
        <ServerCog className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  if (!caseData) {
    return <div className="p-8 text-center text-outline">Dossiê não encontrado.</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-background -m-6 lg:-m-8 p-6 lg:p-8">
      {/* Top App Bar */}
      <header className="flex justify-between items-center w-full mb-8">
        <div className="flex items-center gap-4">
          <nav className="flex text-xs font-['Inter'] tracking-wide text-outline uppercase">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            <span className="mx-2">/</span>
            <Link href="/dashboard/cases" className="hover:text-primary transition-colors">Casos</Link>
            <span className="mx-2">/</span>
            <span className="text-primary font-semibold truncate max-w-[200px] md:max-w-xs">{caseData.title}</span>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-4 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-semibold text-on-surface hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              <Edit size={14} /> Editar
            </button>
            <button 
              onClick={async () => {
                if (!confirm("Tem certeza que deseja arquivar este dossiê?")) return;
                const { error } = await supabase.from("cases").update({ status: "arquivado" }).eq("id", caseId);
                if (error) { alert("Erro ao arquivar: " + error.message); return; }
                router.push("/dashboard/cases");
              }}
              className="px-4 py-1.5 rounded-lg border border-outline-variant/30 text-xs font-semibold text-on-surface hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors flex items-center gap-2"
            >
              <Archive size={14} /> Arquivar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Header Card Section */}
        <section className="bg-surface-container rounded-3xl p-8 border-l-4 border-primary shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Gavel size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-surface-container-highest text-primary text-[0.65rem] font-bold uppercase tracking-widest rounded-full">TRABALHISTA</span>
              <span className="px-3 py-1 bg-surface-container-highest text-secondary text-[0.65rem] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                {caseData.status === 'em_andamento' ? 'Em andamento' : caseData.status}
              </span>
              {caseData.urgency === 'high' && (
                <span className="px-3 py-1 bg-error-container text-error text-[0.65rem] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                  <AlertCircle size={10} /> Urgência Alta
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-on-surface tracking-tight mb-2 pr-20">{caseData.title}</h2>
            <div className="flex items-center gap-4 text-outline font-mono text-sm max-w-lg">
              <span className="truncate">CNJ: {caseData.case_number}</span>
              <button className="hover:text-primary transition-colors shrink-0" onClick={() => navigator.clipboard.writeText(caseData.case_number)}>
                <Copy size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Tabs Navigation */}
        <nav className="flex gap-8 border-b border-surface-container-highest/30 px-2 overflow-x-auto scrollbar-hide">
          <button className="pb-4 text-sm font-semibold text-primary border-b-2 border-primary flex items-center gap-2 transition-all whitespace-nowrap">
            <Activity size={18} /> Movimentações
          </button>
          <button className="pb-4 text-sm font-medium text-outline hover:text-on-surface flex items-center gap-2 transition-all whitespace-nowrap">
            <FileText size={18} /> Documentos
          </button>
          <button className="pb-4 text-sm font-medium text-outline hover:text-on-surface flex items-center gap-2 transition-all whitespace-nowrap">
            <StickyNote size={18} /> Notas
          </button>
          <button className="pb-4 text-sm font-medium text-outline hover:text-on-surface flex items-center gap-2 transition-all whitespace-nowrap">
            <Wallet size={18} /> Financeiro
          </button>
          <button className="pb-4 text-sm font-medium text-primary-fixed hover:text-primary flex items-center gap-2 transition-all whitespace-nowrap">
            <Bot size={18} /> IA Assistente
          </button>
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column: Timeline Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-on-surface">Histórico do Dossier</h3>
                <button 
                  onClick={handleSyncDatajud}
                  disabled={syncing}
                  className={`flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-[0.65rem] font-bold text-outline uppercase tracking-wider hover:text-primary  ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
                  {syncing ? 'Sincronizando...' : 'Datajud Sync'}
                </button>
                {syncMessage && (
                  <span className="text-[0.65rem] font-bold text-primary flex items-center gap-1">
                    <CheckCircle2 size={12} /> {syncMessage}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest text-outline transition-colors">
                  <Filter size={18} />
                </button>
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest text-outline transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-8 space-y-10">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-surface-container-highest"></div>

              {movements.length === 0 && !loading && (
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center border-4 border-background">
                     <ServerCog size={10} className="text-outline" />
                  </div>
                  <div className="bg-surface-container/40 rounded-2xl p-6 border-l-2 border-surface-container-highest">
                     <div className="text-center py-6">
                        <p className="text-sm text-outline font-medium">Nenhuma movimentação sincronizada ainda.</p>
                        <p className="text-[0.65rem] text-outline/60 mt-2 uppercase tracking-wide">Utilize o botão Datajud Sync para buscar atualizações.</p>
                     </div>
                  </div>
                </div>
              )}

              {movements.map((mov, i) => {
                const isUrgent = mov.metadata?.urgency === 'high';
                const isManual = mov.source === 'manual';

                return (
                  <div key={mov.id} className="relative">
                    <div className={`absolute -left-[29px] top-1 w-5 h-5 rounded-full flex items-center justify-center border-4 border-background ${isUrgent ? 'bg-error' : isManual ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                       {isUrgent ? (
                        <Bolt size={10} className="text-on-error font-black" />
                       ) : isManual ? (
                         <User size={10} className="text-on-primary font-black" />
                       ) : (
                         <Gavel size={10} className="text-outline font-black" />
                       )}
                    </div>

                    <div className={`${isUrgent ? 'glass-panel border-error/50' : isManual ? 'bg-surface-container/40 border-primary/30' : 'bg-surface-container/40 border-surface-container-highest'} rounded-2xl p-6 border-l-2`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[0.65rem] font-bold uppercase tracking-widest ${isUrgent ? 'text-error' : isManual ? 'text-primary' : 'text-outline'}`}>
                          {isUrgent ? 'Calculado pela IA (Prazo Ativo)' : isManual ? 'Nota de Equipe' : 'Publicação Oficial'}
                        </span>
                        <span className="text-xs text-outline">{formatDistanceToNow(new Date(mov.occurred_at), { addSuffix: true, locale: ptBR })}</span>
                      </div>
                      
                      <h4 className="font-bold text-on-surface mb-2">{mov.title}</h4>
                      <p className="text-sm text-outline-variant leading-relaxed mb-4">{mov.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 rounded bg-surface-container-highest text-outline text-[0.6rem] font-bold uppercase">{mov.source}</span>
                          {mov.external_id && (
                            <span className="px-2 py-0.5 rounded bg-surface-container-highest text-outline text-[0.6rem] font-bold">Ref: {mov.external_id}</span>
                          )}
                        </div>
                        {isUrgent && (
                           <button className="text-primary text-xs font-bold hover:underline">Resolver Agora</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Contextual Widgets */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Prazos Ativos Widget */}
            <div className="glass-panel rounded-3xl p-6 border border-surface-container-highest/30">
              <div className="flex items-center gap-2 mb-4">
                <AlarmClock size={18} className="text-error" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-on-surface">Prazos Ativos</h4>
              </div>
              <div className="space-y-4">
                {movements.filter(m => m.metadata?.urgency === 'high').length > 0 ? (
                  movements.filter(m => m.metadata?.urgency === 'high').map((m, i) => (
                    <div key={i} className="p-4 rounded-xl bg-surface-container-low border-r-4 border-error">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[0.65rem] font-bold text-error">URGENTE</span>
                        <span className="text-[0.65rem] text-outline">Prazo Ativo</span>
                      </div>
                      <p className="text-xs font-semibold text-on-surface truncate">{m.title}</p>
                      <p className="text-[0.6rem] text-outline mt-1 truncate">{m.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-outline/60 italic">Nenhum prazo pendente identificado.</p>
                )}
              </div>
            </div>

            {/* Cliente Mini-card */}
            <div className="bg-surface-container rounded-3xl p-6 border border-surface-container-highest/20">
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-outline mb-4">Cliente</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-surface-container-highest overflow-hidden flex items-center justify-center text-primary font-bold">
                  {caseData.client_id ? 'CL' : 'N/A'}
                </div>
                <div>
                  <h5 className="font-bold text-on-surface text-sm">{caseData.client_id || 'Cliente não vinculado'}</h5>
                  <p className="text-xs text-outline">Ver detalhes do contato</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-surface-container-highest/20 flex justify-between">
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors">
                  <Phone size={18} className="text-outline" />
                </button>
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors">
                  <Mail size={18} className="text-outline" />
                </button>
                <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors">
                  <MessageCircle size={18} className="text-outline" />
                </button>
              </div>
            </div>

            {/* Tags Widget */}
            <div className="bg-surface-container rounded-3xl p-6 border border-surface-container-highest/20">
              <h4 className="text-[0.65rem] font-bold uppercase tracking-widest text-outline mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-surface-container-highest text-on-surface text-[0.6rem] font-medium rounded-lg">#trabalhista</span>
                <span className="px-2 py-1 bg-surface-container-highest text-on-surface text-[0.6rem] font-medium rounded-lg">#{caseData.court?.toLowerCase().replace(/\s+/g,'-') || 'jurisdicao'}</span>
                <button className="px-2 py-1 border border-dashed border-outline-variant rounded-lg text-[0.6rem] text-outline hover:text-primary">
                  + Adicionar
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Contextual FAB (Intelligence) */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        <div className="bg-primary text-on-primary p-4 rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-all">
          <Bot size={24} />
          <span className="font-bold text-sm">Análise de IA do Caso</span>
        </div>
      </div>
      {showEditModal && caseData && (
        <EditCaseModal
          caseData={caseData}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
