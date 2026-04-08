"use client";

import { useState } from "react";
import { X, Calendar, Clock, FileText, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTenantId } from "@/hooks/useTenantId";

interface NewEventModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewEventModal({ onClose, onSuccess }: NewEventModalProps) {
  const { tenantId } = useTenantId();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "09:00",
  });

  const handleCreate = async () => {
    if (!tenantId) return;
    if (!formData.title) { setErrorStr("O título é obrigatório."); return; }
    if (!formData.date) { setErrorStr("A data é obrigatória."); return; }

    try {
      setIsSubmitting(true);
      setErrorStr("");

      const startAt = new Date(`${formData.date}T${formData.time}:00`);

      const { error } = await supabase
        .from("calendar_events")
        .insert({
          tenant_id: tenantId,
          title: formData.title,
          description: formData.description || null,
          start_at: startAt.toISOString(),
          metadata: {},
        });

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
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Novo Evento</h2>
          <p className="text-outline text-sm">Adicione audiências, prazos fatais ou reuniões ao calendário.</p>
        </div>

        <div className="space-y-5">
          {errorStr && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">{errorStr}</div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Título do Evento *</label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Audiência - Processo Silva"
                className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Data */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Data *</label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Hora */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Horário</label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Descrição</label>
            <div className="relative">
              <FileText size={18} className="absolute left-3 top-3 text-secondary/40" />
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detalhes, observações ou local..."
                rows={3}
                className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors resize-none"
              />
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
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Criar Evento"}
          </button>
        </div>
      </div>
    </div>
  );
}
