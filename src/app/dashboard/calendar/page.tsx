"use client";

import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import CPCCalculator from "@/components/calendar/CPCCalculator";

export default function CalendarPage() {
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const events = [
    { day: 5, title: "Audiência Una", type: "hearing", time: "14:00" },
    { day: 12, title: "Prazo Contestação", type: "deadline", time: "23:59" },
    { day: 12, title: "Reunião Cliente", type: "meeting", time: "10:00" },
    { day: 24, title: "Encerramento Fase", type: "deadline", time: "18:00" },
    { day: 28, title: "Sustentação Oral", type: "hearing", time: "09:30" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Calendário e Prazos</h1>
          <p className="text-sm text-secondary/40 mt-1">Sincronizado operando com dias úteis e datas fatais.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-background/50 text-secondary/60 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors">
            Hoje
          </button>
          <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
            <Plus size={16} /> Novo Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Calendar Grid */}
        <div className="lg:col-span-2 bg-surface-container rounded-3xl shadow-card overflow-hidden flex flex-col border border-surface-container-highest/30">
          <div className="flex justify-between items-center p-4 border-b border-surface-container-highest/30">
             <h2 className="text-base font-semibold text-secondary flex items-center gap-2">
               <CalendarIcon size={18} className="text-primary/70" /> Março 2026
             </h2>
             <div className="flex gap-1">
                <button className="p-1.5 text-secondary/40 hover:text-primary hover:bg-primary/[0.06] rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                <button className="p-1.5 text-secondary/40 hover:text-primary hover:bg-primary/[0.06] rounded-lg transition-colors"><ChevronRight size={18} /></button>
             </div>
          </div>
          
          <div className="flex-1 p-4">
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day, i) => (
                <div key={day} className={`text-center text-[10px] font-semibold py-2 uppercase tracking-widest ${i === 0 || i === 6 ? 'text-red-400/50' : 'text-secondary/30'}`}>
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty starting days */}
              <div className="h-20 bg-background/20 rounded-lg"></div>
              <div className="h-20 bg-background/20 rounded-lg"></div>
              
              {daysInMonth.map(day => {
                const dayEvents = events.filter(e => e.day === day);
                return (
                  <div key={day} className="h-20 bg-surface-container-highest/30 rounded-lg p-1 hover:bg-surface-container-highest/50 transition-colors relative group cursor-pointer">
                    <span className="text-[10px] font-medium text-secondary/40 p-0.5 block">{day}</span>
                    <div className="flex flex-col gap-0.5 mt-0.5 overflow-y-auto max-h-[44px] no-scrollbar">
                      {dayEvents.map((event, idx) => (
                         <div key={idx} className={`text-[9px] px-1 py-0.5 rounded truncate font-medium ${
                           event.type === 'deadline' ? 'bg-red-500/[0.1] text-red-400/80' : 
                           event.type === 'hearing' ? 'bg-primary/[0.1] text-primary/80' : 
                           'bg-secondary/[0.06] text-secondary/50'
                         }`}>
                           {event.time} - {event.title}
                         </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="h-[430px]">
            <CPCCalculator />
          </div>

          <div className="bg-surface-container rounded-3xl p-5 shadow-card border border-surface-container-highest/30">
             <h3 className="font-semibold text-secondary flex items-center gap-2 mb-4 text-sm">
               <AlertCircle size={16} className="text-primary/70" /> Próximos 7 Dias
             </h3>
             <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/[0.06] rounded-lg text-primary/70 flex flex-col items-center justify-center min-w-[44px]">
                    <span className="text-xs font-bold leading-none">05</span>
                    <span className="text-[9px] font-medium uppercase mt-0.5 opacity-60">Mar</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary/80">Audiência Una</h4>
                    <p className="text-[10px] text-secondary/30 mt-0.5 max-w-[200px] truncate">14:00 • Contencioso Trabalhista</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/[0.06] rounded-lg text-red-400/70 flex flex-col items-center justify-center min-w-[44px]">
                    <span className="text-xs font-bold leading-none">12</span>
                    <span className="text-[9px] font-medium uppercase mt-0.5 opacity-60">Mar</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-secondary/80">Prazo Contestação</h4>
                    <p className="text-[10px] text-secondary/30 mt-0.5 max-w-[200px] truncate">15 Dias Úteis • Due Diligence</p>
                  </div>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
