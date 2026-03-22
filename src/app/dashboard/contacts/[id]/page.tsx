import { ArrowLeft, Edit, Mail, Phone, Calendar as CalendarIcon, FileText, Briefcase, Activity, Plus } from "lucide-react";
import Link from "next/link";

export default function ContactDetailsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <Link href="/contacts" className="flex items-center gap-2 text-sm text-secondary/70 hover:text-primary transition-colors w-max">
        <ArrowLeft size={16} /> Voltar para Clientes
      </Link>

      <div className="bg-surface border border-primary/20 rounded-md p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              TC
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                TechNova Corp
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold text-green-400 bg-green-400/10 rounded-full">Cliente Ativo</span>
              </h1>
              <p className="text-sm text-secondary/70 mt-1">CNPJ: 12.345.678/0001-90</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-background border border-primary/20 rounded-md text-sm font-medium hover:border-primary/50 transition-colors">
              <Edit size={16} /> Editar
            </button>
            <button className="px-4 py-2 bg-primary text-background rounded-md text-sm font-bold hover:bg-primary-light transition-colors">
              Mensagem
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-primary/70 tracking-wider mb-2">Contato</h3>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <Mail size={16} className="text-primary/70" /> legal@technova.com
            </div>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <Phone size={16} className="text-primary/70" /> (11) 98888-7777
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-primary/70 tracking-wider mb-2">Métricas e RFM</h3>
            <div className="flex gap-4">
              <div className="p-3 bg-background border border-primary/10 rounded-md w-full">
                <p className="text-xs text-secondary/60">LTV Acumulado</p>
                <p className="font-bold text-green-400 mt-1">R$ 14.500</p>
              </div>
              <div className="p-3 bg-background border border-primary/10 rounded-md w-full">
                <p className="text-xs text-secondary/60">Lead Score</p>
                <p className="font-bold text-primary mt-1">95/100</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-primary/70 tracking-wider mb-2">Atributos Base</h3>
            <p className="text-sm text-secondary"><span className="text-secondary/60">Responsável:</span> Dr. Juan Paulo</p>
            <p className="text-sm text-secondary"><span className="text-secondary/60">Origem:</span> Google Ads</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-primary/20 rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary flex items-center gap-2"><Briefcase size={18} /> Dossiês Vinculados (2)</h2>
              <button className="text-primary/70 hover:text-primary"><Plus size={18}/></button>
            </div>
            <div className="space-y-3">
               <Link href="/cases/1" className="block p-4 border border-primary/10 rounded-md hover:border-primary/40 bg-background/50 transition-colors">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="font-semibold text-secondary">Contencioso Trabalhista - Ex-Dirigente</p>
                     <p className="text-xs text-primary/70">0012345-67.2023.5.02.0001</p>
                   </div>
                   <span className="px-2.5 py-1 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20">Em andamento</span>
                 </div>
               </Link>
               <Link href="/cases/2" className="block p-4 border border-primary/10 rounded-md hover:border-primary/40 bg-background/50 transition-colors">
                 <div className="flex justify-between items-start">
                   <div>
                     <p className="font-semibold text-secondary">Due Diligence M&A</p>
                     <p className="text-xs text-primary/70">Consultivo Societário Interno</p>
                   </div>
                   <span className="px-2.5 py-1 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20">Fase de Análise</span>
                 </div>
               </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-surface border border-primary/20 rounded-md p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary flex items-center gap-2"><Activity size={18} /> Histórico de Contato</h2>
            </div>
            <div className="relative border-l border-primary/20 ml-2 space-y-6 pt-2">
              <div className="relative pl-5">
                <div className="absolute -left-2 top-0.5 bg-background border border-primary rounded-full p-0.5"><Phone size={14} className="text-green-400" /></div>
                <p className="text-sm text-gray-200">Reunião de Fechamento M&A</p>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">15 Mar 2026</span>
              </div>
              <div className="relative pl-5">
                <div className="absolute -left-2 top-0.5 bg-background border border-primary rounded-full p-0.5"><Mail size={14} className="text-blue-400" /></div>
                <p className="text-sm text-gray-200">E-mail: Envio de Documentação</p>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">10 Mar 2026</span>
              </div>
              <div className="relative pl-5">
                <div className="absolute -left-2 top-0.5 bg-background border border-primary rounded-full p-0.5"><FileText size={14} className="text-yellow-400" /></div>
                <p className="text-sm text-gray-200">Contrato de Honorários Assinado</p>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">01 Fev 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
