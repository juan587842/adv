"use client";

import { Search, MessageCircle, Mail, Globe, Filter } from "lucide-react";

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

const channelIcons = {
  whatsapp: <MessageCircle size={13} className="text-green-500/80" />,
  email: <Mail size={13} className="text-blue-400/80" />,
  chat: <Globe size={13} className="text-primary/80" />,
};

const statusColors: Record<string, string> = {
  aberta: "bg-green-500",
  em_atendimento: "bg-blue-500",
  aguardando_hitl: "bg-yellow-500",
  resolvida: "bg-secondary/40",
  arquivada: "bg-secondary/20",
};

const statusLabels: Record<string, string> = {
  aberta: "Aberta",
  em_atendimento: "Atendendo",
  aguardando_hitl: "HITL",
  resolvida: "Resolvida",
  arquivada: "Arquivada",
};

const filters = [
  { key: "all", label: "Todas" },
  { key: "aberta", label: "Abertas" },
  { key: "aguardando_hitl", label: "HITL" },
  { key: "resolvida", label: "Resolvidas" },
];

export function ConversationList({ 
  conversations, 
  selectedId, 
  onSelect, 
  filter, 
  onFilterChange 
}: { 
  conversations: Conversation[]; 
  selectedId: string; 
  onSelect: (id: string) => void;
  filter: string;
  onFilterChange: (f: string) => void;
}) {
  const filtered = filter === "all" ? conversations : conversations.filter(c => c.status === filter);

  return (
    <div className="w-80 flex-shrink-0 bg-surface flex flex-col border-r border-primary/[0.04] h-full">
      {/* Header */}
      <div className="p-4 border-b border-primary/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-secondary">Inbox</h2>
          <span className="text-[10px] font-bold bg-primary/[0.1] text-primary/80 px-2 py-0.5 rounded-full">
            {conversations.reduce((sum, c) => sum + c.unread, 0)} novas
          </span>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={14} />
          <input
            type="text"
            placeholder="Buscar conversas..."
            className="w-full pl-9 pr-4 py-1.5 bg-background/50 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary placeholder:text-secondary/20"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => onFilterChange(f.key)}
              className={`px-2 py-1 text-[10px] font-medium rounded-md transition-colors
                ${filter === f.key 
                  ? 'bg-primary/[0.1] text-primary' 
                  : 'text-secondary/30 hover:text-secondary/60'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(conv => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full text-left p-3 border-b border-primary/[0.03] transition-colors
              ${selectedId === conv.id 
                ? 'bg-primary/[0.06]' 
                : 'hover:bg-background/40'
              }`}
          >
            <div className="flex items-start gap-2.5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary text-xs font-bold">
                  {conv.contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${statusColors[conv.status]} border-2 border-surface`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-secondary/90 truncate">{conv.contact.name}</span>
                  <span className="text-[10px] text-secondary/30 flex-shrink-0 ml-2">{conv.lastMessageAt}</span>
                </div>
                
                <div className="flex items-center gap-1.5 mb-1">
                  {channelIcons[conv.channel]}
                  <span className="text-[10px] text-secondary/30">{statusLabels[conv.status]}</span>
                  {conv.isAiActive && (
                    <span className="text-[9px] bg-green-500/[0.08] text-green-400/70 px-1 py-0.5 rounded font-medium">AI</span>
                  )}
                </div>

                <p className="text-xs text-secondary/40 truncate">{conv.lastMessage}</p>

                {/* Tags */}
                {conv.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {conv.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/[0.06] text-primary/60 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Unread badge */}
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-background text-[10px] font-bold flex-shrink-0 mt-1">
                  {conv.unread}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
