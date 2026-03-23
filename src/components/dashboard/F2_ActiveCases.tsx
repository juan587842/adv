import { Briefcase, Activity, CheckCircle2 } from "lucide-react";

export function ActiveCasesZone() {
  const cases = [
    { title: "M&A Tech Solutions", status: "Due Diligence", phase: "Análise", color: "bg-blue-500" },
    { title: "Inventário Família Oliveira", status: "Aguardando Impostos", phase: "Suspenso", color: "bg-yellow-500" },
    { title: "Trabalhista - Ex-Dirigente", status: "Audiência Confirmada", phase: "Ativo", color: "bg-green-500" },
  ];

  return (
    <div className="bg-surface/40 backdrop-blur-md rounded-2xl p-6 shadow-[0_4px_16px_rgba(230,196,135,0.02)] border border-primary/[0.02] h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold flex items-center gap-2 text-secondary">
          <Briefcase size={18} className="text-primary/70" />
          <span>Casos Prioritários</span>
        </h2>
        <a href="/dashboard/cases" className="text-xs text-primary/50 hover:text-primary transition-colors">Ver todos</a>
      </div>

      <div className="space-y-1 pt-1">
        {cases.map((c, i) => (
          <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-background/40 transition-colors">
            <div className={`mt-1.5 w-2 h-2 rounded-full ${c.color} flex-shrink-0`} />
            <div className="flex-1">
              <p className="text-sm font-medium text-secondary/90">{c.title}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-secondary/40">
                <span className="flex items-center gap-1"><Activity size={11}/> {c.status}</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={11}/> {c.phase}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
