"use client";

import { useState } from "react";
import { 
  ArrowLeft, FileSearch, PenTool, Loader2, Copy, Check, 
  AlertTriangle, CheckCircle2, XCircle, Edit3, Sparkles, Scale, Download
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";
import { formatDateBR } from "@/utils/dateFormat";
import { maskPII } from "@/utils/lgpdMask";
import { CustomSelect } from "@/components/CustomSelect";

const legalAreas = ["Trabalhista", "Consumidor", "Família", "Criminal", "Empresarial", "Imobiliário", "Tributário", "Previdenciário"];
const pieceTypes = ["Petição Inicial", "Contestação", "Recurso Ordinário", "Agravo de Instrumento", "Embargos de Declaração", "Mandado de Segurança", "Habeas Corpus", "Contrarrazões"];

export default function CognitiveToolsPage() {
  const { tenantId } = useTenantId();
  
  // Synthesis state
  const [synthInput, setSynthInput] = useState("");
  const [synthResult, setSynthResult] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Drafting state
  const [draftArea, setDraftArea] = useState("");
  const [draftPiece, setDraftPiece] = useState("");
  const [draftContext, setDraftContext] = useState("");
  const [draftResult, setDraftResult] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [hitlDecision, setHitlDecision] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [copied, setCopied] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);

  // Case party / court fields
  const [partyAutor, setPartyAutor] = useState("");
  const [partyReu, setPartyReu] = useState("");
  const [judgeName, setJudgeName] = useState("");
  const [courtVara, setCourtVara] = useState("");
  const [courtComarca, setCourtComarca] = useState("");
  const [processNumber, setProcessNumber] = useState("");
  const [lawyerName, setLawyerName] = useState("");
  const [lawyerOab, setLawyerOab] = useState("");

  // Count existing drafts
  const { data: draftCount } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('ai_drafts')
        .select('id')
        .eq('tenant_id', tenantId);
    },
    [tenantId]
  );

  const handleSynthesize = async () => {
    if (!synthInput || !tenantId) return;
    setIsSynthesizing(true);
    setSynthResult("");
    
    try {
      const supabase = createClient();
      
      // Call edge function for synthesis — mask PII before sending (LGPD RNF02)
      const { data, error: invokeError } = await supabase.functions.invoke('document-tools', {
        body: { mode: 'synthesize', text: maskPII(synthInput) }
      });

      if (invokeError) throw invokeError;
      
      setSynthResult(data.result || data.text || "Falha ao extrair a síntese gerada.");

      // Save synthesis request to knowledge_base for reference
      await supabase.from('knowledge_base').insert({
        tenant_id: tenantId,
        title: `Síntese — ${formatDateBR(new Date())}`,
        content: `**Input Original:**\n${synthInput}\n\n**Síntese Gerada:**\n${data.result || data.text}`,
        metadata: { type: 'synthesis_input', processed_at: new Date().toISOString() }
      });
    } catch (err: any) {
      setSynthResult(`❌ Erro ao processar: ${err.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleDraft = async () => {
    if (!draftArea || !draftPiece || !draftContext || !tenantId) return;
    setIsDrafting(true);
    setDraftResult("");
    setHitlDecision('pending');
    setSavedDraftId(null);
    
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      // Call edge function for drafting — mask PII before sending (LGPD RNF02)
      const { data, error: invokeError } = await supabase.functions.invoke('document-tools', {
        body: { 
          mode: 'draft', 
          piece_type: draftPiece, 
          legal_area: draftArea, 
          case_context: maskPII(draftContext),
          parties: {
            autor: partyAutor || undefined,
            reu: partyReu || undefined,
          },
          court: {
            judge: judgeName || undefined,
            vara: courtVara || undefined,
            comarca: courtComarca || undefined,
            process_number: processNumber || undefined,
          },
          lawyer: {
            name: lawyerName || undefined,
            oab: lawyerOab || undefined,
          }
        }
      });

      if (invokeError) throw invokeError;
      
      const draftContent = data.result || data.text || "Falha ao gerar o conteúdo da minuta.";

      // Save draft to ai_drafts table
      const { data: savedDraft, error } = await supabase.from('ai_drafts').insert({
        tenant_id: tenantId,
        created_by: userData?.user?.id,
        title: `${draftPiece} - ${draftArea}`,
        content: draftContent,
        draft_type: draftPiece.toLowerCase().replace(/\s+/g, '_'),
        status: 'rascunho',
        ai_model: 'template_v1',
        prompt_used: draftContext,
        metadata: { area: draftArea, piece_type: draftPiece }
      }).select('id').single();

      if (error) throw error;
      
      setSavedDraftId(savedDraft?.id || null);
      setDraftResult(draftContent);
    } catch (err: any) {
      setDraftResult(`❌ Erro ao gerar minuta: ${err.message}`);
      setHitlDecision(null);
    } finally {
      setIsDrafting(false);
    }
  };

  const handleHitlDecision = async (decision: 'approved' | 'rejected') => {
    setHitlDecision(decision);
    if (savedDraftId) {
      try {
        const supabase = createClient();
        await supabase.from('ai_drafts').update({
          status: decision === 'approved' ? 'aprovado' : 'rejeitado',
          metadata: { hitl_decision: decision, decided_at: new Date().toISOString() }
        }).eq('id', savedDraftId);
      } catch (err) {
        // Silently fail — UI already updated
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftResult || synthResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-theme(spacing.16))] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6">
        <Link href="/dashboard/intelligence" className="p-2 hover:bg-surface rounded-lg text-secondary/40 hover:text-primary transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Scale className="text-primary" size={20} />
            Ferramentas de IA
          </h1>
          <p className="text-sm text-secondary/50">Síntese documental e co-piloto de redação forense com controle HITL.</p>
        </div>
        {draftCount && draftCount.length > 0 && (
          <span className="text-[10px] bg-purple-500/10 text-purple-500 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
            {draftCount.length} minuta(s) salva(s)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* LEFT: Document Synthesis */}
        <div className="flex flex-col bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] overflow-hidden">
          <div className="p-5 border-b border-primary/5 bg-background/20 font-medium text-sm text-secondary/80 flex items-center gap-2">
            <FileSearch size={16} className="text-blue-500" />
            Síntese Documental
            <span className="ml-auto text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-bold uppercase">Análise</span>
          </div>
          
          {synthResult ? (
            <div className="flex-1 p-5 overflow-y-auto">
              <div className="prose prose-sm prose-invert max-w-none text-secondary/80 text-sm leading-relaxed [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-secondary [&_h1]:mb-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-secondary/90 [&_h2]:mb-2 [&_h2]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-secondary/80 [&_h3]:mb-1.5 [&_p]:mb-2.5 [&_p]:text-secondary/70 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_li]:text-secondary/70 [&_strong]:text-secondary/90 [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-secondary/50">
                <ReactMarkdown>{synthResult}</ReactMarkdown>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-primary/5">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/15 transition-colors">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copiado!" : "Copiar"}
                </button>
                <button onClick={() => setSynthResult("")} className="flex items-center gap-1.5 px-3 py-2 bg-surface text-secondary/50 rounded-lg text-xs font-medium hover:bg-background/50 transition-colors border border-primary/5">
                  Nova Análise
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 p-5">
                <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Texto do Documento / Peça</label>
                <textarea 
                  value={synthInput}
                  onChange={(e) => setSynthInput(e.target.value)}
                  placeholder="Cole aqui o texto integral do contrato, petição, sentença ou qualquer peça processual que deseja sintetizar..."
                  className="w-full h-full min-h-[300px] p-4 bg-background/50 rounded-xl text-sm text-secondary/90 placeholder:text-secondary/25 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/30 border border-primary/[0.05]"
                />
              </div>
              <div className="p-5 border-t border-primary/5 bg-background/20">
                <button 
                  onClick={handleSynthesize}
                  disabled={isSynthesizing || !synthInput}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSynthesizing ? <Loader2 size={18} className="animate-spin" /> : <FileSearch size={18} />}
                  {isSynthesizing ? "Processando e salvando..." : "Gerar Síntese Estruturada"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Drafting Assistant */}
        <div className="flex flex-col bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] overflow-hidden">
          <div className="p-5 border-b border-primary/5 bg-background/20 font-medium text-sm text-secondary/80 flex items-center gap-2">
            <PenTool size={16} className="text-purple-500" />
            Co-Piloto de Redação
            <span className="ml-auto text-[10px] bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded font-bold uppercase">Drafting</span>
          </div>

          {draftResult ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* HITL Decision Banner */}
              {hitlDecision === 'pending' && (
                <div className="m-4 p-4 bg-yellow-500/[0.06] rounded-xl border border-yellow-500/[0.1]">
                  <div className="flex items-start gap-2.5 mb-3">
                    <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-yellow-400 font-semibold">Human-in-the-Loop — Aprovação Obrigatória</p>
                      <p className="text-[10px] text-secondary/40 mt-0.5">Conforme Provimento 222/2023 da OAB, esta minuta gerada por IA DEVE ser revisada por um advogado antes de qualquer uso oficial.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleHitlDecision('approved')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-600/30 transition-colors">
                      <CheckCircle2 size={14} />
                      Aprovar Minuta
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-500/20 transition-colors">
                      <Edit3 size={14} />
                      Editar
                    </button>
                    <button onClick={() => handleHitlDecision('rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors">
                      <XCircle size={14} />
                      Rejeitar
                    </button>
                  </div>
                </div>
              )}
              {hitlDecision === 'approved' && (
                <div className="mx-4 mt-4 p-3 bg-green-500/[0.06] rounded-xl border border-green-500/[0.1] flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p className="text-xs text-green-400 font-medium">Minuta aprovada pelo advogado. Status atualizado na base (ai_drafts).</p>
                </div>
              )}
              {hitlDecision === 'rejected' && (
                <div className="mx-4 mt-4 p-3 bg-red-500/[0.06] rounded-xl border border-red-500/[0.1] flex items-center gap-2">
                  <XCircle size={14} className="text-red-500" />
                  <p className="text-xs text-red-400 font-medium">Minuta rejeitada. Status atualizado na base (ai_drafts). Clique em &quot;Nova Minuta&quot; para regenerar.</p>
                </div>
              )}
              
              <div className="flex-1 p-5 overflow-y-auto bg-[#1a2236]">
                <div className="max-w-[210mm] mx-auto bg-white rounded-sm shadow-[0_2px_20px_rgba(0,0,0,0.4)] print-area">
                  <div className="px-[60px] py-[50px] prose prose-sm max-w-none text-gray-800 text-[13px] leading-[1.8] font-['Times_New_Roman',_serif] [&_h1]:text-[18px] [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mb-4 [&_h1]:text-center [&_h1]:uppercase [&_h1]:tracking-wide [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:uppercase [&_h3]:text-[14px] [&_h3]:font-semibold [&_h3]:text-gray-700 [&_h3]:mb-1.5 [&_p]:mb-3 [&_p]:text-gray-700 [&_p]:text-justify [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-[upper-roman] [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_li]:text-gray-700 [&_strong]:text-gray-900 [&_strong]:font-bold [&_blockquote]:border-l-[3px] [&_blockquote]:border-gray-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_hr]:border-gray-300 [&_hr]:my-5">
                    <ReactMarkdown>{draftResult}</ReactMarkdown>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-primary/5 bg-background/20">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/15 transition-colors">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copiado!" : "Copiar Minuta"}
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/15 transition-colors">
                  <Download size={13} />
                  Baixar PDF
                </button>
                <button onClick={() => { setDraftResult(""); setHitlDecision(null); setSavedDraftId(null); }} className="flex items-center gap-1.5 px-3 py-2 bg-surface text-secondary/50 rounded-lg text-xs font-medium hover:bg-background/50 transition-colors border border-primary/5">
                  Nova Minuta
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Área do Direito</label>
                    <CustomSelect 
                      options={legalAreas.map(a => ({ value: a, label: a }))}
                      value={draftArea}
                      onChange={setDraftArea}
                      placeholder="Selecione..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Tipo de Peça</label>
                    <CustomSelect 
                      options={pieceTypes.map(p => ({ value: p, label: p }))}
                      value={draftPiece}
                      onChange={setDraftPiece}
                      placeholder="Selecione..."
                    />
                  </div>
                </div>

                {/* Dados Processuais */}
                <div className="pt-2 border-t border-primary/5">
                  <p className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest mb-3">Dados Processuais (opcional)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Autor (Requerente)</label>
                      <input 
                        type="text" value={partyAutor} onChange={e => setPartyAutor(e.target.value)}
                        placeholder="Nome completo do autor"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Réu (Requerido)</label>
                      <input 
                        type="text" value={partyReu} onChange={e => setPartyReu(e.target.value)}
                        placeholder="Nome completo do réu"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Juiz(a)</label>
                      <input 
                        type="text" value={judgeName} onChange={e => setJudgeName(e.target.value)}
                        placeholder="Dr(a). Nome do juiz"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Vara</label>
                      <input 
                        type="text" value={courtVara} onChange={e => setCourtVara(e.target.value)}
                        placeholder="Ex: 3ª Vara Cível"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Comarca</label>
                      <input 
                        type="text" value={courtComarca} onChange={e => setCourtComarca(e.target.value)}
                        placeholder="Ex: São Paulo/SP"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Nº do Processo</label>
                      <input 
                        type="text" value={processNumber} onChange={e => setProcessNumber(e.target.value)}
                        placeholder="0000000-00.0000.0.00.0000"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Advogado(a) Subscritor</label>
                      <input 
                        type="text" value={lawyerName} onChange={e => setLawyerName(e.target.value)}
                        placeholder="Nome do advogado"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-secondary/50 mb-1">Nº da OAB</label>
                      <input 
                        type="text" value={lawyerOab} onChange={e => setLawyerOab(e.target.value)}
                        placeholder="UF000000"
                        className="w-full px-3 py-2 bg-background/50 rounded-lg text-sm text-secondary/90 placeholder:text-secondary/25 focus:outline-none focus:ring-1 focus:ring-purple-500/20 border border-primary/[0.05]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Contexto Factual do Caso</label>
                  <textarea 
                    value={draftContext}
                    onChange={(e) => setDraftContext(e.target.value)}
                    placeholder="Descreva os fatos do caso em linguagem natural. A IA usará o RAG da base de conhecimento e gerará a minuta fundamentada..."
                    className="w-full min-h-[140px] p-4 bg-background/50 rounded-xl text-sm text-secondary/90 placeholder:text-secondary/25 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/30 border border-primary/[0.05]"
                  />
                </div>
              </div>
              <div className="p-5 border-t border-primary/5 bg-background/20">
                <button 
                  onClick={handleDraft}
                  disabled={isDrafting || !draftArea || !draftPiece || !draftContext}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-500 transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDrafting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {isDrafting ? "Gerando e salvando..." : "Gerar Minuta (Co-Piloto)"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
