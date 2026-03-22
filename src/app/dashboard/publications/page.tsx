"use client";

import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, AlertCircle, CheckCircle2, Archive, Search, Filter, ExternalLink, Calendar, FileText, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type Publication = {
  id: string;
  tenant_id: string;
  publication_date: string;
  title: string;
  content: string;
  source: string;
  case_number: string | null;
  status: 'unread' | 'action_required' | 'archived';
  created_at: string;
};

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'action_required' | 'unread' | 'archived'>('all');
  
  const supabase = createClient();

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('publication_date', { ascending: false });

      if (error) throw error;
      setPublications(data || []);
    } catch (err) {
      console.error("Error fetching publications:", err);
    } finally {
      setLoading(false);
    }
  };

  const syncJusbrasil = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      // Get tenant_id for the current user
      const { data: tenantMember } = await supabase
        .from('tenant_members')
        .select('tenant_id')
        .eq('user_id', userData.user.id)
        .single();

      if (!tenantMember) throw new Error("No tenant found");

      const { data, error } = await supabase.functions.invoke('jusbrasil-sync', {
        body: { tenant_id: tenantMember.tenant_id }
      });

      if (error) throw error;
      
      setSyncMessage({ type: 'success', text: `Sincronização concluída: ${data.synced_publications} novas publicações.` });
      await fetchPublications();
    } catch (err: any) {
      console.error("Sync error:", err);
      setSyncMessage({ type: 'error', text: "Falha ao sincronizar com Jusbrasil B2B." });
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMessage(null), 5000);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('publications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setPublications(publications.map(p => 
        p.id === id ? { ...p, status: newStatus as any } : p
      ));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredPublications = publications.filter(p => {
    if (activeTab === 'all') return p.status !== 'archived';
    return p.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'action_required':
        return <span className="flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"><AlertCircle size={10} /> Urgente</span>;
      case 'unread':
        return <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"><BookOpen size={10} /> Não Lida</span>;
      case 'archived':
        return <span className="flex items-center gap-1 bg-gray-500/10 text-gray-400 border border-gray-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"><Archive size={10} /> Arquivada</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-secondary">
            <BookOpen className="text-primary" /> Clipping Jurídico
          </h1>
          <p className="text-secondary/60 text-sm mt-1">
            Varredura inteligente de diários oficiais (Integração Jusbrasil / DJEN).
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
          {syncMessage && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-in fade-in zoom-in duration-300 ${syncMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {syncMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {syncMessage.text}
            </div>
          )}
          <button 
            onClick={syncJusbrasil}
            disabled={syncing}
            className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 ${syncing ? 'opacity-70 cursor-wait' : ''}`}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Buscando recortes...' : 'Varrer Diários Oficiais'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface border border-primary/20 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-background/50 border-b border-primary/10">
              <h3 className="font-semibold text-sm text-secondary flex items-center gap-2"><Filter size={14}/> Filtros de Caixa</h3>
            </div>
            <div className="p-2 space-y-1">
              <button 
                onClick={() => setActiveTab('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'text-secondary/70 hover:bg-surface/80 hover:text-secondary'}`}
              >
                <div className="flex items-center gap-2"><BookOpen size={14} /> Caixa de Entrada</div>
                <span className="text-xs bg-background px-1.5 rounded border border-primary/10">{publications.filter(p => p.status !== 'archived').length}</span>
              </button>
              <button 
                onClick={() => setActiveTab('action_required')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'action_required' ? 'bg-red-500/10 text-red-400 font-semibold' : 'text-secondary/70 hover:bg-surface/80 hover:text-secondary'}`}
              >
                <div className="flex items-center gap-2"><AlertCircle size={14} /> Intervenção (Prazos)</div>
                {publications.filter(p => p.status === 'action_required').length > 0 && (
                  <span className="text-xs bg-red-500/20 text-red-500 px-1.5 rounded">{publications.filter(p => p.status === 'action_required').length}</span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('unread')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'unread' ? 'bg-primary/10 text-primary font-semibold' : 'text-secondary/70 hover:bg-surface/80 hover:text-secondary'}`}
              >
                <div className="flex items-center gap-2"><FileText size={14} /> Não Lidas</div>
              </button>
              <button 
                onClick={() => setActiveTab('archived')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === 'archived' ? 'bg-primary/10 text-primary font-semibold' : 'text-secondary/70 hover:bg-surface/80 hover:text-secondary'}`}
              >
                <div className="flex items-center gap-2"><Archive size={14} /> Arquivadas</div>
              </button>
            </div>
          </div>
        </div>

        {/* Content Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {loading ? (
             <div className="bg-surface border border-primary/10 rounded-xl p-12 flex flex-col items-center justify-center text-secondary/40">
                <RefreshCw className="animate-spin mb-4" size={24} />
                <p>Carregando recortes...</p>
             </div>
          ) : filteredPublications.length === 0 ? (
            <div className="bg-surface border border-primary/10 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4 border border-primary/10">
                <BookOpen size={24} className="text-primary/40" />
              </div>
              <h3 className="text-secondary font-medium mb-1">Nenhum recorte encontrado.</h3>
              <p className="text-sm text-secondary/50 max-w-sm">
                Sua caixa de clipping está vazia para esta categoria. Clique no botão de varredura para forçar uma nova captura.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPublications.map(pub => (
                <div key={pub.id} className={`bg-surface border rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${pub.status === 'action_required' ? 'border-red-500/30' : 'border-primary/20'}`}>
                  {pub.status === 'action_required' && (
                     <div className="bg-red-500/10 px-4 py-2 border-b border-red-500/20 flex items-center gap-2">
                       <AlertCircle size={14} className="text-red-500" />
                       <span className="text-xs font-bold uppercase tracking-wider text-red-500">Atenção Prioritária (Análise Vigia 24/7)</span>
                     </div>
                  )}
                  
                  <div className="p-5 p-px flex flex-col">
                    <div className="p-5 pt-4">
                      <div className="flex items-start justify-between mb-3 gap-4">
                        <div className="space-y-1">
                          {getStatusBadge(pub.status)}
                          <h3 className="text-lg font-bold text-secondary">{pub.title}</h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-secondary/60">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {format(new Date(pub.publication_date), "dd/MM/yyyy")}</span>
                            <span className="flex items-center gap-1 font-semibold text-primary/70">{pub.source}</span>
                            {pub.case_number && (
                              <span className="flex items-center gap-1 font-mono bg-background px-1.5 py-0.5 rounded border border-primary/10">
                                {pub.case_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-background rounded-lg p-4 border border-primary/5 text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {pub.content.length > 300 && pub.status === 'unread' 
                          ? pub.content.substring(0, 300) + '...'
                          : pub.content}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
                        <span className="text-xs text-secondary/40 flex items-center gap-1">
                          Capturado {formatDistanceToNow(new Date(pub.created_at), { addSuffix: true, locale: ptBR })}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {pub.status !== 'archived' && (
                            <button 
                              onClick={() => updateStatus(pub.id, 'archived')}
                              className="px-3 py-1.5 text-xs font-semibold text-secondary/60 hover:text-secondary hover:bg-background rounded-lg border border-transparent hover:border-primary/10 transition-colors"
                            >
                              Arquivar
                            </button>
                          )}
                          {pub.status === 'unread' && (
                            <button 
                              onClick={() => updateStatus(pub.id, 'action_required')}
                              className="px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors flex items-center gap-1"
                            >
                              Destacar Prazo <ChevronRight size={12}/>
                            </button>
                          )}
                          {pub.status === 'action_required' && (
                            <button 
                              onClick={() => updateStatus(pub.id, 'unread')}
                              className="px-3 py-1.5 text-xs font-semibold text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary rounded-lg transition-all flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 size={12} /> Marcar Resolvido
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
