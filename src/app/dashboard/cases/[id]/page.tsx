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
  const [activeTab, setActiveTab] = useState('movimentacoes');
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTag, setNewTag] = useState<string | null>(null);

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
          {[
            { key: 'movimentacoes', label: 'Movimentações', icon: <Activity size={18} /> },
            { key: 'documentos', label: 'Documentos', icon: <FileText size={18} /> },
            { key: 'notas', label: 'Notas', icon: <StickyNote size={18} /> },
            { key: 'financeiro', label: 'Financeiro', icon: <Wallet size={18} /> },
            { key: 'ia', label: 'IA Assistente', icon: <Bot size={18} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.key
                  ? 'text-primary font-semibold border-primary'
                  : 'text-outline hover:text-on-surface border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column: Timeline Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {activeTab === 'movimentacoes' && (
              <>
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
              <div className="flex gap-2 items-center">
                {showSearch && (
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar movimentação..."
                    className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/20 rounded-lg text-sm text-on-surface placeholder:text-outline/40 outline-none focus:border-primary/50 w-48 animate-in slide-in-from-right-2 duration-200"
                    autoFocus
                  />
                )}
                <button
                  onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchTerm(''); }}
                  className={`p-2 rounded-lg transition-colors ${showSearch ? 'bg-primary/10 text-primary' : 'bg-surface-container-low hover:bg-surface-container-highest text-outline'}`}
                >
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

              {movements.filter(m => !searchTerm || m.title.toLowerCase().includes(searchTerm.toLowerCase()) || m.description.toLowerCase().includes(searchTerm.toLowerCase())).map((mov, i) => {
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
                           <button
                             onClick={async () => {
                               const { error } = await supabase.from('case_movements').update({ metadata: { ...mov.metadata, urgency: 'resolved' } }).eq('id', mov.id);
                               if (!error) window.location.reload();
                             }}
                             className="text-primary text-xs font-bold hover:underline"
                           >Resolver Agora</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
              </>
            )}

            {activeTab === 'documentos' && (
              <div className="bg-surface-container/40 rounded-2xl p-8 text-center">
                <Upload size={32} className="mx-auto text-outline/40 mb-3" />
                <h3 className="text-lg font-bold text-on-surface mb-1">Documentos do Dossiê</h3>
                <p className="text-sm text-outline/60 max-w-sm mx-auto">Nenhum documento anexado. Arraste arquivos aqui ou use o botão para fazer upload de petições, procurações e contratos.</p>
                <button className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center gap-2 mx-auto">
                  <Upload size={16} /> Upload de Documento
                </button>
              </div>
            )}

            {activeTab === 'notas' && (
              <div className="bg-surface-container/40 rounded-2xl p-8 text-center">
                <StickyNote size={32} className="mx-auto text-outline/40 mb-3" />
                <h3 className="text-lg font-bold text-on-surface mb-1">Notas da Equipe</h3>
                <p className="text-sm text-outline/60 max-w-sm mx-auto">Adicione notas internas sobre o andamento do caso, reuniões com o cliente ou estratégias processuais.</p>
                <button className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors flex items-center gap-2 mx-auto">
                  <StickyNote size={16} /> Nova Nota
                </button>
              </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="bg-surface-container/40 rounded-2xl p-8 text-center">
                <Wallet size={32} className="mx-auto text-outline/40 mb-3" />
                <h3 className="text-lg font-bold text-on-surface mb-1">Financeiro do Caso</h3>
                <p className="text-sm text-outline/60 max-w-sm mx-auto">Gerencie honorários, custas judiciais e alvarás vinculados a este dossiê.</p>
                <Link href="/dashboard/financial" className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors inline-flex items-center gap-2">
                  <Wallet size={16} /> Ver Financeiro Geral
                </Link>
              </div>
            )}

            {activeTab === 'ia' && (
              <div className="bg-surface-container/40 rounded-2xl p-8 text-center">
                <Bot size={32} className="mx-auto text-primary/40 mb-3" />
                <h3 className="text-lg font-bold text-on-surface mb-1">IA Assistente</h3>
                <p className="text-sm text-outline/60 max-w-sm mx-auto">Use a inteligência artificial para gerar análises de risco, resumos do caso e sugestões de estratégia processual.</p>
                <Link href="/dashboard/intelligence/watcher" className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors inline-flex items-center gap-2">
                  <Bot size={16} /> Abrir Central de Inteligência
                </Link>
              </div>
            )}

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
                <button onClick={() => { if (caseData.client_id) router.push(`/dashboard/contacts/${caseData.client_id}`); else alert('Nenhum cliente vinculado.'); }} className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors" title="Ligar">
                  <Phone size={18} className="text-outline" />
                </button>
                <button onClick={() => { if (caseData.client_id) router.push(`/dashboard/contacts/${caseData.client_id}`); else alert('Nenhum cliente vinculado.'); }} className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors" title="E-mail">
                  <Mail size={18} className="text-outline" />
                </button>
                <button onClick={() => router.push('/dashboard/inbox')} className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-colors" title="Mensagem">
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
                {newTag !== null ? (
                  <input
                    type="text"
                    autoFocus
                    placeholder="tag..."
                    className="px-2 py-1 border border-primary/30 rounded-lg text-[0.6rem] text-on-surface bg-surface-container-low outline-none w-20"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setNewTag(null); }}
                    onBlur={() => setNewTag(null)}
                  />
                ) : (
                  <button
                    onClick={() => setNewTag('')}
                    className="px-2 py-1 border border-dashed border-outline-variant rounded-lg text-[0.6rem] text-outline hover:text-primary"
                  >
                    + Adicionar
                  </button>
                )}
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Contextual FAB (Intelligence) */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-3 z-50">
        <Link
          href="/dashboard/intelligence/watcher"
          className="bg-primary text-on-primary p-4 rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          <Bot size={24} />
          <span className="font-bold text-sm">Análise de IA do Caso</span>
        </Link>
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
