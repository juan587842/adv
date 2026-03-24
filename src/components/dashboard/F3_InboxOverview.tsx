"use client";

import { MessageCircle, Mail, Loader2, Inbox as InboxIcon } from "lucide-react";
import { useMemo } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function InboxZone() {
  const { tenantId } = useTenantId();

  const { data: rawMessages, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('messages')
        .select(`
          id, content, created_at, sender_type,
          conversations:conversation_id(
            channel,
            contacts:contact_id(full_name)
          )
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(3);
    },
    [tenantId]
  );

  const messages = useMemo(() => {
    if (!rawMessages) return [];
    
    return rawMessages.map(m => {
      let senderName = "Sistema";
      let isInitials = true;
      let avatar = "SI";
      
      if (m.sender_type === 'contact') {
        senderName = m.conversations?.contacts?.full_name || "Contato Desconhecido";
        avatar = senderName.substring(0, 2).toUpperCase();
      } else if (m.sender_type === 'agent') {
        senderName = "Agente";
        avatar = "AG";
      } else if (m.sender_type === 'ai') {
        senderName = "Juris AI";
        avatar = "AI";
      }

      let timeAgo = "";
      try {
        if (m.created_at) {
          timeAgo = formatDistanceToNow(new Date(m.created_at), { addSuffix: true, locale: ptBR });
        }
      } catch (e) {}

      return {
        id: m.id,
        sender: senderName,
        time: timeAgo || "Agora",
        text: m.content || "",
        icon: m.conversations?.channel || "whatsapp",
        avatar,
        isInitials
      };
    });
  }, [rawMessages]);

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Mensagens Recentes</h2>
        <span className="bg-error-container/20 text-error px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">
          {messages.length} Pendentes
        </span>
      </div>
      
      {isLoading ? (
        <div className="flex flex-1 justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
          <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center mb-3">
            <InboxIcon className="text-outline" size={24} />
          </div>
          <p className="text-sm font-bold text-on-surface">Caixa de entrada limpa</p>
          <p className="text-xs text-outline mt-1">Nenhuma mensagem recente encontrada.</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-4 p-3 hover:bg-surface-container-highest/30 rounded-xl transition-all cursor-pointer group">
              <div className="relative">
                {msg.isInitials ? (
                  <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container text-xs font-black">
                    {msg.avatar}
                  </div>
                ) : (
                  <img className="w-10 h-10 rounded-full object-cover" alt={msg.sender} src={msg.avatar} />
                )}
                {msg.icon === 'whatsapp' ? (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] rounded-full border-2 border-surface flex items-center justify-center">
                    <MessageCircle size={10} className="text-white" />
                  </div>
                ) : (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-surface flex items-center justify-center">
                    <Mail size={10} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-bold text-on-surface truncate">{msg.sender}</p>
                  <span className="text-[10px] text-outline">{msg.time}</span>
                </div>
                <p className="text-xs text-outline truncate">{msg.text}</p>
              </div>
              
              <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
