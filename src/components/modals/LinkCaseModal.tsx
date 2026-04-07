"use client";

import { useState, useEffect } from "react";
import { X, Search, Link as LinkIcon, Loader2, Gavel } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTenantId } from "@/hooks/useTenantId";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

interface LinkCaseModalProps {
  contactId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LinkCaseModal({ contactId, onClose, onSuccess }: LinkCaseModalProps) {
  const { tenantId } = useTenantId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const supabase = createClient();

  const { data: cases, isLoading } = useSupabaseQuery<any[]>(
    async (client) => {
      if (!tenantId) return { data: null, error: null };
      return client
        .from('cases')
        .select('id, title, case_number')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });
    },
    [tenantId]
  );

  const filteredCases = cases?.filter(c => 
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.case_number?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleLink = async (caseId: string) => {
    try {
      setIsSubmitting(true);
      setErrorStr("");

      // Link case to contact
      const { error } = await supabase
        .from('cases_contacts')
        .insert({
          case_id: caseId,
          contact_id: contactId,
          role: 'cliente' // default role
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error("Este dossiê já está vinculado a este cliente.");
        }
        throw error;
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Erro desconhecido ao vincular dossiê");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-surface border border-primary/20 p-8 rounded-2xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-secondary/40 hover:text-secondary bg-surface-container hover:bg-surface-container-highest p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6 shrink-0">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Vincular Dossiê</h2>
          <p className="text-outline text-sm">Selecione um dossiê existente para conectar a este contato.</p>
        </div>

        {errorStr && (
          <div className="mb-4 shrink-0 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
            {errorStr}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6 shrink-0">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por Título ou Número do Processo..." 
            className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center p-8 text-secondary/50">
              <Loader2 size={24} className="animate-spin" />
            </div>
          ) : filteredCases.length > 0 ? (
            filteredCases.map((c) => (
              <div 
                key={c.id}
                className="flex items-center justify-between p-4 rounded-xl border border-primary/10 hover:border-primary/30 bg-surface-container/50 hover:bg-surface-container transition-all group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <Gavel size={18} className="text-primary" />
                  </div>
                  <div className="truncate pr-4">
                    <p className="font-semibold text-sm text-on-surface truncate">{c.title || "Sem Título"}</p>
                    <p className="text-xs text-outline font-mono truncate">{c.case_number || "Sem n° de processo"}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleLink(c.id)}
                  disabled={isSubmitting}
                  className="shrink-0 flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <LinkIcon size={14} />
                  Vincular
                </button>
              </div>
            ))
          ) : (
            <div className="p-8 text-center border-2 border-dashed border-outline/10 rounded-xl">
              <p className="text-outline text-sm">Nenhum dossiê encontrado na sua base.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
