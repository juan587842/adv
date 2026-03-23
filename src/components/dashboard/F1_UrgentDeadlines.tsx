import { AlertTriangle, Clock, CalendarDays } from "lucide-react";

export function UrgentDeadlinesZone() {
  const deadlines = [
    { id: 1, title: "Contestação", case: "Proc. 1234567-89.2023.8.26.0100", daysLeft: 2, type: "Crítico", color: "error", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, title: "Recurso Especial", case: "Proc. 9876543-21.2023.4.03.6100", daysLeft: 4, type: "Atenção", color: "orange-400", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, title: "Audiência de Instrução", case: "Proc. 5551234-55.2023.8.19.0001", daysLeft: 6, type: "Planejado", color: "primary", avatar: "https://i.pravatar.cc/150?u=3" }
  ];

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 border-l-4 border-error overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <AlertTriangle size={120} />
      </div>
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-on-surface tracking-tight flex items-center gap-3">
          <AlertTriangle className="text-error" fill="currentColor" size={24} />
          Prazos Urgentes
        </h2>
        <button className="text-xs uppercase tracking-widest text-primary font-black hover:opacity-80 transition-opacity">
          Ver Todos
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {deadlines.map((item) => {
          const isError = item.color === "error";
          const isWarning = item.color === "orange-400";
          
          return (
            <div key={item.id} className="bg-surface-container-lowest/50 p-4 rounded-xl flex flex-col gap-3 group hover:bg-surface-container-highest/40 transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded
                  ${isError ? 'text-error-container bg-error/10' : 
                    isWarning ? 'text-orange-400 bg-orange-400/10' : 
                    'text-primary/80 bg-primary/10'}`}>
                  {item.type}
                </span>
                <div className="flex -space-x-2">
                  <img className="w-6 h-6 rounded-full border border-surface" alt="Avatar" src={item.avatar} />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-[11px] text-outline mt-0.5">{item.case}</p>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className={`flex items-center gap-1.5 ${isError ? 'text-error' : isWarning ? 'text-orange-400' : 'text-primary'}`}>
                  {item.type !== "Planejado" ? <Clock size={14} /> : <CalendarDays size={14} />}
                  <span className="text-xs font-bold">{item.daysLeft} dias restantes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
