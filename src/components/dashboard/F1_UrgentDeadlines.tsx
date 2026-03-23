import { CalendarClock, AlertCircle } from "lucide-react";

export function UrgentDeadlinesZone() {
  const deadlines = [
    { id: 1, title: "Contestação - Silva vs. Souza", daysLeft: 2, date: "24 Mar", type: "Peremptório" },
    { id: 2, title: "Recurso de Apelação - Proc. 00123", daysLeft: 5, date: "27 Mar", type: "Peremptório" },
  ];

  return (
    <div className="bg-gradient-to-r from-red-950/20 to-surface/40 backdrop-blur-md rounded-2xl p-6 shadow-[0_8px_32px_rgba(239,68,68,0.05)] border border-primary/[0.02] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-red-500 to-red-500/20"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-secondary">
          <AlertCircle className="text-red-400" size={18} />
          <span>Prazos Fatais</span>
        </h2>
        <span className="text-[10px] font-semibold text-red-400/80 bg-red-400/[0.08] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Próximos 7 dias
        </span>
      </div>

      <div className="space-y-2">
        {deadlines.map((deadline) => (
          <div key={deadline.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 hover:bg-background/60 transition-colors">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center justify-center w-11 h-11 rounded-lg bg-red-500/[0.08] text-red-400">
                <span className="text-lg font-bold leading-none">{deadline.daysLeft}</span>
                <span className="text-[9px] font-medium uppercase mt-0.5 opacity-70">Dias</span>
              </div>
              <div>
                <p className="font-medium text-sm text-secondary">{deadline.title}</p>
                <div className="flex items-center gap-2 text-xs text-secondary/40 mt-1">
                  <CalendarClock size={11} />
                  <span>{deadline.date}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated text-secondary/50">{deadline.type}</span>
                </div>
              </div>
            </div>
            
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary/[0.08] text-primary/80 hover:bg-primary/[0.15] transition-colors">
              Revisar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
