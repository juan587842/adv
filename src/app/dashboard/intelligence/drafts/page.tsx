"use client";

import { useState } from "react";
import { FileText, Calendar, PenTool, CheckCircle, XCircle, Search, Clock, FileKey, User, FileOutput, ShieldAlert, ArrowLeft, Copy } from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { formatDateBR } from "@/utils/dateFormat";
import ReactMarkdown from "react-markdown";

type Draft = {
  id: string;
  title: string;
  content: string;
  draft_type: string;
  status: 'rascunho' | 'aprovado' | 'rejeitado';
  created_at: string;
  ai_model: string;
  metadata: { area?: string, piece_type?: string };
};

export default function DraftsPage() {
  const { tenantId } = useTenantId();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

  const { data: drafts, isLoading } = useSupabaseQuery<Draft[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('ai_drafts')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const filteredDrafts = drafts?.filter(draft => 
    draft.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.metadata?.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.draft_type?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'aprovado': return <CheckCircle size={14} className="text-green-500" />;
      case 'rejeitado': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-amber-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'aprovado': return "Aprovado via HITL";
      case 'rejeitado': return "Rejeitado via HITL";
      default: return "Rascunho (Pendente)";
    }
  };

  return (
    <div className="flex h-full bg-background relative overflow-hidden">
      {/* List Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-primary/5 flex flex-col bg-card/30 ${selectedDraft ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-primary/5">
          <div className="flex items-center gap-2 text-primary font-medium mb-1">
            <FileText size={18} />
            <h2>Minutas Salvas</h2>
          </div>
          <p className="text-xs text-secondary/60 mb-4">
            Histórico de peças geradas pelas Ferramentas Cognitivas.
          </p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={14} />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar título ou área..."
              className="w-full pl-9 pr-3 py-2 bg-background/50 rounded-lg text-sm text-secondary placeholder:text-secondary/30 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/5"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-secondary/40">Carregando histórico...</div>
          ) : filteredDrafts.length === 0 ? (
            <div className="p-4 text-center text-sm text-secondary/40">Nenhuma minuta encontrada.</div>
          ) : (
            filteredDrafts.map((draft) => (
              <button
                key={draft.id}
                onClick={() => setSelectedDraft(draft)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedDraft?.id === draft.id 
                    ? 'bg-primary/[0.03] border-primary/20 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-primary/5'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium text-secondary/90 truncate flex-1 pr-2">
                    {draft.title || (draft.metadata?.piece_type ? `${draft.metadata.piece_type} - ${draft.metadata.area}` : 'Minuta')}
                  </h3>
                  <div className="flex-shrink-0 mt-0.5" title={getStatusText(draft.status)}>
                    {getStatusIcon(draft.status)}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-secondary/50">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {formatDateBR(new Date(draft.created_at))}
                  </span>
                  <span className="flex items-center gap-1">
                    <PenTool size={10} />
                    {draft.metadata?.area || 'Geral'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor/View Panel */}
      <div className={`flex-1 flex flex-col ${!selectedDraft ? 'hidden md:flex' : 'flex'}`}>
        {!selectedDraft ? (
          <div className="flex-1 flex items-center justify-center bg-card/10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <FileText size={24} opacity={0.8} />
              </div>
              <h3 className="text-lg font-medium text-secondary/80">Nenhuma minuta selecionada</h3>
              <p className="text-sm text-secondary/50 mt-1 max-w-sm">
                Selecione uma minuta no painel lateral para visualizar o conteúdo gerado pela IA.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-none p-4 border-b border-primary/5 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <button 
                    onClick={() => setSelectedDraft(null)} 
                    className="md:hidden mr-2 p-1.5 -ml-1.5 hover:bg-primary/10 rounded-md text-secondary/60"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h2 className="text-lg font-medium text-secondary">
                    {selectedDraft.title || 'Minuta Sem Título'}
                  </h2>
                  <span className={`px-2 flex items-center gap-1 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded-full border ${
                    selectedDraft.status === 'aprovado' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    selectedDraft.status === 'rejeitado' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {getStatusIcon(selectedDraft.status)}
                    {getStatusText(selectedDraft.status)}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-secondary/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-primary/60" />
                    Criada em: {formatDateBR(new Date(selectedDraft.created_at))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PenTool size={13} className="text-primary/60" />
                    Área: <span className="font-medium text-secondary/80">{selectedDraft.metadata?.area || 'Definida no prompt'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert size={13} className="text-amber-500" />
                    LGPD: <span className="font-medium text-secondary/80">Anonimizado antes do envio</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start flex-shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedDraft.content);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-background border border-primary/20 text-secondary hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Copy size={14} /> Copiar Texto
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-card/30 flex justify-center">
              <div className="w-full max-w-4xl">
                <div className="bg-background rounded-xl p-6 md:p-10 shadow-sm border border-primary/10 prose prose-sm md:prose-base prose-invert prose-p:text-secondary/80 prose-headings:text-secondary/90 prose-strong:text-purple-400 prose-a:text-primary max-w-none">
                  <ReactMarkdown>{selectedDraft.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
