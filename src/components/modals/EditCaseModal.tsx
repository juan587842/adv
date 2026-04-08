"use client";

import { useState, useEffect } from "react";
import { X, Gavel, Save, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface EditCaseModalProps {
  caseData: {
    id: string;
    title: string;
    case_number?: string | null;
    court?: string | null;
    status?: string | null;
    urgency?: string | null;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditCaseModal({ caseData, onClose, onSuccess }: EditCaseModalProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  const [formData, setFormData] = useState({
    title: caseData.title || "",
    case_number: caseData.case_number || "",
    court: caseData.court || "",
    status: caseData.status || "novo",
    urgency: caseData.urgency || "normal",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleSave = async () => {
    if (!formData.title) { setErrorStr("O título é obrigatório."); return; }

    try {
      setIsSubmitting(true);
      setErrorStr("");

      const { error } = await supabase
        .from("cases")
        .update({
          title: formData.title,
          case_number: formData.case_number || null,
          court: formData.court || null,
          status: formData.status,
          urgency: formData.urgency,
        })
        .eq("id", caseData.id);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          background: "rgba(23, 31, 51, 0.85)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(230, 196, 135, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Gavel className="text-primary" size={24} />
            <h2 className="font-semibold text-xl tracking-tight text-on-surface">Editar Dossiê</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/5 transition-colors p-2 rounded-full group">
            <X className="text-outline group-hover:text-primary" size={24} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {errorStr && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">{errorStr}</div>
          )}

          <div className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Título do Caso *</label>
              <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 transition-all">
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 placeholder:text-outline/40 outline-none"
                  placeholder="Ex: Silva vs. Empresa ABC"
                  type="text"
                />
              </div>
            </div>

            {/* Número do Processo */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Número do Processo (CNJ)</label>
              <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center transition-all">
                <Gavel className="text-outline/60 px-3 shrink-0" size={44} />
                <input
                  value={formData.case_number}
                  onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 pr-4 placeholder:text-outline/40 outline-none"
                  placeholder="0000000-00.0000.0.00.0000"
                  type="text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Vara/Tribunal */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Vara / Tribunal</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary rounded-xl p-1 transition-all">
                  <input
                    value={formData.court}
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                    className="w-full bg-transparent border-none text-on-surface py-3 px-4 placeholder:text-outline/40 outline-none"
                    placeholder="1ª Vara do Trabalho"
                    type="text"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Status</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary rounded-xl p-1 transition-all">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-transparent border-none text-on-surface py-3 px-4 outline-none appearance-none"
                  >
                    <option value="novo" className="bg-surface-container">Novo</option>
                    <option value="em_andamento" className="bg-surface-container">Em Andamento</option>
                    <option value="aguardando_prazo" className="bg-surface-container">Aguardando Prazo</option>
                    <option value="arquivado" className="bg-surface-container">Arquivado</option>
                  </select>
                </div>
              </div>

              {/* Urgência */}
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Urgência</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary rounded-xl p-1 transition-all">
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    className="w-full bg-transparent border-none text-on-surface py-3 px-4 outline-none appearance-none"
                  >
                    <option value="low" className="bg-surface-container">Baixa</option>
                    <option value="normal" className="bg-surface-container">Normal</option>
                    <option value="high" className="bg-surface-container">Alta</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.02]">
          <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-outline hover:text-on-surface hover:bg-white/5 transition-all">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-w-[150px] disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <><Save size={18} /> Salvar</>}
          </button>
        </footer>
      </div>
    </div>
  );
}
