import { Clock, ShieldAlert, FileText, UserPlus } from "lucide-react";

export function RecentActivityZone() {
  const logs = [
    { icon: <FileText size={13} className="text-blue-400/80" />, action: "Documento anexado", detail: "Petição Inicial - Caso 402", time: "Há 10 min", user: "Dr. Juan" },
    { icon: <ShieldAlert size={13} className="text-yellow-400/80" />, action: "HITL Intervenção", detail: "Agente de IA pausou para revisão", time: "Há 45 min", user: "Sistema IA" },
    { icon: <UserPlus size={13} className="text-green-400/80" />, action: "Novo Lead", detail: "Contato via WhatsApp B2B", time: "Há 2 horas", user: "Evolution API" },
  ];

  return (
    <div className="bg-surface rounded-xl p-5 shadow-card h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-secondary">
          <Clock size={18} className="text-primary/70" />
          <span>Atividade Recente</span>
        </h2>
        <span className="text-[10px] text-secondary/30 uppercase tracking-wider">Audit Log</span>
      </div>

      <div className="relative border-l border-primary/[0.08] ml-2 space-y-5 pt-1">
        {logs.map((log, idx) => (
          <div key={idx} className="relative pl-5">
            <div className="absolute -left-[7px] top-0.5 bg-surface rounded-full p-1">
              {log.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-secondary/80">{log.action}</p>
              <p className="text-xs text-secondary/40 mt-0.5">{log.detail}</p>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-secondary/25 uppercase font-semibold tracking-wider">
                <span>{log.time}</span>
                <span>•</span>
                <span>{log.user}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
