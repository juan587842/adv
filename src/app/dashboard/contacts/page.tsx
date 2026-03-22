import { Search, Plus, Filter, MoreVertical, ShieldAlert, BadgeCheck } from "lucide-react";
import Link from "next/link";

export default function ContactsPage() {
  const contacts = [
    { id: "1", name: "TechNova Corp", type: "Empresa", phone: "(11) 98888-7777", email: "legal@technova.com", score: 95, status: "Cliente Ativo", color: "text-green-400/80 bg-green-400/[0.08]" },
    { id: "2", name: "Roberto Alves", type: "Pessoa Física", phone: "(11) 91234-5678", email: "roberto.alves@email.com", score: 40, status: "Lead Frio", color: "text-secondary/50 bg-secondary/[0.06]" },
    { id: "3", name: "Sérgio Vieira", type: "Pessoa Física", phone: "(21) 97777-6666", email: "sergio.vieira@email.com", score: 85, status: "Lead Quente", color: "text-yellow-400/80 bg-yellow-400/[0.08]" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Diretório de Clientes</h1>
          <p className="text-sm text-secondary/40 mt-1">Gestão centralizada de contatos, leads e scoring.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
            <Plus size={16} /> Novo Contato
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-card overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por nome, email ou CPF/CNPJ..." 
              className="w-full pl-10 pr-4 py-2 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary placeholder:text-secondary/20 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-background/50 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors text-secondary/60 w-full sm:w-auto">
            <Filter size={14} className="text-primary/60" /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-y border-primary/[0.04]">
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Nome / Empresa</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Contato</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Lead Score</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30">Status</th>
                <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-widest text-secondary/30 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-primary/[0.03] hover:bg-background/30 transition-colors group">
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/contacts/${contact.id}`} className="block">
                      <p className="font-medium text-sm text-secondary/90 group-hover:text-primary transition-colors">{contact.name}</p>
                      <p className="text-[10px] text-secondary/30">{contact.type}</p>
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-secondary/70">{contact.email}</p>
                    <p className="text-[10px] text-secondary/30">{contact.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                       {contact.score >= 90 && <ShieldAlert size={13} className="text-green-500/70" />}
                       {contact.score >= 70 && contact.score < 90 && <BadgeCheck size={13} className="text-yellow-500/70" />}
                       <span className="text-sm font-medium text-secondary/70">{contact.score}/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-[10px] font-semibold rounded-md ${contact.color}`}>
                      {contact.status}
                    </span>
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
