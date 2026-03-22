"use client";

import { useState } from "react";
import { ArrowLeft, UploadCloud, FileText, Send, Database, Sparkles, Loader2, BrainCircuit } from "lucide-react";
import Link from "next/link";
// import { createClient } from "@supabase/supabase-js"; // Assuming setup elsewhere

export default function KnowledgeBasePage() {
  const [ingestText, setIngestText] = useState("");
  const [ingestTitle, setIngestTitle] = useState("");
  const [isIngesting, setIsIngesting] = useState(false);
  
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'agent', content: string, sources?: string[]}[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  const handleIngest = async () => {
    if (!ingestText || !ingestTitle) return;
    setIsIngesting(true);
    // Simulate Edge Function Call
    setTimeout(() => {
      alert(`Documento "${ingestTitle}" vetorizado com sucesso via pgvector!`);
      setIngestTitle("");
      setIngestText("");
      setIsIngesting(false);
    }, 1500);
  };

  const handleChat = async () => {
    if (!chatInput) return;
    const newMsg = { role: 'user' as const, content: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setIsChatting(true);

    // Simulate Edge Function Call RAG Pipeline
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'agent',
        content: "Baseado nos documentos mapeados, o prazo para contestação trabalhista é de 15 dias úteis contados da citação, conforme art. 841 da CLT injetado previamente no meu contexto.",
        sources: ["CLT Comentada - Art 841", "Manual de Prazos Internos"]
      }]);
      setIsChatting(false);
    }, 2000);
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
            <Database className="text-primary" size={20} />
            Cérebro RAG (Vector Data)
          </h1>
          <p className="text-sm text-secondary/50">Alimente e teste o conhecimento interno injetado nos agentes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Ingestion Panel */}
        <div className="flex flex-col bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] overflow-hidden">
          <div className="p-5 border-b border-primary/5 bg-background/20 font-medium text-sm text-secondary/80 flex items-center gap-2">
            <UploadCloud size={16} className="text-primary" />
            Vetorizar Novo Conhecimento
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Título do Documento</label>
              <input 
                type="text" 
                value={ingestTitle}
                onChange={(e) => setIngestTitle(e.target.value)}
                placeholder="Ex: Tese Defesa Trabalhista Acidente"
                className="w-full px-4 py-2.5 bg-background/50 rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05]"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-semibold text-secondary/60 uppercase tracking-wider mb-2">Conteúdo Texto (Chunking automático)</label>
              <textarea 
                value={ingestText}
                onChange={(e) => setIngestText(e.target.value)}
                placeholder="Cole o texto da peça, lei, ou orientação aqui..."
                className="w-full flex-1 p-4 bg-background/50 rounded-xl text-sm text-secondary/90 placeholder:text-secondary/30 resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05] min-h-[200px]"
              />
            </div>
          </div>
          <div className="p-5 border-t border-primary/5 bg-background/20">
            <button 
              onClick={handleIngest}
              disabled={isIngesting || !ingestTitle || !ingestText}
              className="w-full py-3 bg-secondary text-background rounded-xl font-medium hover:bg-secondary/90 transition-all shadow-card disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isIngesting ? <Loader2 size={18} className="animate-spin" /> : <Database size={18} />}
              Vetorizar e Salvar no pgvector
            </button>
          </div>
        </div>

        {/* RAG Sandbox Chat */}
        <div className="flex flex-col bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] overflow-hidden relative">
          
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <BrainCircuit size={120} />
          </div>

          <div className="p-5 border-b border-primary/5 bg-background/20 font-medium text-sm text-secondary/80 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              Sandbox RAG (Teste)
            </span>
            <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded font-bold uppercase">MiniMax M2.7</span>
          </div>
          
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary/40 mb-4">
                  <Sparkles size={24} />
                </div>
                <p className="text-secondary/60 text-sm">Faça perguntas sobre os documentos que você já vetorizou. O Agente Onisciente usará Similaridade de Cosseno (HNSW) para buscar as respostas.</p>
              </div>
            ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-background rounded-tr-sm' 
                        : 'bg-background/80 border border-primary/[0.04] text-secondary/90 rounded-tl-sm backdrop-blur-md'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      
                      {msg.sources && (
                        <div className="mt-3 pt-3 border-t border-secondary/10">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-secondary/40 mb-2">Fontes Utilizadas (RAG):</p>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((src, idx) => (
                              <span key={idx} className="flex items-center gap-1 text-[10px] bg-surface px-2 py-1 rounded text-secondary/60 border border-primary/5">
                                <FileText size={10} /> {src}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
            {isChatting && (
                <div className="flex justify-start">
                  <div className="bg-background/80 border border-primary/[0.04] rounded-2xl p-4 rounded-tl-sm backdrop-blur-md">
                     <Loader2 size={16} className="animate-spin text-primary" />
                  </div>
                </div>
            )}
          </div>
          
          <div className="p-4 bg-background/20 border-t border-primary/5">
            <div className="relative flex items-center">
              <input 
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChat()}
                placeholder="Pergunte à inteligência..."
                className="w-full bg-surface py-3 pl-4 pr-12 rounded-xl text-sm text-secondary focus:outline-none focus:ring-1 focus:ring-primary/30 border border-primary/[0.05] shadow-inner-glow"
              />
              <button 
                onClick={handleChat}
                disabled={isChatting || !chatInput}
                className="absolute right-2 p-2 rounded-lg bg-primary text-background hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
