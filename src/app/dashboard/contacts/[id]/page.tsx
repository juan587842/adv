"use client";

import { ArrowLeft, Edit, Mail, Phone, FileText, Briefcase, Activity, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { LinkCaseModal } from "@/components/modals/LinkCaseModal";

export default function ContactDetailsPage() {
  const params = useParams();
  const contactId = params.id as string;
  const { tenantId } = useTenantId();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Fetch the actual contact data
  const { data: contact, isLoading: isLoadingContact } = useSupabaseQuery<any>(
    async (supabase) => {
      if (!tenantId || !contactId) return { data: null, error: null };
      return supabase
        .from('contacts')
        .select('*')
        .eq('tenant_id', tenantId)
        .eq('id', contactId)
        .single();
    },
    [tenantId, contactId]
  );

  // Fetch linked cases via cases_contacts bridge
  const { data: linkedCases, isLoading: isLoadingCases } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId || !contactId) return { data: null, error: null };
      
      const { data, error } = await supabase
        .from('cases_contacts')
        .select(`
          cases (
            id,
            title,
            process_number,
            status
          )
        `)
        .eq('contact_id', contactId);
        
      if (error) throw error;
      // Extract cases from the join structure
      return { 
        data: data ? data.map((d: any) => d.cases).filter(Boolean) : [], 
        error: null 
      };
    },
    [tenantId, contactId]
  );

  if (isLoadingContact) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-primary">
        <Loader2 className="animate-spin mr-2" size={24} /> Carregando cliente...
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        <Link href="/dashboard/contacts" className="flex items-center gap-2 text-sm text-secondary/70 hover:text-primary transition-colors w-max">
          <ArrowLeft size={16} /> Voltar para Clientes
        </Link>
        <div className="p-8 text-center text-secondary/70">
          Cliente não encontrado.
        </div>
      </div>
    );
  }

  // Calculate initials
  const initials = contact.full_name
    ? contact.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CL';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <Link href="/dashboard/contacts" className="flex items-center gap-2 text-sm text-secondary/70 hover:text-primary transition-colors w-max">
        <ArrowLeft size={16} /> Voltar para Clientes
      </Link>

      <div className="bg-surface border border-primary/20 rounded-md p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                {contact.full_name || "Cliente sem Nome"}
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${
                  contact.type === 'cliente' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                }`}>
                  {contact.type === 'cliente' ? 'Cliente Ativo' : 'Lead'}
                </span>
              </h1>
              {contact.document && <p className="text-sm text-secondary/70 mt-1">Doc: {contact.document}</p>}
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
            <div className="flex items-center gap-3 text-sm text-secondary break-all">
              <Mail size={16} className="text-primary/70 min-w-[16px]" /> {contact.email || "Sem e-mail"}
            </div>
            <div className="flex items-center gap-3 text-sm text-secondary">
              <Phone size={16} className="text-primary/70 min-w-[16px]" /> {contact.phone || "Sem telefone"}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-primary/70 tracking-wider mb-2">Métricas e RFM</h3>
            <div className="flex gap-4">
              <div className="p-3 bg-background border border-primary/10 rounded-md w-full">
                <p className="text-xs text-secondary/60">LTV Acumulado</p>
                <p className="font-bold text-green-400 mt-1">R$ --</p>
              </div>
              <div className="p-3 bg-background border border-primary/10 rounded-md w-full">
                <p className="text-xs text-secondary/60">Lead Score</p>
                <p className="font-bold text-primary mt-1">{contact.lead_score || "N/A"}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase text-primary/70 tracking-wider mb-2">Atributos Base</h3>
            <p className="text-sm text-secondary"><span className="text-secondary/60">Registrado em:</span> {new Date(contact.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-primary/20 rounded-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary flex items-center gap-2">
                <Briefcase size={18} /> Dossiês Vinculados ({linkedCases?.length || 0})
              </h2>
              <button onClick={() => setIsLinkModalOpen(true)} className="text-primary/70 hover:text-primary"><Plus size={18}/></button>
            </div>
            
            <div className="space-y-3">
              {isLoadingCases ? (
                <div className="p-4 text-center text-secondary/50 text-sm">Carregando dossiês...</div>
              ) : linkedCases && linkedCases.length > 0 ? (
                linkedCases.map((caseItem: any) => (
                  <Link href={`/dashboard/cases/${caseItem.id}`} key={caseItem.id} className="block p-4 border border-primary/10 rounded-md hover:border-primary/40 bg-background/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-secondary">{caseItem.title}</p>
                        <p className="text-xs text-primary/70">{caseItem.process_number || "Sem nº de processo"}</p>
                      </div>
                      {caseItem.status && (
                        <span className="px-2.5 py-1 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20 capitalize">
                          {caseItem.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center border border-dashed border-primary/20 rounded-md text-secondary/50 text-sm font-medium">
                  Nenhum dossiê vinculado a este cliente.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-surface border border-primary/20 rounded-md p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-primary flex items-center gap-2"><Activity size={18} /> Histórico de Contato</h2>
            </div>
            <div className="p-4 text-center text-sm text-secondary/50 border border-dashed border-primary/20 rounded-md mt-4">
              O histórico está vazio.
            </div>
          </div>
        </div>
      </div>

      {isLinkModalOpen && (
        <LinkCaseModal 
          contactId={contactId}
          onClose={() => setIsLinkModalOpen(false)}
          onSuccess={() => setTimeout(() => window.location.reload(), 500)}
        />
      )}
    </div>
  );
}
