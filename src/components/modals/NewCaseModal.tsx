"use client";

import { X, PlusCircle, Gavel, User, Search, CloudUpload, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useTenantId } from "@/hooks/useTenantId";

interface NewCaseModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewCaseModal({ onClose, onSuccess }: NewCaseModalProps) {
  const { tenantId } = useTenantId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    case_number: "",
    area: "",
    responsible: "RM"
  });

  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleCreate = async () => {
    if (!tenantId) return;
    if (!formData.title) {
      setErrorStr("O título do caso é obrigatório.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorStr("");
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('cases')
        .insert({
          tenant_id: tenantId,
          title: formData.title,
          case_number: formData.case_number || null,
          status: "Em Andamento"
        })
        .select()
        .single();
        
      if (error) throw error;
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Erro desconhecido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
      {/* Desktop Modal Card */}
      <div 
        className="w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          background: "rgba(23, 31, 51, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(230, 196, 135, 0.15)"
        }}
      >
        {/* Modal Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-primary" size={24} />
            <h2 className="font-semibold text-xl tracking-tight text-on-surface">Novo Caso</h2>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white/5 transition-colors p-2 rounded-full group active:scale-95"
          >
            <X className="text-outline group-hover:text-primary" size={24} />
          </button>
        </header>

        {/* Modal Content (Scrollable Form) */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {errorStr && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">
              {errorStr}
            </div>
          )}
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            {/* Row 1: Case Title and Process Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Título do Caso *</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 transition-all">
                  <input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 placeholder:text-outline/40 outline-none" 
                    placeholder="Ex: Silva vs. Empresa ABC" 
                    type="text" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Número do Processo (CNJ)</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center transition-all">
                  <Gavel className="text-outline/60 px-3 shrink-0" size={44} />
                  <input 
                    value={formData.case_number}
                    onChange={(e) => setFormData({...formData, case_number: e.target.value})}
                    className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 pr-4 placeholder:text-outline/40 outline-none" 
                    placeholder="0000000-00.0000.0.00.0000" 
                    type="text" 
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Client and Area (Mocked for now) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 opacity-50 pointer-events-none">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Cliente</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center group transition-all">
                  <User className="text-outline/60 px-3 group-focus-within:text-primary transition-colors shrink-0" size={44} />
                  <input readOnly disabled className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 pr-4 placeholder:text-outline/40 outline-none" placeholder="Vincular cliente pelo Perfil do Cliente..." type="text" />
                </div>
              </div>
              
              <div className="space-y-2 opacity-50 pointer-events-none">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Área do Direito</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 transition-all">
                  <select disabled className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 cursor-pointer outline-none">
                    <option value="" className="bg-surface-container">Selecionar área...</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </main>

        {/* Modal Footer (Actions) */}
        <footer className="px-8 py-6 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.02]">
          <button 
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-outline hover:text-on-surface hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={handleCreate}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : (
              <>
                <span>Criar Caso</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
