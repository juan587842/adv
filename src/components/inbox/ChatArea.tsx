"use client";

import { useState } from "react";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Zap, 
  MoreVertical, 
  Bot, 
  User as UserIcon, 
  AlertTriangle,
  MessageCircle,
  Mail,
  Globe,
  StickyNote,
  ArrowRightLeft,
  Play,
  Gauge
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

const channelLabels = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  chat: "Chat do Site",
};

const channelIcons = {
  whatsapp: <MessageCircle size={14} className="text-green-500/80" />,
  email: <Mail size={14} className="text-blue-400/80" />,
  chat: <Globe size={14} className="text-primary/80" />,
};

const statusBadges: Record<string, { bg: string; text: string; label: string }> = {
  aberta: { bg: "bg-green-500/[0.08]", text: "text-green-400/80", label: "Aberta" },
  em_atendimento: { bg: "bg-blue-500/[0.08]", text: "text-blue-400/80", label: "Atendendo" },
  aguardando_hitl: { bg: "bg-yellow-500/[0.1]", text: "text-yellow-400/90", label: "⚠ Aguardando HITL" },
  resolvida: { bg: "bg-secondary/[0.05]", text: "text-secondary/50", label: "Resolvida" },
  arquivada: { bg: "bg-secondary/[0.03]", text: "text-secondary/30", label: "Arquivada" },
};

const quickReplyOptions = [
  "Obrigado pela informação, vamos verificar.",
  "Por favor, envie o documento digitalizado.",
  "Agendaremos uma reunião para discutir esse assunto.",
  "Seu prazo será atualizado. Não se preocupe.",
];

