"use client";

import { useState } from "react";
import { X, User, Phone, Mail, FileText, Activity, Loader2, Save } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface EditContactModalProps {
  contact: {
    id: string;
    full_name: string;
    phone?: string | null;
    email?: string | null;
    type?: string | null;
    document?: string | null;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditContactModal({ contact, onClose, onSuccess }: EditContactModalProps) {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStr, setErrorStr] = useState("");

  const [formData, setFormData] = useState({
    full_name: contact.full_name || "",
    phone: contact.phone || "",
    email: contact.email || "",
    type: contact.type || "lead",
    document: contact.document || "",
  });

  const handleSave = async () => {
    if (!formData.full_name || formData.full_name.length < 2) {
      setErrorStr("O nome deve ter no mínimo 2 caracteres.");
      return;
    }
    if (formData.email && !formData.email.includes("@")) {
      setErrorStr("E-mail inválido.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorStr("");

      const { error } = await supabase
        .from("contacts")
        .update({
          full_name: formData.full_name,
          phone: formData.phone || null,
          email: formData.email || null,
          type: formData.type,
          document: formData.document || null,
        })
        .eq("id", contact.id);

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
        className="bg-surface border border-primary/20 p-8 rounded-2xl w-full max-w-xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-secondary/40 hover:text-secondary bg-surface-container hover:bg-surface-container-highest p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">Editar Contato</h2>
          <p className="text-outline text-sm">Atualize as informações deste contato.</p>
        </div>

        <div className="space-y-5">
          {errorStr && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg">{errorStr}</div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Nome Completo / Empresa *</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">WhatsApp / Telefone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">E-mail</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">Tipo de Relação</label>
              <div className="relative">
                <Activity size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="lead">Lead (Prospecção)</option>
                  <option value="cliente">Cliente Ativo</option>
                  <option value="ex-cliente">Ex-cliente</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primary/70 mb-2">CPF / CNPJ</label>
              <div className="relative">
                <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                <input
                  type="text"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  placeholder="000.000.000-00"
                  className="w-full bg-surface-container border border-primary/20 text-on-surface text-sm rounded-xl pl-10 pr-4 py-3 outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-10">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-medium text-secondary/70 hover:text-primary transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-background rounded-xl font-bold hover:bg-primary-light transition-all disabled:opacity-50 min-w-[150px]"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Save size={16} /> Salvar</>}
          </button>
        </div>
      </div>
    </div>
  );
}
