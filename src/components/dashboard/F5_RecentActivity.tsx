export function RecentActivityZone() {
  const activities = [
    {
      actor: "Juris AI", action: "respondeu dúvida do cliente João M. sobre o processo 445...",
      time: "Agora mesmo", isPrimary: true,
      colorClass: "bg-primary", bgClass: "bg-primary/20", borderClass: "border-primary/40", textClass: "text-primary"
    },
    {
      actor: "Sistema", action: "Novo prazo calculado para Agravo de Instrumento em Proc. 889...",
      time: "Há 15 min",
      colorClass: "bg-on-tertiary-container", bgClass: "bg-on-tertiary-container/20", borderClass: "border-on-tertiary-container/40"
    },
    {
      actor: "Financeiro", action: "Fatura #1029 emitida para Escritório Global Ltda.",
      time: "Há 2 horas",
      colorClass: "bg-primary", bgClass: "bg-primary/20", borderClass: "border-primary/40", textClass: "text-primary"
    },
    {
      actor: "Datajud API", action: "Movimentação detectada no STJ para Proc. 2234/23.",
      time: "Hoje, 09:30", isLast: true,
      colorClass: "bg-on-tertiary-container", bgClass: "bg-on-tertiary-container/20", borderClass: "border-on-tertiary-container/40"
    }
  ];

  return (
    <div className="bg-surface-container-highest/40 backdrop-blur-md rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Log de Atividade</h2>
        <button className="text-[10px] uppercase font-black text-outline hover:text-primary transition-colors">
          Ver Log Completo
        </button>
      </div>
      
      <div className="space-y-5">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex gap-4 relative">
            {!activity.isLast && (
              <div className="absolute left-2 top-6 bottom-[-14px] w-px bg-outline-variant/20"></div>
            )}
            
            <div className={`w-4 h-4 rounded-full ${activity.bgClass} border ${activity.borderClass} flex items-center justify-center z-10`}>
              <div className={`w-1.5 h-1.5 ${activity.colorClass} rounded-full`}></div>
            </div>
            
            <div className="flex-1 -mt-1">
              <p className="text-xs text-on-surface">
                {activity.actor && activity.isPrimary ? (
                  <><span className={`font-bold ${activity.textClass || ''}`}>{activity.actor}</span> {activity.action}</>
                ) : activity.actor ? (
                  <>{activity.action.replace(activity.actor, '')}<span className="font-bold">{activity.actor}</span>{activity.action.includes(activity.actor) ? '' : activity.action}</>
                ) : (
                  activity.action
                )}
                {/* Fallback to simple render if no strict matching is needed */}
                {activity.isPrimary ? 
                  (<span><span className="font-bold text-primary">{activity.actor}</span> {activity.action}</span>) 
                  : (<span>{activity.action}</span>)}
              </p>
              <p className="text-[10px] text-outline mt-1 uppercase font-bold tracking-tighter">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
