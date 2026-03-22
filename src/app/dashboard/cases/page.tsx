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

      <div className="bg-surface rounded-xl shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
            <input 
              type="text" 
              placeholder="Buscar dossiê ou processo CNJ..." 
              className="w-full pl-10 pr-4 py-2 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary placeholder:text-secondary/20 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors text-secondary/60">
            <Filter size={14} className="text-primary/60" /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-primary/[0.04]">
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Dossiê / CNJ</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Cliente</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Status</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Última Mov.</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b border-primary/[0.03] hover:bg-background/30 transition-colors group">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/cases/${c.id}`} className="block">
                      <p className="font-medium text-sm text-secondary/90 group-hover:text-primary transition-colors">{c.title}</p>
                      <p className="text-[10px] text-secondary/30 font-mono tracking-tight mt-0.5">{c.number}</p>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-secondary/70">{c.client}</p>
                    <p className="text-[10px] text-primary/40">{c.area}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-[10px] font-semibold rounded-md bg-primary/[0.06] text-primary/70">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-secondary/50">{c.updated}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-secondary/30 hover:text-primary transition-colors p-1">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
