"use client";

import { Search, Filter } from "lucide-react";

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

const filterTabs = [
  { key: "all", label: "Todas" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "Email" },
  { key: "chat", label: "Chat" },
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
  const filtered = filter === "all" ? conversations : conversations.filter(c => c.channel === filter);

  return (
    <section className="w-80 flex-shrink-0 flex flex-col border-r border-outline-variant/20 bg-surface-container-low h-full">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-headline font-bold text-primary">Inbox</h2>
          <button className="text-outline cursor-pointer hover:text-primary transition-colors">
            <Filter size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm" size={16} />
          <input 
            className="w-full bg-surface-container border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline/50 transition-all" 
            placeholder="Search conversations..." 
            type="text"
          />
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-[0.7rem] font-bold uppercase tracking-widest whitespace-nowrap transition-colors
                ${filter === tab.key 
                  ? 'bg-surface-container-highest text-primary' 
                  : 'text-outline hover:bg-surface-container'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* List Items */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map(conv => {
          const isActive = selectedId === conv.id;
          
          return (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`p-4 cursor-pointer transition-colors border-l-4 ${isActive ? 'border-primary bg-surface-container-highest/40' : 'border-transparent hover:bg-surface-container'} ${!isActive && conv.status === 'resolvida' ? 'opacity-60' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-on-surface font-semibold text-sm truncate pr-2">{conv.contact.name}</span>
                <span className="text-[0.65rem] text-outline flex-shrink-0">{conv.lastMessageAt}</span>
              </div>
              <p className={`text-xs text-outline line-clamp-2 mb-2 ${isActive ? 'italic' : ''}`}>"{conv.lastMessage}"</p>
              
              <div className="flex items-center gap-2">
                {conv.isAiActive ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[0.6rem] font-bold border border-primary/20">
                    IA ATIVA
                  </span>
                ) : conv.status === 'aguardando_hitl' ? (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 text-[0.6rem] font-bold">
                    HITL ATIVO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-outline/10 text-outline text-[0.6rem] font-bold">
                    HUMANO
                  </span>
                )}
                
                {conv.unread > 0 && (
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(230,196,135,0.6)] ml-auto animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
