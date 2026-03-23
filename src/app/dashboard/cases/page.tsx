import { Search, Plus, Filter, MoreVertical, Briefcase, Clock, FileText } from "lucide-react";
import Link from "next/link";

export default function CasesPage() {
  const cases = [
    { id: "1", title: "Contencioso Trabalhista - Ex-Dirigente", client: "TechNova Corp", number: "0012345-67.2023.5.02.0001", area: "Trabalhista", status: "Em andamento", updated: "Hoje, 14:30" },
    { id: "2", title: "Due Diligence M&A", client: "TechNova Corp", number: "Interno", area: "Societário", status: "Fase de Análise", updated: "Hoje, 10:15" },
    { id: "3", title: "Inventário Extrajudicial", client: "Família Oliveira", number: "Cartório", area: "Cível / Família", status: "Aguardando Impostos", updated: "Ontem" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Dossiês Processuais</h1>
          <p className="text-sm text-secondary/40 mt-1">Gestão de casos, workflows e repositório de documentos.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
            <Plus size={16} /> Novo Dossiê
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="p-2.5 bg-primary/[0.08] text-primary/70 rounded-lg"><Briefcase size={20} /></div>
          <div><p className="text-2xl font-bold text-secondary">34</p><p className="text-[10px] text-secondary/40 font-medium uppercase tracking-wider">Casos Ativos</p></div>
        </div>
        <div className="bg-surface rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="p-2.5 bg-red-500/[0.08] text-red-400/70 rounded-lg"><Clock size={20} /></div>
          <div><p className="text-2xl font-bold text-secondary">5</p><p className="text-[10px] text-secondary/40 font-medium uppercase tracking-wider">Irregulares</p></div>
        </div>
        <div className="bg-surface rounded-xl p-4 shadow-card flex items-center gap-4">
          <div className="p-2.5 bg-green-500/[0.08] text-green-400/70 rounded-lg"><FileText size={20} /></div>
          <div><p className="text-2xl font-bold text-secondary">158</p><p className="text-[10px] text-secondary/40 font-medium uppercase tracking-wider">Aguardando Cliente</p></div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface/50 backdrop-blur-md p-4 rounded-xl border border-primary/[0.02] shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
          <input 
            type="text" 
            placeholder="Buscar dossiê ou processo CNJ..." 
            className="w-full pl-10 pr-4 py-2 bg-background/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-secondary placeholder:text-secondary/30 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors text-secondary/60">
          <Filter size={14} /> Filtros
        </button>
      </div>

      {/* Cases Cards List */}
      <div className="flex flex-col gap-3">
        {cases.map((c) => (
          <Link 
            key={c.id} 
            href={`/dashboard/cases/${c.id}`} 
            className="group block bg-surface/50 hover:bg-surface-light backdrop-blur-sm rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_8px_32px_rgba(230,196,135,0.03)] border border-transparent hover:border-primary/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              
              {/* Main Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-base font-bold text-secondary/90 group-hover:text-primary transition-colors">{c.title}</h3>
                  <span className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-md bg-primary/[0.06] text-primary/80 border border-primary/10">
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-secondary/40 font-mono tracking-tight flex items-center gap-1.5">
                    <Briefcase size={12} className="text-primary/30" /> {c.number}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-secondary/20"></span>
                  <span className="text-secondary/50 font-medium">{c.client}</span>
                  <span className="w-1 h-1 rounded-full bg-secondary/20"></span>
                  <span className="text-primary/50">{c.area}</span>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-primary/[0.05]">
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-secondary/30">Última Mov.</span>
                  <span className="text-sm font-medium text-secondary/70 flex items-center gap-1.5">
                    <Clock size={12} className="text-primary/40" /> {c.updated}
                  </span>
                </div>
                
                <button 
                  className="p-2 -mr-2 rounded-xl text-secondary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
