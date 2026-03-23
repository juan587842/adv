"use client";

import { useState } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Bot, 
  AlertTriangle,
  Video,
  AtSign
} from "lucide-react";

type Message = {
  id: string;
  sender: string;
  senderType: "contact" | "agent" | "ai";
  content: string;
  time: string;
  isAiGenerated: boolean;
};

type Conversation = {
  id: string;
  contact: { name: string; phone: string; type: string };
  channel: "whatsapp" | "email" | "chat";
  status: "aberta" | "em_atendimento" | "aguardando_hitl" | "resolvida" | "arquivada";
  unread: number;
  lastMessage: string;
  lastMessageAt: string;
  tags: string[];
  isAiActive: boolean;
  assigned: string | null;
};

export function ChatArea({ conversation, messages }: { conversation: Conversation; messages: Message[] }) {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"reply" | "note">("reply");
  const [bypassHitl, setBypassHitl] = useState(false);

  return (
    <section className="flex-1 flex flex-col relative bg-surface">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/10 bg-surface/40 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 overflow-hidden text-lg font-bold text-outline">
            {conversation.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 className="text-on-surface font-bold text-sm leading-tight">{conversation.contact.name}</h3>
            {conversation.isAiActive ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[0.65rem] text-primary uppercase font-bold tracking-tighter">Sovereign Agent IA Ativa</span>
              </div>
            ) : conversation.status === 'aguardando_hitl' ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                <span className="text-[0.65rem] text-yellow-500 uppercase font-bold tracking-tighter">Aguardando HITL</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary/50"></span>
                <span className="text-[0.65rem] text-secondary/50 uppercase font-bold tracking-tighter">Operador Humano</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-surface-container rounded-lg transition-colors group">
            <Video size={18} className="text-outline group-hover:text-on-surface" />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-lg transition-colors group">
            <MoreVertical size={18} className="text-outline group-hover:text-on-surface" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        
        {/* HITL warning banner */}
        {conversation.status === "aguardando_hitl" && (
          <div className="flex items-center gap-2.5 p-3.5 bg-yellow-500/[0.06] rounded-xl mb-4 border border-yellow-500/[0.08]">
            <AlertTriangle size={16} className="text-yellow-500/80 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-yellow-500 font-bold">Transbordo HITL — Intervenção humana necessária</p>
              <p className="text-[10px] text-secondary/50 mt-0.5">A IA pausou o atendimento. Responda manualmente para prosseguir.</p>
            </div>
          </div>
        )}

        {/* Date Separator */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex-1 h-px bg-outline-variant/20"></div>
          <span className="text-[0.6rem] font-bold text-outline uppercase tracking-[0.2em]">Histórico Recente</span>
          <div className="flex-1 h-px bg-outline-variant/20"></div>
        </div>

        {messages.map(msg => (
          msg.senderType === "contact" ? (
            /* Client Message */
            <div key={msg.id} className="flex gap-4 max-w-[80%]">
              <div className="flex-1">
                <div className="bg-surface-container p-4 rounded-xl rounded-tl-none border border-outline-variant/10">
                  <p className="text-sm leading-relaxed text-on-surface-variant">{msg.content}</p>
                </div>
                <span className="text-[0.6rem] text-outline mt-1 block px-1">{msg.time} • {conversation.channel}</span>
              </div>
            </div>
          ) : (
            /* AI/Agent Message */
            <div key={msg.id} className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
              <div className="flex-1 text-right">
                <div className={`p-4 rounded-xl rounded-tr-none inline-block text-left relative overflow-hidden ${msg.isAiGenerated ? 'bg-primary/5 border border-primary/20' : 'bg-surface-container-highest border border-outline-variant/10'}`}>
                  {msg.isAiGenerated && (
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03]">
                      <Bot size={80} className="text-primary" />
                    </div>
                  )}
                  <p className="text-sm leading-relaxed text-on-surface relative z-10">{msg.content}</p>
                  
                  {msg.isAiGenerated && (
                    <div className="mt-3 flex items-center gap-2 relative z-10">
                      <span className="text-[0.6rem] font-bold text-primary uppercase tracking-widest border border-primary/30 px-1.5 py-0.5 rounded">Juris IA Response</span>
                    </div>
                  )}
                </div>
                <span className="text-[0.6rem] text-outline mt-1 block px-1">{msg.time} • Enviado {msg.isAiGenerated ? 'Automaticamente' : 'por Operador'}</span>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Input Area */}
      <footer className="p-6 bg-surface-container-low border-t border-outline-variant/10">
        <div className="bg-surface-container-low/40 backdrop-blur-md rounded-2xl border border-outline-variant/20 p-2 shadow-2xl">
          <div className="flex items-center gap-2 px-3 py-1 border-b border-outline-variant/10 mb-2">
            <button 
              onClick={() => setTab("reply")}
              className={`text-[0.65rem] font-bold uppercase tracking-wider pb-1 ${tab === 'reply' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface px-4'}`}
            >
              Responder
            </button>
            <button 
              onClick={() => setTab("note")}
              className={`text-[0.65rem] font-bold uppercase tracking-wider pb-1 ${tab === 'note' ? 'text-primary border-b-2 border-primary' : 'text-outline hover:text-on-surface px-4'}`}
            >
              Nota Interna
            </button>
            
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[0.6rem] text-outline font-medium">HITL Bypass</span>
              <div 
                onClick={() => setBypassHitl(!bypassHitl)}
                className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${bypassHitl ? 'bg-primary/50' : 'bg-outline-variant/30'}`}
              >
                <div className={`absolute top-1 w-2 h-2 rounded-full transition-all ${bypassHitl ? 'left-5 bg-primary' : 'left-1 bg-outline'}`}></div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm text-on-surface resize-none p-3 h-24 placeholder:text-outline/40" 
              placeholder={tab === 'reply' ? "Digite sua resposta aqui..." : "Digite uma nota interna (invisível para o cliente)..."}
            ></textarea>
          </div>
          
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-surface-container rounded-lg text-outline transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-2 hover:bg-surface-container rounded-lg text-outline transition-colors">
                <Smile size={18} />
              </button>
              <button className="p-2 hover:bg-surface-container rounded-lg text-outline transition-colors">
                <AtSign size={18} />
              </button>
            </div>
            <button className="bg-primary text-on-primary-container px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform shadow-lg shadow-primary/10">
              {tab === 'reply' ? 'Enviar Resposta' : 'Salvar Nota'}
              <Send size={16} />
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
