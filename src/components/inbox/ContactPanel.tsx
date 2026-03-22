"use client";

import { 
  Phone, 
  Mail, 
  Briefcase, 
  Tag,
  Clock,
  User as UserIcon,
  MessageCircle,
  Globe,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";

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

const channelIcons = {
  whatsapp: <MessageCircle size={13} className="text-green-500/80" />,
  email: <Mail size={13} className="text-blue-400/80" />,
  chat: <Globe size={13} className="text-primary/80" />,
};

const tagColors: Record<string, string> = {
  "Urgente": "bg-red-500/[0.1] text-red-400/80",
  "Trabalhista": "bg-orange-500/[0.08] text-orange-400/70",
  "Societário": "bg-blue-500/[0.08] text-blue-400/70",
  "Lead Quente": "bg-yellow-500/[0.08] text-yellow-400/70",
  "Consultivo": "bg-purple-500/[0.08] text-purple-400/70",
  "Família": "bg-pink-500/[0.08] text-pink-400/70",
  "Impostos": "bg-emerald-500/[0.08] text-emerald-400/70",
};

const activities = [
  { time: "Hoje, 10:32", action: "Mensagem recebida via WhatsApp", icon: <MessageCircle size={12} className="text-green-500/60" /> },
  { time: "Hoje, 10:21", action: "Resposta automática da IA", icon: <Bot size={12} className="text-green-400/60" /> },
  { time: "Ontem", action: "Conversa atribuída a Dr. Juan Paulo", icon: <UserIcon size={12} className="text-primary/60" /> },
  { time: "20/03", action: "Tag 'Urgente' adicionada", icon: <Tag size={12} className="text-red-400/60" /> },
];

export function ContactPanel({ conversation }: { conversation: Conversation }) {
  const [showActivity, setShowActivity] = useState(true);
  const [showCases, setShowCases] = useState(true);

  return (
    <div className="w-72 flex-shrink-0 border-l border-primary/[0.04] bg-surface/50 h-full overflow-y-auto">
      {/* Contact header */}
      <div className="p-4 border-b border-primary/[0.04] text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-lg font-bold mx-auto mb-2.5">
          {conversation.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <h3 className="text-sm font-semibold text-secondary/90">{conversation.contact.name}</h3>
        <span className="text-[10px] text-secondary/30">{conversation.contact.type}</span>
      </div>

      {/* Contact info */}
      <div className="p-4 border-b border-primary/[0.04] space-y-2.5">
        <div className="flex items-center gap-2.5 text-xs">
          <Phone size={13} className="text-secondary/30 flex-shrink-0" />
          <span className="text-secondary/50">{conversation.contact.phone}</span>
        </div>
        {conversation.contact.email && (
          <div className="flex items-center gap-2.5 text-xs">
            <Mail size={13} className="text-secondary/30 flex-shrink-0" />
            <span className="text-secondary/50 truncate">{conversation.contact.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5 text-xs">
          {channelIcons[conversation.channel]}
          <span className="text-secondary/50">Canal: {conversation.channel === "whatsapp" ? "WhatsApp" : conversation.channel === "email" ? "E-mail" : "Chat"}</span>
        </div>
        {conversation.assigned && (
          <div className="flex items-center gap-2.5 text-xs">
            <UserIcon size={13} className="text-secondary/30 flex-shrink-0" />
            <span className="text-secondary/50">Atribuído: {conversation.assigned}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="p-4 border-b border-primary/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-semibold text-secondary/40 uppercase tracking-widest">Tags</h4>
          <button className="text-[10px] text-primary/50 hover:text-primary transition-colors">+ Adicionar</button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {conversation.tags.map(tag => (
            <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tagColors[tag] || 'bg-primary/[0.06] text-primary/60'}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Cases */}
      {conversation.contact.cases && conversation.contact.cases.length > 0 && (
        <div className="p-4 border-b border-primary/[0.04]">
          <button 
            onClick={() => setShowCases(!showCases)}
            className="flex items-center justify-between w-full mb-2"
          >
            <h4 className="text-[10px] font-semibold text-secondary/40 uppercase tracking-widest">Dossiês Vinculados</h4>
            {showCases ? <ChevronUp size={12} className="text-secondary/30" /> : <ChevronDown size={12} className="text-secondary/30" />}
          </button>
          {showCases && (
            <div className="space-y-1.5">
              {conversation.contact.cases.map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-background/30 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                  <Briefcase size={12} className="text-primary/50 flex-shrink-0" />
                  <span className="text-xs text-secondary/50 truncate">{c}</span>
                  <ExternalLink size={10} className="text-secondary/20 flex-shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity */}
      <div className="p-4">
        <button 
          onClick={() => setShowActivity(!showActivity)}
          className="flex items-center justify-between w-full mb-2"
        >
          <h4 className="text-[10px] font-semibold text-secondary/40 uppercase tracking-widest">Atividade Recente</h4>
          {showActivity ? <ChevronUp size={12} className="text-secondary/30" /> : <ChevronDown size={12} className="text-secondary/30" />}
        </button>
        {showActivity && (
          <div className="space-y-2">
            {activities.map((act, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">{act.icon}</div>
                <div>
                  <p className="text-[10px] text-secondary/40 leading-tight">{act.action}</p>
                  <span className="text-[9px] text-secondary/20">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Status */}
      <div className="p-4 border-t border-primary/[0.04]">
        <div className="p-3 bg-background/30 rounded-lg">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-secondary/40 uppercase tracking-wider">Assistente IA</span>
            <div className={`w-1.5 h-1.5 rounded-full ${conversation.isAiActive ? 'bg-green-500 animate-pulse' : 'bg-secondary/30'}`} />
          </div>
          <p className="text-[10px] text-secondary/30">
            {conversation.isAiActive 
              ? "IA ativa — respondendo automaticamente às mensagens de rotina" 
              : "IA desativada — operador humano atribuído"
            }
          </p>
          <button className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-medium transition-colors
            ${conversation.isAiActive 
              ? 'bg-red-500/[0.06] text-red-400/60 hover:bg-red-500/[0.1]' 
              : 'bg-green-500/[0.06] text-green-400/60 hover:bg-green-500/[0.1]'
            }`}
          >
            {conversation.isAiActive ? "Pausar IA" : "Ativar IA"}
          </button>
        </div>
      </div>
    </div>
  );
}
