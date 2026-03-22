"use client";

import { useState } from "react";
import { Plus, Play, Pause, Search, Settings2, Users, ArrowRight, BarChart3, Star, Clock } from "lucide-react";
import Link from "next/link";

type Campaign = {
  id: string;
  name: string;
  audience: "Prospecção" | "Pré-Consulta" | "Fase Processual" | "Pós-Venda";
  status: "active" | "paused";
  enrolled: number;
  conversion: string;
  steps: number;
};

const demoCampaigns: Campaign[] = [
  { id: "1", name: "Nutrição Leads Trabalhista", audience: "Prospecção", status: "active", enrolled: 45, conversion: "12%", steps: 3 },
  { id: "2", name: "Lembrete de Audiência/Consulta", audience: "Pré-Consulta", status: "active", enrolled: 18, conversion: "98%", steps: 2 },
  { id: "3", name: "Atualizações do Datajud - Tradutor", audience: "Fase Processual", status: "active", enrolled: 124, conversion: "-", steps: 1 },
  { id: "4", name: "Pesquisa NPS e Retenção", audience: "Pós-Venda", status: "paused", enrolled: 0, conversion: "-", steps: 2 },
];

const stageIcons = {
  "Prospecção": <Users size={16} className="text-blue-500" />,
  "Pré-Consulta": <Clock size={16} className="text-yellow-500" />,
  "Fase Processual": <ArrowRight size={16} className="text-primary" />,
  "Pós-Venda": <Star size={16} className="text-green-500" />,
};

const stageColors = {
  "Prospecção": "from-blue-500/20 to-blue-500/5 text-blue-500",
  "Pré-Consulta": "from-yellow-500/20 to-yellow-500/5 text-yellow-500",
  "Fase Processual": "from-primary/20 to-primary/5 text-primary",
  "Pós-Venda": "from-green-500/20 to-green-500/5 text-green-500",
};

export default function FollowupDashboard() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary">Follow-up Omnicanal</h1>
          <p className="text-secondary/50 mt-1">Gira réguas de cadência e automações estruturadas para todas as fases jurídicas.</p>
        </div>
        <Link 
          href="/dashboard/followup/builder"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-medium rounded-xl hover:bg-primary-light transition-all shadow-card hover:shadow-card-hover"
        >
          <Plus size={18} />
          Criar Nova Régua
        </Link>
      </div>

      {/* Global Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">Contatos Engajados</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">187</span>
            <span className="text-xs text-green-500 font-medium mb-1">+12%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">Taxa de Conversão (Leads)</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">12%</span>
            <span className="text-xs text-secondary/30 font-medium mb-1">Últimos 30 dias</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">No-Shows (Ausências)</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-green-500">2%</span>
            <span className="text-xs text-secondary/30 font-medium mb-1">Redução de 80%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur-md shadow-card border border-primary/[0.03]">
          <p className="text-[10px] text-secondary/40 font-bold uppercase tracking-wider mb-1">NPS Global</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-secondary/90">78</span>
            <span className="text-xs text-green-500 font-medium mb-1">Zona de Excelência</span>
          </div>
        </div>
      </div>

      {/* Campaign List Header */}
      <div className="bg-surface/60 backdrop-blur-md rounded-2xl shadow-card border border-primary/[0.03] overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-primary/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/20">
          <div className="flex gap-2 bg-surface p-1 rounded-xl shadow-inner-glow border border-primary/[0.02]">
            {["all", "Prospecção", "Pré-Consulta", "Fase Processual", "Pós-Venda"].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  filter === tab ? "bg-primary text-background shadow-md" : "text-secondary/50 hover:text-secondary/80"
                }`}
              >
                {tab === "all" ? "Todas as Réguas" : tab}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={14} />
            <input
              type="text"
              placeholder="Buscar régua..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-surface rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary placeholder:text-secondary/20 shadow-inner-glow border border-primary/[0.02]"
            />
          </div>
        </div>

        {/* Campaign List */}
        <div className="divide-y divide-primary/[0.03]">
          {demoCampaigns.filter(c => filter === "all" || c.audience === filter).map(campaign => (
            <div key={campaign.id} className="p-4 sm:p-5 hover:bg-primary/[0.01] transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between group">
              
              <div className="flex items-center gap-4 flex-1">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${stageColors[campaign.audience]}`}>
                  {stageIcons[campaign.audience]}
                </div>
                
                {/* Info */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-secondary/90">{campaign.name}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      campaign.status === "active" ? "bg-green-500/10 text-green-500" : "bg-secondary/10 text-secondary/40"
                    }`}>
                      {campaign.status === "active" ? "Ativa" : "Pausada"}
                    </span>
                  </div>
                  <p className="text-xs text-secondary/40">Público: {campaign.audience} • {campaign.steps} toques configurados</p>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-6 sm:gap-8 bg-background/40 sm:bg-transparent rounded-lg p-3 sm:p-0">
                <div>
                  <p className="text-[10px] text-secondary/30 font-medium mb-0.5">Contatos Ativos</p>
                  <p className="text-sm font-bold text-secondary/80">{campaign.enrolled}</p>
                </div>
                <div className="w-px h-8 bg-primary/[0.04] hidden sm:block"></div>
                <div>
                  <p className="text-[10px] text-secondary/30 font-medium mb-0.5">Conversão</p>
                  <p className="text-sm font-bold text-secondary/80">{campaign.conversion}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button className={`p-2 rounded-lg transition-colors shadow-card ${
                  campaign.status === "active" 
                    ? "bg-secondary/10 text-secondary/60 hover:bg-secondary/20" 
                    : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                }`}>
                  {campaign.status === "active" ? <Pause size={16} /> : <Play size={16} />}
                </button>
                <Link href={`/dashboard/followup/builder?id=${campaign.id}`} className="p-2 rounded-lg bg-surface text-secondary/40 hover:text-primary transition-colors shadow-card border border-primary/[0.04]">
                  <Settings2 size={16} />
                </Link>
                <Link href={`/dashboard/followup/metrics/${campaign.id}`} className="p-2 rounded-lg bg-surface text-secondary/40 hover:text-primary transition-colors shadow-card border border-primary/[0.04]">
                  <BarChart3 size={16} />
                </Link>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
