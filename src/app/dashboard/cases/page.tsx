"use client";

import { Search, ChevronDown, Clock, MoreVertical, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DashboardFAB } from "@/components/dashboard/DashboardFAB";

export default function CasesPage() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  const filters = ["Todos", "Em andamento", "Aguardando", "Concluídos", "Arquivados"];

  const expandedCases = [
    {
      id: "1",
      title: "Silva vs. Empresa ABC — Trabalhista",
      category: "Trabalhista",
      number: "0001234-56.2025.5.01.0001",
      activity: "Movimentação detectada há 2h",
      clientName: "Maria Heloísa Silva",
      clientAvatar: "https://i.pravatar.cc/150?u=12",
      lawyerName: "Dr. Ricardo Mendes",
      lawyerAvatar: "https://i.pravatar.cc/150?u=13",
      action: "Contestação — 3 dias",
      actionColor: "error",
      status: "Em andamento",
      statusColor: "green",
      borderColor: "bg-primary shadow-[0_0_15px_rgba(230,196,135,0.4)]"
    },
    {
      id: "2",
      title: "Inventário — Espólio de João Santos",
      category: "Cível",
      number: "5004321-88.2024.8.19.0001",
      activity: "Último acesso ontem às 17:45",
      clientName: "Ana Santos (Inventariante)",
      clientInitials: "AS",
      lawyerName: "Dra. Clara Viana",
      lawyerAvatar: "https://i.pravatar.cc/150?u=14",
      action: "Manifestação — 12 dias",
      actionColor: "outline",
      status: "Aguardando Despacho",
      statusColor: "yellow",
      borderColor: "bg-outline shadow-[0_0_15px_rgba(153,143,129,0.4)]"
    },
    {
      id: "3",
      title: "Oliveira vs. Banco Digital S.A.",
      category: "Consumidor",
      number: "0024411-12.2025.8.26.0100",
      activity: "Protocolo realizado há 4h",
      clientName: "Marcos Oliveira",
      clientAvatar: "https://i.pravatar.cc/150?u=15",
      lawyerName: "Dr. Ricardo Mendes",
      lawyerInitials: "RM",
      action: "Audiência — 15 dias",
      actionColor: "primary",
      status: "Em andamento",
      statusColor: "green",
      borderColor: "bg-primary shadow-[0_0_15px_rgba(230,196,135,0.4)]"
    }
  ];

  const compactCases = [
    {
      id: "4",
      title: "Recurso Especial — Condomínio Miramar",
      number: "0045622-09.2023.8.19.0001",
      area: "CÍVEL",
      lawyer: "Dra. Clara Viana",
      deadline: "Prazo: Amanhã",
      deadlineColor: "text-error",
      indicatorColor: "bg-primary/40"
    },
    {
      id: "5",
      title: "Defesa Administrativa — Posto Rota 66",
      number: "33211-PROCON/RJ-2025",
      area: "ADM",
      lawyer: "Dr. Ricardo Mendes",
      deadline: "Prazo: 8 dias",
      deadlineColor: "text-outline",
      indicatorColor: "bg-primary/40"
    },
    {
      id: "6",
      title: "Divórcio Consensual — Lima/Pereira",
      number: "0011223-44.2024.8.26.0100",
      area: "FAMÍLIA",
      lawyer: "Dra. Clara Viana",
      deadline: "Finalizado",
      deadlineColor: "text-green-400",
      indicatorColor: "bg-green-500/40"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Dossiês Processuais</h1>
      </div>

      {/* Filters Bar */}
      <section className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all 
                ${activeFilter === filter 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container-highest/40 text-on-surface hover:bg-surface-container-highest ring-1 ring-inset ring-outline-variant/30"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select className="appearance-none bg-surface-container-low border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium text-on-surface focus:ring-primary/20 cursor-pointer outline-none">
              <option>Área do Direito</option>
              <option>Trabalhista</option>
              <option>Civil</option>
              <option>Criminal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
          </div>
          <div className="relative">
            <select className="appearance-none bg-surface-container-low border border-outline-variant/30 rounded-xl pl-4 pr-10 py-2.5 text-xs font-medium text-on-surface focus:ring-primary/20 cursor-pointer outline-none">
              <option>Advogado responsável</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" size={16} />
          </div>
          <div className="flex items-center space-x-2 text-outline text-xs font-medium pl-2">
            <span>Ordenar por:</span>
            <button className="text-primary flex items-center hover:opacity-80 transition-opacity">
              Prazo mais próximo
              <ChevronDown className="ml-1" size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Case Cards Grid */}
      <div className="space-y-4">
        {expandedCases.map((c) => (
          <Link key={c.id} href={`/dashboard/cases/${c.id}`} className="block">
            <div className="bg-surface-variant/40 hover:bg-surface-variant/60 backdrop-blur-md p-6 rounded-xl relative transition-all duration-300 group overflow-hidden opacity-95">
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${c.borderColor}`}></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0 md:pr-8">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">{c.title}</h3>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset 
                      ${c.category === 'Cível' ? 'bg-secondary/10 text-secondary ring-secondary/20' : 'bg-primary/10 text-primary ring-primary/20'}`}>
                      {c.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-outline mb-4">
                    <span className="font-mono">{c.number}</span>
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> {c.activity}</span>
                  </div>
                  
                  <div className="flex items-center space-x-6 md:space-x-12">
                    <div className="flex items-center space-x-3">
                      {c.clientInitials ? (
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline text-xs font-bold">
                          {c.clientInitials}
                        </div>
                      ) : (
                        <img className="w-8 h-8 rounded-full object-cover grayscale opacity-80" alt={c.clientName} src={c.clientAvatar!} />
                      )}
                      <div className="text-xs">
                        <p className="text-outline uppercase tracking-tighter text-[9px]">Cliente</p>
                        <p className="font-semibold text-on-surface truncate max-w-[120px] md:max-w-none">{c.clientName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {c.lawyerInitials ? (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold ring-1 ring-primary/40">
                          {c.lawyerInitials}
                        </div>
                      ) : (
                        <img className="w-8 h-8 rounded-full object-cover" alt={c.lawyerName} src={c.lawyerAvatar!} />
                      )}
                      <div className="text-xs">
                        <p className="text-outline uppercase tracking-tighter text-[9px]">Responsável</p>
                        <p className="font-semibold text-on-surface truncate max-w-[120px] md:max-w-none">{c.lawyerName}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row md:flex-col md:items-end justify-between items-center space-y-0 md:space-y-4 md:text-right mt-4 md:mt-0 pt-4 md:pt-0 border-t border-outline/10 md:border-0">
                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-bold flex items-center px-3 py-1.5 rounded-lg border 
                      ${c.actionColor === 'error' ? 'bg-error-container/20 text-error border-error/20' : 
                        c.actionColor === 'primary' ? 'bg-primary/10 text-primary border-primary/20' : 
                        'text-outline border-transparent'}`}>
                      {c.actionColor !== 'outline' && <Calendar size={14} className="mr-2" />}
                      {c.action}
                    </span>
                    <button onClick={(e) => e.preventDefault()} className="p-2 hover:bg-white/10 rounded-full transition-colors text-outline">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${c.statusColor === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'}`}></span>
                    <span className={`text-xs font-medium ${c.statusColor === 'green' ? 'text-green-400' : 'text-yellow-500/80'}`}>{c.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {/* Compact Cases */}
        <div className="pt-4 space-y-4">
          {compactCases.map((c) => (
            <Link key={c.id} href={`/dashboard/cases/${c.id}`} className="block">
              <div className="bg-surface-variant/40 hover:bg-surface-variant/60 backdrop-blur-md p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between transition-all duration-300 gap-4">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className={`w-1 ${c.indicatorColor} h-10 rounded-full`}></div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{c.title}</h4>
                    <p className="text-[10px] text-outline font-mono mt-0.5">{c.number}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:space-x-12 ml-5 md:ml-0">
                  <span className="text-[10px] font-bold text-outline-variant bg-surface-container-high px-2 py-1 rounded hidden md:inline-block">
                    {c.area}
                  </span>
                  <span className="text-[11px] font-medium text-outline hidden md:inline-block">{c.lawyer}</span>
                  <span className={`text-[11px] font-bold ${c.deadlineColor}`}>{c.deadline}</span>
                  <button onClick={(e) => e.preventDefault()} className="text-outline hover:text-primary transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <footer className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-outline-variant/10 pt-8 gap-4">
        <p className="text-xs text-outline font-medium tracking-tight">Mostrando <span className="text-on-surface">1-6</span> de 47 casos</p>
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-lg hover:bg-surface-container-high text-outline transition-colors"><ChevronLeft size={20} /></button>
          <button className="w-9 h-9 rounded-lg bg-primary text-on-primary text-xs font-bold transition-all">1</button>
          <button className="w-9 h-9 rounded-lg hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors">2</button>
          <button className="w-9 h-9 rounded-lg hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors">3</button>
          <span className="px-2 text-outline">...</span>
          <button className="w-9 h-9 rounded-lg hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors">6</button>
          <button className="p-2 rounded-lg hover:bg-surface-container-high text-outline transition-colors"><ChevronRight size={20} /></button>
        </div>
      </footer>

      {/* Ambient Glow Effects */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* Centralized FAB */}
      <DashboardFAB />
    </div>
  );
}
