"use client";

import { useState } from "react";
import { 
  ArrowLeft, FileSearch, PenTool, Loader2, Copy, Check, 
  AlertTriangle, CheckCircle2, XCircle, Edit3, Sparkles, Scale
} from "lucide-react";
import Link from "next/link";

const legalAreas = ["Trabalhista", "Consumidor", "Família", "Criminal", "Empresarial", "Imobiliário", "Tributário", "Previdenciário"];
const pieceTypes = ["Petição Inicial", "Contestação", "Recurso Ordinário", "Agravo de Instrumento", "Embargos de Declaração", "Mandado de Segurança", "Habeas Corpus", "Contrarrazões"];

export default function CognitiveToolsPage() {
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

  const handleSynthesize = async () => {
    if (!synthInput) return;
    setIsSynthesizing(true);
    setSynthResult("");
    // Simulate Edge Function call
    setTimeout(() => {
      setSynthResult(`## Síntese Documental

### Partes Envolvidas
- **Autor:** João da Silva Pereira (CPF: 123.456.789-00)
- **Réu:** Empresa XYZ Ltda. (CNPJ: 12.345.678/0001-90)

### Objeto
Ação trabalhista decorrente de rescisão contratual sem justa causa, com pedido de verbas rescisórias, horas extras, adicional de insalubridade e danos morais.

### Prazos Identificados
- **Prazo para contestação:** 15 dias úteis (Art. 847, CLT)
- **Audiência designada:** 15/04/2026 às 14h
- **Prazo prescricional:** 2 anos a contar da rescisão (11/2024)

### Obrigações
| Parte | Obrigação |
|---|---|
| Réu | Pagamento de FGTS + 40% multa rescisória |
| Réu | Entrega de guias TRCT e CD/SD |
| Autor | Comprovação de vínculo e jornada extraordinária |

### Penalidades e Cláusulas Críticas
- ⚠️ Multa do Art. 477, §8° da CLT por atraso na homologação
- ⚠️ Risco de litigância de má-fé se não comprovadas as horas extras

### Resumo Executivo
Trata-se de reclamação trabalhista com pedido cumulado de verbas rescisórias e indenizações. O caso apresenta **urgência moderada** devido ao prazo prescricional em curso. Recomenda-se priorizar a produção de provas documentais da jornada e calcular os valores devidos a título de FGTS com multa rescisória.`);
      setIsSynthesizing(false);
    }, 2500);
  };

  const handleDraft = async () => {
    if (!draftArea || !draftPiece || !draftContext) return;
    setIsDrafting(true);
    setDraftResult("");
    setHitlDecision('pending');
    // Simulate Edge Function call
    setTimeout(() => {
      setDraftResult(`# ${draftPiece.toUpperCase()}
## ${draftArea}

**EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA ___ VARA ${draftArea.toUpperCase()} DA COMARCA DE [REVISAR]**

---

**[REVISAR - NOME DO AUTOR]**, brasileiro(a), [REVISAR - estado civil], [REVISAR - profissão], inscrito(a) no CPF sob o nº [REVISAR], residente e domiciliado(a) em [REVISAR], vem, respeitosamente, à presença de Vossa Excelência, por intermédio de seu(sua) advogado(a) infra-assinado(a), com fundamento nos artigos que se seguem, propor a presente

## ${draftPiece.toUpperCase()}

em face de **[REVISAR - NOME DO RÉU]**, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº [REVISAR], com sede em [REVISAR], pelos fatos e fundamentos que passa a expor:

---

## I — DOS FATOS

${draftContext}

[REVISAR - Complementar com detalhes cronológicos e provas documentais]

## II — DO DIREITO

A pretensão autoral encontra amparo legal nos seguintes dispositivos:

${draftArea === 'Trabalhista' ? '- **Art. 7°, incisos I a XXXIV da CF/88** — Direitos fundamentais dos trabalhadores\n- **Arts. 457 a 467 da CLT** — Da remuneração\n- **Art. 477, §8° da CLT** — Multa por atraso na homologação\n- **Súmula 331 do TST** — Responsabilidade subsidiária' : draftArea === 'Consumidor' ? '- **Art. 6° do CDC** — Direitos Básicos do Consumidor\n- **Art. 14 do CDC** — Responsabilidade pelo fato do serviço\n- **Art. 18 do CDC** — Responsabilidade por vício do produto\n- **Art. 42 do CDC** — Cobrança de dívidas' : '- [REVISAR - Inserir fundamentação legal específica]\n- [REVISAR - Jurisprudência aplicável]'}

## III — DOS PEDIDOS

Ante o exposto, requer a Vossa Excelência:

a) A citação do(a) réu(ré) para, querendo, contestar a presente ação;
b) [REVISAR - Pedidos específicos];
c) A condenação do(a) réu(ré) ao pagamento de custas processuais e honorários advocatícios;
d) A concessão dos benefícios da Justiça Gratuita, nos termos do Art. 98 do CPC.

**Dá-se à causa o valor de R$ [REVISAR].**

Nestes termos,
Pede deferimento.

[REVISAR - Cidade], ${new Date().toLocaleDateString('pt-BR')}

---
**[REVISAR - Nome do Advogado]**
OAB/[REVISAR] nº [REVISAR]`);
      setIsDrafting(false);
    }, 3000);
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
        <div>
          <h1 className="text-xl font-bold text-secondary flex items-center gap-2">
            <Scale className="text-primary" size={20} />
            Ferramentas Cognitivas
          </h1>
          <p className="text-sm text-secondary/50">Síntese documental e co-piloto de redação forense com controle HITL.</p>
        </div>
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
              <div className="prose prose-sm prose-invert max-w-none text-secondary/80 text-sm leading-relaxed whitespace-pre-wrap">
                {synthResult}
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
                  {isSynthesizing ? "Analisando com IA..." : "Gerar Síntese Estruturada"}
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
                    <button onClick={() => setHitlDecision('approved')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600/20 text-green-400 rounded-lg text-xs font-semibold hover:bg-green-600/30 transition-colors">
                      <CheckCircle2 size={14} />
                      Aprovar Minuta
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-semibold hover:bg-blue-500/20 transition-colors">
                      <Edit3 size={14} />
                      Editar
                    </button>
                    <button onClick={() => setHitlDecision('rejected')} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/20 transition-colors">
                      <XCircle size={14} />
                      Rejeitar
                    </button>
                  </div>
                </div>
              )}
              {hitlDecision === 'approved' && (
                <div className="mx-4 mt-4 p-3 bg-green-500/[0.06] rounded-xl border border-green-500/[0.1] flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <p className="text-xs text-green-400 font-medium">Minuta aprovada pelo advogado. Pronta para uso processual.</p>
                </div>
              )}
              {hitlDecision === 'rejected' && (
                <div className="mx-4 mt-4 p-3 bg-red-500/[0.06] rounded-xl border border-red-500/[0.1] flex items-center gap-2">
                  <XCircle size={14} className="text-red-500" />
                  <p className="text-xs text-red-400 font-medium">Minuta rejeitada. Clique em "Nova Minuta" para regenerar.</p>
                </div>
              )}
              
              <div className="flex-1 p-5 overflow-y-auto">
                <div className="prose prose-sm prose-invert max-w-none text-secondary/80 text-sm leading-relaxed whitespace-pre-wrap">
                  {draftResult}
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-primary/5 bg-background/20">
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/15 transition-colors">
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copiado!" : "Copiar Minuta"}
                </button>
                <button onClick={() => { setDraftResult(""); setHitlDecision(null); }} className="flex items-center gap-1.5 px-3 py-2 bg-surface text-secondary/50 rounded-lg text-xs font-medium hover:bg-background/50 transition-colors border border-primary/5">
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
                    <select 
                      value={draftArea} 
                      onChange={e => setDraftArea(e.target.value)}
                      className="w-full px-3 py-2.5 bg-background/50 rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-purple-500/30 border border-primary/[0.05] appearance-none"
                    >
                      <option value="">Selecione...</option>
                      {legalAreas.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Tipo de Peça</label>
                    <select 
                      value={draftPiece}
                      onChange={e => setDraftPiece(e.target.value)}
                      className="w-full px-3 py-2.5 bg-background/50 rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-purple-500/30 border border-primary/[0.05] appearance-none"
                    >
                      <option value="">Selecione...</option>
                      {pieceTypes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Contexto Factual do Caso</label>
                  <textarea 
                    value={draftContext}
                    onChange={(e) => setDraftContext(e.target.value)}
                    placeholder="Descreva os fatos do caso em linguagem natural. A IA usará o RAG da base de conhecimento e gerará a minuta fundamentada..."
                    className="w-full min-h-[200px] p-4 bg-background/50 rounded-xl text-sm text-secondary/90 placeholder:text-secondary/25 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/30 border border-primary/[0.05]"
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
                  {isDrafting ? "Redigindo com IA + RAG..." : "Gerar Minuta (Co-Piloto)"}
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
