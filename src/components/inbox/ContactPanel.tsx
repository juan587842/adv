"use client";

import { 
  Plus
} from "lucide-react";

type Conversation = {
  id: string;
  contact: { name: string; phone: string; type: string; email?: string; cases?: string[] };
  channel: "whatsapp" | "email" | "chat";
  status: "aberta" | "em_atendimento" | "aguardando_hitl" | "resolvida" | "arquivada";
  unread: number;
  lastMessage: string;
  lastMessageAt: string;
  tags: string[];
  isAiActive: boolean;
  assigned: string | null;
};

export function ContactPanel({ conversation }: { conversation: Conversation }) {
  return (
    <section className="w-96 flex flex-col bg-surface-container border-l border-outline-variant/10 overflow-y-auto h-full">
      
      {/* Client Info */}
      <div className="p-6 border-b border-outline-variant/10">
        <h4 className="text-[0.7rem] font-bold text-outline uppercase tracking-widest mb-4">Informação do Contato</h4>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-highest border border-outline-variant/20 overflow-hidden flex items-center justify-center text-primary text-xl font-bold">
            {conversation.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-on-surface font-bold text-lg leading-tight">{conversation.contact.name}</h3>
            {conversation.contact.email && (
              <p className="text-xs text-outline">{conversation.contact.email}</p>
            )}
            <p className="text-[0.65rem] text-primary/80 mt-1 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Cliente VIP - Plano Gold
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="py-2 bg-surface-container-low border border-outline-variant/20 rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors text-on-surface">Ver Perfil</button>
          <button className="py-2 bg-surface-container-low border border-outline-variant/20 rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors text-on-surface">Novo Documento</button>
        </div>
      </div>

      {/* Case Summary */}
      {conversation.contact.cases && conversation.contact.cases.length > 0 && (
        <div className="p-6 border-b border-outline-variant/10">
          <h4 className="text-[0.7rem] font-bold text-outline uppercase tracking-widest mb-4">Resumo do Caso</h4>
          <div className="bg-surface-container-highest/30 rounded-xl p-4 border border-outline-variant/10">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-primary">CASE-ATUAL</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[0.6rem] font-bold">EM ANDAMENTO</span>
            </div>
            <p className="text-sm font-semibold text-on-surface mb-2">{conversation.contact.cases[0]}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-[0.65rem]">
                <span className="text-outline">Tribunal:</span>
                <span className="text-on-surface">TJSP - 2ª Vara Cível</span>
              </div>
              <div className="flex justify-between text-[0.65rem]">
                <span className="text-outline">Última Movimentação:</span>
                <span className="text-on-surface">Concluso para Decisão</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tags do Canal */}
      <div className="p-6 border-b border-outline-variant/10">
        <h4 className="text-[0.7rem] font-bold text-outline uppercase tracking-widest mb-4">Tags do Canal</h4>
        <div className="flex flex-wrap gap-2">
          {conversation.tags.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/20 text-[0.65rem] font-bold text-on-surface">
              {tag}
            </span>
          ))}
          <button className="p-1.5 rounded-lg border border-dashed border-outline/30 text-outline hover:text-primary transition-colors flex items-center justify-center">
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Notas Privadas */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[0.7rem] font-bold text-outline uppercase tracking-widest">Notas Privadas</h4>
          <button className="text-primary text-[0.65rem] font-bold hover:underline">Ver todas</button>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-primary/5 border-l-2 border-primary rounded-r-lg">
            <p className="text-[0.7rem] text-on-surface leading-snug">"O cliente parece ansioso com a liminar. Priorizar atualização assim que sair o despacho no Diário Oficial."</p>
            <span className="text-[0.6rem] text-outline mt-2 block italic">— Dr. Eduardo, 23 Mai</span>
          </div>
          
          <div className="p-3 bg-surface-container-highest/40 rounded-lg">
            <p className="text-[0.7rem] text-on-surface leading-snug">"Confirmar se a guia de custas foi anexada corretamente."</p>
            <span className="text-[0.6rem] text-outline mt-2 block italic">— Admin, 20 Mai</span>
          </div>
        </div>
        
        <div className="mt-4 relative">
          <input 
            className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline/50 transition-all" 
            placeholder="Adicionar nota..." 
            type="text"
          />
        </div>
      </div>
    </section>
  );
}
