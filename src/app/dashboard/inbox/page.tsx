"use client";

import { useState } from "react";
import { ConversationList } from "@/components/inbox/ConversationList";
import { ChatArea } from "@/components/inbox/ChatArea";
import { ContactPanel } from "@/components/inbox/ContactPanel";

// Demo data
const demoConversations = [
  {
    id: "1",
    contact: { name: "Roberto Alves", phone: "(11) 91234-5678", type: "Pessoa Física", email: "roberto.alves@email.com", cases: ["Trabalhista - Ex-Dirigente"] },
    channel: "whatsapp" as const,
    status: "aberta" as const,
    unread: 3,
    lastMessage: "Dr., a procuração já foi assinada. Posso enviar digitalizada?",
    lastMessageAt: "10:32",
    tags: ["Urgente", "Trabalhista"],
    isAiActive: true,
    assigned: "Dr. Juan Paulo",
  },
  {
    id: "2",
    contact: { name: "TechNova Corp", phone: "(11) 98888-7777", type: "Empresa", email: "legal@technova.com", cases: ["Due Diligence M&A", "Contencioso Trabalhista"] },
    channel: "email" as const,
    status: "em_atendimento" as const,
    unread: 0,
    lastMessage: "Segue em anexo a documentação solicitada para a fase de Due Diligence.",
    lastMessageAt: "09:15",
    tags: ["Societário"],
    isAiActive: false,
    assigned: "Dr. Juan Paulo",
  },
  {
    id: "3",
    contact: { name: "Sérgio Vieira", phone: "(21) 97777-6666", type: "Pessoa Física", email: "sergio.vieira@email.com", cases: [] },
    channel: "whatsapp" as const,
    status: "aguardando_hitl" as const,
    unread: 1,
    lastMessage: "Preciso de orientação sobre um contrato de prestação de serviço.",
    lastMessageAt: "Ontem",
    tags: ["Lead Quente", "Consultivo"],
    isAiActive: true,
    assigned: null,
  },
  {
    id: "4",
    contact: { name: "Maria Conceição", phone: "(11) 99876-1234", type: "Pessoa Física", email: "maria.c@email.com", cases: ["Inventário Extrajudicial"] },
    channel: "chat" as const,
    status: "resolvida" as const,
    unread: 0,
    lastMessage: "Obrigada pela explicação, Dr. Fico no aguardo dos documentos.",
    lastMessageAt: "Ontem",
    tags: ["Família"],
    isAiActive: false,
    assigned: "Dr. Juan Paulo",
  },
  {
    id: "5",
    contact: { name: "Família Oliveira", phone: "(11) 93333-4444", type: "Pessoa Física", email: "oliveira.fam@email.com", cases: ["Inventário Família Oliveira"] },
    channel: "whatsapp" as const,
    status: "aberta" as const,
    unread: 2,
    lastMessage: "Bom dia! Quando sai a guia do ITCMD?",
    lastMessageAt: "08:45",
    tags: ["Família", "Impostos"],
    isAiActive: true,
    assigned: "Dr. Juan Paulo",
  },
];

const demoMessages: Record<string, Array<{ id: string; sender: string; senderType: "contact" | "agent" | "ai"; content: string; time: string; isAiGenerated: boolean }>> = {
  "1": [
    { id: "m1", sender: "Roberto Alves", senderType: "contact", content: "Bom dia, Dr.! Estou com a procuração em mãos.", time: "10:15", isAiGenerated: false },
    { id: "m2", sender: "Juris AI", senderType: "ai", content: "Bom dia, Roberto! Que ótimo saber. Você pode enviar uma foto ou scan dela para que possamos dar andamento ao processo. 📄", time: "10:16", isAiGenerated: true },
    { id: "m3", sender: "Roberto Alves", senderType: "contact", content: "Claro! Vou escanear agora e envio em seguida.", time: "10:20", isAiGenerated: false },
    { id: "m4", sender: "Juris AI", senderType: "ai", content: "Perfeito! Fico no aguardo. Assim que receber, encaminharei para o Dr. Juan Paulo revisar.", time: "10:21", isAiGenerated: true },
    { id: "m5", sender: "Roberto Alves", senderType: "contact", content: "Dr., a procuração já foi assinada. Posso enviar digitalizada?", time: "10:32", isAiGenerated: false },
  ],
  "3": [
    { id: "m6", sender: "Sérgio Vieira", senderType: "contact", content: "Boa tarde! Eu preciso de orientação sobre um contrato de prestação de serviço que recebi.", time: "14:05", isAiGenerated: false },
    { id: "m7", sender: "Juris AI", senderType: "ai", content: "Boa tarde, Sérgio! Posso ajudar com informações gerais. Poderia me dizer qual é a sua preocupação principal sobre o contrato?", time: "14:06", isAiGenerated: true },
    { id: "m8", sender: "Sérgio Vieira", senderType: "contact", content: "Tem cláusulas de exclusividade e multa. Quero saber se são abusivas.", time: "14:10", isAiGenerated: false },
    { id: "m9", sender: "Juris AI", senderType: "ai", content: "⚠️ Esta questão requer análise jurídica especializada. Estou transferindo para o advogado responsável que poderá avaliar as cláusulas específicas do seu contrato.\n\n🔄 Transbordo HITL ativado.", time: "14:11", isAiGenerated: true },
    { id: "m10", sender: "Sérgio Vieira", senderType: "contact", content: "Preciso de orientação sobre um contrato de prestação de serviço.", time: "14:15", isAiGenerated: false },
  ],
};

export default function InboxPage() {
  const [selectedId, setSelectedId] = useState("1");
  const [filter, setFilter] = useState<string>("all");

  const selected = demoConversations.find(c => c.id === selectedId) || demoConversations[0];
  const messages = demoMessages[selectedId] || [];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      {/* Left Panel: Conversation List */}
      <ConversationList
        conversations={demoConversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Center Panel: Chat */}
      <ChatArea
        conversation={selected}
        messages={messages}
      />

      {/* Right Panel: Contact Info */}
      <ContactPanel conversation={selected} />
    </div>
  );
}
