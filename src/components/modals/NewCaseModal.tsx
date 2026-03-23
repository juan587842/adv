"use client";

import { X, PlusCircle, Gavel, User, Search, CloudUpload, ArrowRight } from "lucide-react";
import { useEffect } from "react";

interface NewCaseModalProps {
  onClose: () => void;
}

export function NewCaseModal({ onClose }: NewCaseModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

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
          <form className="space-y-8">
            {/* Row 1: Case Title and Process Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Título do Caso</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 transition-all">
                  <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 placeholder:text-outline/40" placeholder="Ex: Silva vs. Empresa ABC" type="text" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Número do Processo (CNJ)</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center transition-all">
                  <Gavel className="text-outline/60 px-3 shrink-0" size={44} />
                  <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 pr-4 placeholder:text-outline/40" placeholder="0000000-00.0000.0.00.0000" type="text" />
                </div>
              </div>
            </div>

            {/* Row 2: Client and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Cliente</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center group transition-all">
                  <User className="text-outline/60 px-3 group-focus-within:text-primary transition-colors shrink-0" size={44} />
                  <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 pr-4 placeholder:text-outline/40" placeholder="Buscar ou adicionar cliente..." type="text" />
                  <button className="p-2 mr-1 hover:bg-surface-container-highest rounded-lg transition-colors shrink-0" type="button">
                    <Search className="text-primary" size={20} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Área do Direito</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 transition-all">
                  <select className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-4 cursor-pointer outline-none">
                    <option value="" className="bg-surface-container">Selecionar área...</option>
                    <option value="Trabalhista" className="bg-surface-container">Trabalhista</option>
                    <option value="Civel" className="bg-surface-container">Cível</option>
                    <option value="Criminal" className="bg-surface-container">Criminal</option>
                    <option value="Tributario" className="bg-surface-container">Tributário</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Value and Responsible Lawyer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Valor da Causa</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center transition-all">
                  <span className="text-primary font-bold pl-4 pr-2">R$</span>
                  <input className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 pr-4 placeholder:text-outline/40 font-medium" placeholder="0,00" step="0.01" type="number" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Advogado Responsável</label>
                <div className="bg-surface-variant/40 backdrop-blur-md border border-outline/20 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 rounded-xl p-1 flex items-center transition-all">
                  <div className="pl-3 shrink-0">
                    <img className="w-8 h-8 rounded-full border border-primary/20 object-cover" alt="Advogado" src="https://i.pravatar.cc/150?img=33" />
                  </div>
                  <select className="w-full bg-transparent border-none focus:ring-0 text-on-surface py-3 px-2 cursor-pointer outline-none">
                    <option value="RM" className="bg-surface-container">Dr. Ricardo Mello</option>
                    <option value="AS" className="bg-surface-container">Dra. Amanda Silva</option>
                    <option value="JO" className="bg-surface-container">Dr. Jonas Oliveira</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Full Width: File Upload */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest font-bold text-outline">Anexar Petição Inicial</label>
              <div className="border-2 border-dashed border-white/10 rounded-[1.5rem] p-12 flex flex-col items-center justify-center bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/40 transition-all cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <CloudUpload className="text-primary" size={32} />
                </div>
                <p className="text-base font-semibold text-on-surface">Arraste a petição aqui ou clique para selecionar</p>
                <p className="text-xs text-outline mt-2 tracking-wide uppercase">PDF, DOCX até 10MB</p>
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
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold shadow-xl shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center gap-2">
            <span>Criar Caso</span>
            <ArrowRight size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}