export function ChatArea({ conversation, messages }: { conversation: Conversation; messages: Message[] }) {
  const [input, setInput] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [note, setNote] = useState("");
  const [privateNotes, setPrivateNotes] = useState<Array<{ author: string; content: string; time: string }>>([
    { author: "Dr. Juan Paulo", content: "Verificar se o contrato está atualizado antes de responder.", time: "10:00" }
  ]);

  const badge = statusBadges[conversation.status] || statusBadges.aberta;

  return (
    <div className="flex-1 flex flex-col bg-background/50 h-full min-w-0">
      {/* Chat Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-primary/[0.04] bg-surface/40 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {conversation.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-secondary/90 truncate">{conversation.contact.name}</span>
              {channelIcons[conversation.channel]}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-secondary/30">{channelLabels[conversation.channel]}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {conversation.status === "aguardando_hitl" && (
            <>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/[0.1] text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/[0.15] transition-colors">
                <ArrowRightLeft size={13} />
                Assumir Conversa
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/[0.08] text-green-400/80 rounded-lg text-xs font-medium hover:bg-green-500/[0.15] transition-colors shadow-sm">
                <Play size={13} />
                Retomar IA
              </button>
            </>
          )}
          {conversation.isAiActive && conversation.status !== "aguardando_hitl" && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/[0.08] text-green-400/80 rounded-lg text-xs font-medium hover:bg-green-500/[0.15] transition-colors">
              <Bot size={13} />
              IA Ativa
            </button>
          )}
          <button 
            onClick={() => setShowNotes(!showNotes)} 
            className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-primary/[0.1] text-primary' : 'text-secondary/30 hover:text-secondary/60 hover:bg-white/[0.03]'}`}
          >
            <StickyNote size={15} />
          </button>
          <button className="p-2 rounded-lg text-secondary/30 hover:text-secondary/60 hover:bg-white/[0.03] transition-colors">
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* HITL warning banner */}
          {conversation.status === "aguardando_hitl" && (
            <div className="flex items-center gap-2.5 p-3.5 bg-yellow-500/[0.06] rounded-xl mb-4 border border-yellow-500/[0.08]">
              <AlertTriangle size={16} className="text-yellow-500/80 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-yellow-400/90 font-medium">Transbordo HITL — Intervenção humana necessária</p>
                <p className="text-[10px] text-secondary/30 mt-0.5">A IA detectou uma questão que requer expertise jurídica. Clique em "Assumir Conversa" para intervir ou "Retomar IA" para devolver ao agente.</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Gauge size={12} className="text-yellow-500/60" />
                <span className="text-[10px] font-bold text-yellow-400/80">Score: 72</span>
              </div>
            </div>
          )}

          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderType === "contact" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[70%] ${msg.senderType === "contact" ? "" : ""}`}>
                {/* Sender label */}
                <div className={`flex items-center gap-1.5 mb-1 ${msg.senderType === "contact" ? "" : "justify-end"}`}>
                  {msg.isAiGenerated && <Bot size={11} className="text-green-400/60" />}
                  {msg.senderType === "contact" && <UserIcon size={11} className="text-secondary/30" />}
                  <span className="text-[10px] text-secondary/30 font-medium">{msg.sender}</span>
                  <span className="text-[9px] text-secondary/20">{msg.time}</span>
                </div>
                
                {/* Bubble */}
                <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.senderType === "contact" 
                    ? "bg-surface rounded-tl-md text-secondary/80" 
                    : msg.isAiGenerated
                      ? "bg-green-500/[0.06] rounded-tr-md text-secondary/80"
                      : "bg-primary/[0.1] rounded-tr-md text-secondary/80"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Private Notes Panel (collapsible) */}
        {showNotes && (
          <div className="w-72 border-l border-primary/[0.04] bg-surface/30 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-primary/[0.04]">
              <h4 className="text-xs font-semibold text-secondary/60 flex items-center gap-1.5">
                <StickyNote size={13} className="text-yellow-500/60" />
                Notas Privadas
              </h4>
              <p className="text-[9px] text-secondary/20 mt-0.5">Invisíveis para o cliente</p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {privateNotes.map((n, i) => (
                <div key={i} className="p-2.5 bg-yellow-500/[0.04] rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-secondary/50">{n.author}</span>
                    <span className="text-[9px] text-secondary/20">{n.time}</span>
                  </div>
                  <p className="text-xs text-secondary/40 leading-relaxed">{n.content}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-primary/[0.04]">
              <textarea 
                placeholder="Adicionar nota privada..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2 bg-background/50 rounded-lg text-xs text-secondary/60 placeholder:text-secondary/20 resize-none focus:outline-none focus:ring-1 focus:ring-yellow-500/20"
                rows={2}
              />
              <button 
                onClick={() => {
                  if (note.trim()) {
                    setPrivateNotes(prev => [...prev, { author: "Dr. Juan Paulo", content: note, time: "Agora" }]);
                    setNote("");
                  }
                }}
                className="mt-1.5 w-full py-1.5 bg-yellow-500/[0.1] text-yellow-400/80 rounded-lg text-[10px] font-medium hover:bg-yellow-500/[0.15] transition-colors"
              >
                Salvar Nota
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-primary/[0.04] bg-surface/40 p-3 flex-shrink-0">
        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="mb-2 p-2 bg-background/50 rounded-lg">
            <p className="text-[10px] text-secondary/30 font-medium mb-1.5 uppercase tracking-wider">Respostas Rápidas</p>
            <div className="flex flex-wrap gap-1.5">
              {quickReplyOptions.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(qr); setShowQuickReplies(false); }}
                  className="px-2.5 py-1 bg-primary/[0.06] text-secondary/50 rounded-md text-[10px] hover:bg-primary/[0.1] hover:text-secondary/70 transition-colors"
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-secondary/30 hover:text-secondary/60 rounded-lg hover:bg-white/[0.03] transition-colors">
            <Paperclip size={16} />
          </button>
          <button 
            onClick={() => setShowQuickReplies(!showQuickReplies)}
            className={`p-2 rounded-lg transition-colors ${showQuickReplies ? 'bg-primary/[0.1] text-primary' : 'text-secondary/30 hover:text-secondary/60 hover:bg-white/[0.03]'}`}
          >
            <Zap size={16} />
          </button>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 bg-background/50 rounded-lg text-sm text-secondary placeholder:text-secondary/20 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <button className="p-2 text-secondary/30 hover:text-secondary/60 rounded-lg hover:bg-white/[0.03] transition-colors">
            <Smile size={16} />
          </button>
          <button className="p-2.5 bg-primary text-background rounded-lg hover:bg-primary-light transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
