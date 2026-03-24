"use client";

import { useState, useMemo, useEffect } from "react";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ChatArea } from "@/components/inbox/ChatArea";
import { ContactPanel } from "@/components/inbox/ContactPanel";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const { tenantId } = useTenantId();
  const supabase = createClient();
  const [realtimeMessages, setRealtimeMessages] = useState<any[]>([]);

  const { data: rawConversations, refetch: refetchConversations } = useSupabaseQuery<any[]>(
    async (client) => {
      if (!tenantId) return { data: null, error: null };
      return client
        .from('conversations')
        .select(`
          *,
          contacts:contact_id ( id, full_name, phone, email, type )
        `)
        .eq('tenant_id', tenantId)
        .order('last_message_at', { ascending: false });
    },
    [tenantId]
  );

  const { data: rawMessages, refetch: refetchMessages } = useSupabaseQuery<any[]>(
    async (client) => {
      if (!tenantId || !selectedId) return { data: null, error: null };
      return client
        .from('messages')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('conversation_id', selectedId)
        .order('created_at', { ascending: true });
    },
    [tenantId, selectedId]
  );

  // Set initial selected ID
  useEffect(() => {
    if (rawConversations && rawConversations.length > 0 && !selectedId) {
      setSelectedId(rawConversations[0].id);
    }
  }, [rawConversations, selectedId]);

  // Handle Realtime messages subscriptions
  useEffect(() => {
    if (!tenantId || !selectedId) return;

    setRealtimeMessages(rawMessages || []);

    const subscription = supabase
      .channel(`public:messages:conversation_id=eq.${selectedId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedId}` },
        (payload) => {
          setRealtimeMessages((current) => [...current, payload.new]);
          // Also refetch conversations to update last_message
          refetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [rawMessages, selectedId, tenantId, supabase, refetchConversations]);

  const conversations = useMemo(() => {
    if (!rawConversations) return [];
    
    return rawConversations.map(c => ({
      id: c.id,
      contact: { 
        name: c.contacts?.full_name || "Desconhecido", 
        phone: c.contacts?.phone || "", 
        type: c.contacts?.type || "Pessoa Física", 
        email: c.contacts?.email || "", 
        cases: [] 
      },
      channel: c.channel || "whatsapp",
      status: c.status || "aberta",
      unread: c.unread_count || 0,
      lastMessage: c.last_message || "Nova conversa",
      lastMessageAt: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      tags: [],
      isAiActive: c.is_ai_active ?? true,
      assigned: null,
    }));
  }, [rawConversations]);

  const messages = useMemo(() => {
    return realtimeMessages.map(m => ({
      id: m.id,
      sender: m.sender_type === 'contact' ? "Contato" : "Agente", // Fallback names
      senderType: m.sender_type || "contact",
      content: m.content || "",
      time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      isAiGenerated: m.is_ai_generated || false
    }));
  }, [realtimeMessages]);

  const selected = conversations.find(c => c.id === selectedId) || null;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      {/* Left Panel: ConversationList */}
      <ConversationList
        conversations={conversations}
        selectedId={selectedId || ""}
        onSelect={setSelectedId}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Center Panel: ChatArea and Right Panel: ContactPanel */}
      {selected ? (
        <>
          <ChatArea
            conversation={selected}
            messages={messages}
          />
          <ContactPanel conversation={selected} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-surface-container-low/30 backdrop-blur-md relative overflow-hidden">
          <div className="text-center">
            <h3 className="text-xl font-bold text-on-surface mb-2">Nenhuma conversa selecionada</h3>
            <p className="text-outline">Selecione uma conversa na lista para visualizar as mensagens.</p>
          </div>
        </div>
      )}
    </div>
  );
}
