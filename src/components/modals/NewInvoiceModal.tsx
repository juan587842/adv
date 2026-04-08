"use client";

import { useState } from "react";
import { X, DollarSign, FileText, Calendar, Briefcase, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTenantId } from "@/hooks/useTenantId";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";

interface NewInvoiceModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewInvoiceModal({ onClose, onSuccess }: NewInvoiceModalProps) {
  const { tenantId } = useTenantId();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    due_date: "",
    case_id: "",
    status: "rascunho",
  });

  // Fetch cases para dropdown
  const { data: cases } = useSupabaseQuery<any[]>(
    async (client) => {
      if (!tenantId) return { data: null, error: null };
      return client
        .from("cases")
        .select("id, title")
        .eq("tenant_id", tenantId)
        .order("title", { ascending: true });
    },
    [tenantId]
  );

  const handleCreate = async () => {
    if (!tenantId) return;
    if (!formData.description) { setErrorStr("A descrição é obrigatória."); return; }
    if (!formData.amount || Number(formData.amount) <= 0) { setErrorStr("Informe um valor válido."); return; }

    try {
      setIsSubmitting(true);
      setErrorStr("");

      const insertData: any = {
        tenant_id: tenantId,
        description: formData.description,
        amount: Number(formData.amount),
        status: formData.status,
      };

      if (formData.due_date) insertData.due_date = formData.due_date;
      if (formData.case_id) insertData.case_id = formData.case_id;

      const { error } = await supabase.from("invoices").insert(insertData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="bg-surface border border-primary/20 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-secondary/40 hover:text-secondary bg-surface-container hover:bg-surface-container-highest p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Nova Transação</h2>
          <p className="text-outline text-sm">Registre honorários, custas judiciais ou alvarás.</p>
        </div>

        <div className="space-y-5">
          {errorStr && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">{errorStr}</div>
          )}

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Descrição *</label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Honorários contratuais - Processo Silva"
                className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Valor */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Valor (R$) *</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0,00"
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Data de Vencimento */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Vencimento</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Dossiê vinculado */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Dossiê Vinculado</label>
            <div className="relative">
              <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <select
                value={formData.case_id}
                onChange={(e) => setFormData({ ...formData, case_id: e.target.value })}
                className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors appearance-none"
              >
                <option value="">Nenhum (avulso)</option>
                {cases?.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Status</label>
            <div className="flex gap-3">
              {[
                { value: "rascunho", label: "Rascunho" },
                { value: "paga", label: "Paga / Recebida" },
                { value: "vencida", label: "Vencida" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: opt.value })}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-all ${
                    formData.status === opt.value
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-surface-container text-secondary/50 border-primary/10 hover:border-primary/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-10">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-secondary/70 hover:text-primary transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={isSubmitting}
            className="flex items-center justify-center px-8 py-2.5 bg-primary text-background rounded-xl font-bold hover:bg-primary-light transition-all disabled:opacity-50 min-w-[150px]"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Registrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
