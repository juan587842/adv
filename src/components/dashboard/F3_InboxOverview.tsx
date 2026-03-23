import { MessageCircle, Mail } from "lucide-react";

export function InboxZone() {
  const messages = [
    { sender: "Mariana Costa", time: "14:20", text: "Doutor, consegue analisar o novo anexo do processo...", icon: "whatsapp", avatar: "https://i.pravatar.cc/150?u=12" },
    { sender: "Roberto Almeida", time: "11:05", text: "Encaminhei os comprovantes de pagamento das taxas...", icon: "email", avatar: "https://i.pravatar.cc/150?u=13" },
    { sender: "Carlos Pereira", time: "Ontem", text: "Obrigado pelo retorno rápido sobre o agravo.", icon: "whatsapp", avatar: "CP", isInitials: true }
  ];

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Mensagens Recentes</h2>
        <span className="bg-error-container/20 text-error px-2 py-0.5 rounded-lg text-[10px] font-black uppercase">5 Pendentes</span>
      </div>
      
      <div className="space-y-4 flex-1">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex items-center gap-4 p-3 hover:bg-surface-container-highest/30 rounded-xl transition-all cursor-pointer group">
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
    </div>
  );
}
