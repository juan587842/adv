import { MessageCircle, Mail, AlertTriangle } from "lucide-react";

export function InboxZone() {
  const unreadMessages = [
    { source: "whatsapp", sender: "Roberto Alves", preview: "Dr., a procuração assinada...", time: "10 min", urgent: true },
    { source: "email", sender: "tj-sp@jusbrasil.com.br", preview: "Nova movimentação...", time: "1 hr", urgent: false },
    { source: "whatsapp", sender: "Sérgio Vieira", preview: "Podemos agendar para quinta?", time: "3 hr", urgent: false },
  ];

  return (
    <div className="bg-surface/40 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_16px_rgba(230,196,135,0.02)] border border-primary/[0.02] h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-secondary">
          <MessageCircle size={18} className="text-primary/70" />
          <span>Inbox</span>
        </h2>
        <span className="bg-primary/[0.1] text-primary/80 text-[10px] font-bold px-2 py-0.5 rounded-full">3 novas</span>
      </div>

      <div className="space-y-1 flex-1">
        {unreadMessages.map((msg, idx) => (
          <div key={idx} className="p-2.5 rounded-lg hover:bg-background/40 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                {msg.source === 'whatsapp' ? <MessageCircle size={13} className="text-green-500/70" /> : <Mail size={13} className="text-blue-400/70" />}
                <span className="text-sm font-medium text-secondary/80">{msg.sender}</span>
                {msg.urgent && <AlertTriangle size={11} className="text-yellow-500/70" />}
              </div>
              <span className="text-[10px] text-secondary/30">{msg.time}</span>
            </div>
            <p className="text-xs text-secondary/40 truncate pl-5">{msg.preview}</p>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-3 py-2 text-xs font-medium rounded-lg bg-background/40 text-secondary/50 hover:text-primary hover:bg-primary/[0.06] transition-all">
        Abrir Central Omnicanal
      </button>
    </div>
  );
}
