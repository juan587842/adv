"use client";

import { useState, useMemo } from "react";
import { MessageCircle, Mail, Plus, Settings2, Trash2, Smartphone, Globe, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { createClient } from "@/utils/supabase/client";

type ChannelParams = {
  id: string;
  name: string;
  type: "whatsapp" | "email";
  status: "connected" | "disconnected" | "qr_pending";
  provider: string;
  details: string;
};

export default function ChannelsSettingsPage() {
  const { tenantId } = useTenantId();
  const [activeTab, setActiveTab] = useState<"all" | "whatsapp" | "email">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: rawChannels, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('channels')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('name');
    },
    [tenantId]
  );

  const channels: ChannelParams[] = useMemo(() => {
    if (!rawChannels) return [];
    return rawChannels.map((c: any) => ({
      id: c.id,
      name: c.name || 'Canal sem nome',
      type: (c.type === 'whatsapp' || c.type === 'email') ? c.type : 'whatsapp',
      status: (c.status === 'connected' || c.status === 'disconnected' || c.status === 'qr_pending') ? c.status : 'disconnected',
      provider: c.provider || 'Desconhecido',
      details: c.details || '-'
    }));
  }, [rawChannels]);

  const filteredChannels = channels.filter(c => activeTab === "all" || c.type === activeTab);

  
  const whatsappCount = channels.filter(c => c.type === 'whatsapp').length;
  const maxWhatsapp = 3;
  const whatsappPercentage = Math.min((whatsappCount / maxWhatsapp) * 100, 100);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary">Canais e Integrações</h1>
          <p className="text-secondary/50 mt-1">Gerencie suas conexões de WhatsApp e contas de e-mail para o Inbox Unificado.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium rounded-xl hover:bg-primary-light transition-all shadow-card hover:shadow-card-hover border border-transparent"
        >
          <Plus size={18} />
          Conectar Novo Canal
        </button>
      </div>

      {/* Stats/Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-colors shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <MessageCircle size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary/40 font-medium uppercase tracking-wider">WhatsApp Utilizados</p>
              <p className="text-xl font-bold text-secondary/90">{whatsappCount} / {maxWhatsapp}</p>
            </div>
          </div>
          <div className="w-full bg-secondary/10 h-1.5 rounded-full overflow-hidden mt-3 shadow-inner border border-transparent">
            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${whatsappPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="p-5 rounded-2xl bg-surface-container hover:bg-surface-container-highest transition-colors shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs text-secondary/40 font-medium uppercase tracking-wider">Status Evolution API</p>
              <p className="text-xl font-bold text-secondary/90">Online</p>
            </div>
          </div>
          <p className="text-[10px] text-secondary/30 mt-3">Último ping: há 2 min</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#D6E8E6] shadow-inner-glow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#fff]/20 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <h3 className="text-lg font-bold text-teal-900 leading-tight">API Cloud Meta</h3>
            <p className="text-xs text-teal-800/70 mt-1 mb-3 pr-4">Migre para a Cloud API oficial para maior estabilidade e selo de verificação.</p>
            <button className="text-xs font-semibold bg-teal-900 text-[#D6E8E6] px-4 py-2 rounded-lg self-start hover:bg-teal-800 transition-colors shadow-sm">
              Fazer Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex items-center gap-4 border-b border-primary/10">
        <button 
          onClick={() => setActiveTab("all")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "all" ? "text-primary" : "text-secondary/40 hover:text-secondary/70"}`}
        >
          Todos os Canais
          {activeTab === "all" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("whatsapp")}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === "whatsapp" ? "text-primary" : "text-secondary/40 hover:text-secondary/70"}`}
        >
          <MessageCircle size={14} /> WhatsApp
          {activeTab === "whatsapp" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
        <button 
          onClick={() => setActiveTab("email")}
          className={`pb-3 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === "email" ? "text-primary" : "text-secondary/40 hover:text-secondary/70"}`}
        >
          <Mail size={14} /> E-mail
          {activeTab === "email" && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
        </button>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
           <div className="col-span-full p-12 flex justify-center items-center">
             <Loader2 className="animate-spin text-primary" size={32} />
           </div>
        ) : filteredChannels.length === 0 ? (
           <div className="col-span-full p-12 text-center bg-surface-container rounded-2xl">
              <div className="w-16 h-16 bg-surface-container-highest/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-secondary/40" size={32} />
              </div>
              <h3 className="text-lg font-bold text-secondary">Nenhum canal encontrado</h3>
              <p className="text-sm text-secondary/50 mt-2 max-w-sm mx-auto">
                 Conecte um número de WhatsApp ou endereço de E-mail para centralizar seu atendimento.
              </p>
           </div>
        ) : (
          filteredChannels.map(channel => (
            <div key={channel.id} className="bg-surface-container hover:bg-surface-container-highest rounded-2xl shadow-card border border-transparent hover:border-outline-variant/30 p-5 flex flex-col relative group transition-all hover:shadow-card-hover">
              {/* Options button */}
              <button className="absolute top-4 right-4 p-2 text-secondary/20 hover:text-secondary/60 rounded-lg hover:bg-background/50 transition-colors opacity-0 group-hover:opacity-100">
                <Settings2 size={16} />
              </button>

              {/* Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-inner ${
                  channel.type === "whatsapp" 
                    ? "from-green-500/20 to-green-500/5 text-green-500" 
                    : "from-blue-500/20 to-blue-500/5 text-blue-500"
                }`}>
                  {channel.type === "whatsapp" ? <MessageCircle size={24} /> : <Mail size={24} />}
                </div>
                <div className={`px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-bold shadow-sm ${
                  channel.status === "connected" 
                    ? "bg-green-500/10 text-green-500" 
                    : channel.status === "qr_pending"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    channel.status === "connected" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : channel.status === "qr_pending" ? "bg-yellow-500 animate-pulse" : "bg-red-500"
                  }`} />
                  {channel.status === "connected" ? "CONECTADO" : channel.status === "qr_pending" ? "AGUARDANDO QR" : "DESCONECTADO"}
                </div>
              </div>

              {/* Info */}
              <h3 className="text-base font-semibold text-secondary/90 mb-1">{channel.name}</h3>
              <p className="text-sm text-secondary/50 mb-4">{channel.details}</p>

              <div className="mt-auto pt-4 border-t border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-secondary/40">
                  <Globe size={12} />
                  {channel.provider}
                </div>
                {channel.status === "qr_pending" && (
                  <button className="text-[10px] font-bold text-yellow-500 hover:text-yellow-600 uppercase tracking-wider transition-colors">
                    Ler Qr Code →
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Add New Card */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary/[0.02] border-2 border-dashed border-primary/10 rounded-2xl flex flex-col items-center justify-center p-8 text-primary/40 hover:bg-primary/[0.04] hover:border-primary/30 hover:text-primary transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
            <Plus size={24} />
          </div>
          <span className="font-semibold text-sm">Adicionar Canal</span>
          <span className="text-[10px] mt-1 text-center opacity-70">Conecte um novo número ou e-mail</span>
        </button>
      </div>

      {/* Add Modal (Demo) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-primary/10 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-surface-container/30">
              <h2 className="text-xl font-bold text-secondary">Novo Canal</h2>
              <button onClick={() => setShowAddModal(false)} className="text-secondary/40 hover:text-secondary/80 transition-colors p-1 rounded-lg hover:bg-background/50">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl border border-primary/10 hover:border-green-500/50 hover:bg-green-500/5 transition-all text-left flex flex-col group bg-surface-container hover:shadow-card">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <MessageCircle size={20} />
                </div>
                <h3 className="font-semibold text-secondary/90">WhatsApp</h3>
                <p className="text-xs text-secondary/50 mt-1">Conectar via QR Code (Evolution API)</p>
              </button>
              <button className="p-4 rounded-xl border border-primary/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left flex flex-col group bg-surface-container hover:shadow-card">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <Mail size={20} />
                </div>
                <h3 className="font-semibold text-secondary/90">E-mail SMTP/IMAP</h3>
                <p className="text-xs text-secondary/50 mt-1">Sincronizar caixa de entrada do escritório</p>
              </button>
              <button className="p-4 rounded-xl border border-primary/10 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all text-left flex flex-col group col-span-2 bg-surface-container hover:shadow-card relative overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner">
                  <Smartphone size={20} />
                </div>
                <h3 className="font-semibold text-secondary/90">WhatsApp Cloud API (Oficial)</h3>
                <p className="text-xs text-secondary/50 mt-1">Para números verificados na Meta Business (sem risco de banimento)</p>
                <span className="inline-block mt-3 text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full self-start tracking-wider uppercase">Plano Enterprise</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
