"use client";

import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, AlertCircle, Loader2 } from "lucide-react";
import CPCCalculator from "@/components/calendar/CPCCalculator";
import { useSupabaseQuery } from "@/hooks/useSupabaseQuery";
import { useTenantId } from "@/hooks/useTenantId";
import { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, getDaysInMonth, addMonths, subMonths, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CalendarPage() {
  const { tenantId } = useTenantId();
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  // Calendar setup
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const numDaysInMonth = getDaysInMonth(currentDate);
  const daysInMonthArray = Array.from({ length: numDaysInMonth }, (_, i) => i + 1);
  const startingEmptyDays = firstDayOfMonth.getDay(); // 0-6

  const { data: rawEvents, isLoading } = useSupabaseQuery<any[]>(
    async (supabase) => {
      if (!tenantId) return { data: null, error: null };
      return supabase
        .from('calendar_events')
        .select(`
          id, title, start_time, event_type, description
        `)
        .eq('tenant_id', tenantId)
        .gte('start_time', firstDayOfMonth.toISOString())
        .lte('start_time', lastDayOfMonth.toISOString())
        .order('start_time', { ascending: true });
    },
    [tenantId, currentDate]
  );

  const events = useMemo(() => {
    if (!rawEvents) return [];
    return rawEvents.map(e => {
      const date = new Date(e.start_time);
      let typeStr = "meeting";
      // Basic typing inference built into user's DB logic
      if (e.event_type?.includes('hearing') || e.title?.toLowerCase().includes('audiência')) typeStr = 'hearing';
      else if (e.event_type?.includes('deadline') || e.title?.toLowerCase().includes('prazo')) typeStr = 'deadline';
      
      return {
        id: e.id,
        day: date.getDate(),
        fullDate: date,
        title: e.title || "Evento",
        type: typeStr,
        description: e.description || "Evento na nuvem",
        time: format(date, 'HH:mm')
      };
    });
  }, [rawEvents]);

  const next7DaysEvents = useMemo(() => {
    const today = new Date();
    const in7Days = addDays(today, 7);
    return events.filter(e => isAfter(e.fullDate, today) && isBefore(e.fullDate, in7Days)).slice(0, 5);
  }, [events]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Calendário e Prazos</h1>
          <p className="text-sm text-secondary/40 mt-1">Sincronizado operando com dias úteis e datas fatais.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 bg-background/50 text-secondary/60 rounded-lg text-sm font-medium hover:bg-background/80 transition-colors"
          >
            Hoje
          </button>
          <button className="px-4 py-2 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors flex items-center gap-2">
            <Plus size={16} /> Novo Evento
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Calendar Grid */}
          <div className="lg:col-span-2 bg-surface-container rounded-3xl shadow-card overflow-hidden flex flex-col border border-surface-container-highest/30">
            <div className="flex justify-between items-center p-4 border-b border-surface-container-highest/30">
              <h2 className="text-base font-semibold text-secondary flex items-center gap-2 capitalize">
                <CalendarIcon size={18} className="text-primary/70" /> {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <div className="flex gap-1">
                  <button 
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="p-1.5 text-secondary/40 hover:text-primary hover:bg-primary/[0.06] rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="p-1.5 text-secondary/40 hover:text-primary hover:bg-primary/[0.06] rounded-lg transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
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
                {Array.from({ length: startingEmptyDays }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-20 bg-background/20 rounded-lg"></div>
                ))}
                
                {daysInMonthArray.map(day => {
                  const dayEvents = events.filter(e => e.day === day);
                  return (
                    <div key={day} className="h-20 bg-surface-container-highest/30 rounded-lg p-1 hover:bg-surface-container-highest/50 transition-colors relative group cursor-pointer overflow-hidden border border-transparent hover:border-primary/20">
                      <span className={`text-[10px] font-medium p-0.5 block ${new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() ? 'text-primary' : 'text-secondary/40'}`}>{day}</span>
                      <div className="flex flex-col gap-0.5 mt-0.5 overflow-y-auto max-h-[44px] no-scrollbar">
                        {dayEvents.map((event, idx) => (
                          <div key={idx} className={`text-[9px] px-1 py-0.5 rounded truncate font-medium ${
                            event.type === 'deadline' ? 'bg-red-500/[0.1] text-red-400/80 border border-red-500/10' : 
                            event.type === 'hearing' ? 'bg-primary/[0.1] text-primary/80 border border-primary/10' : 
                            'bg-secondary/[0.06] text-secondary/50 border border-secondary/10'
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
              {next7DaysEvents.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm font-medium text-secondary">Sem eventos</p>
                  <p className="text-xs text-outline">Nenhum evento urgente nos próximos 7 dias.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {next7DaysEvents.map((event, idx) => {
                    const isDeadline = event.type === 'deadline';
                    return (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex flex-col items-center justify-center min-w-[44px]
                          ${isDeadline ? 'bg-red-500/[0.06] text-red-400/70' : 'bg-primary/[0.06] text-primary/70'}`}>
                          <span className="text-xs font-bold leading-none">{format(event.fullDate, 'dd')}</span>
                          <span className="text-[9px] font-medium uppercase mt-0.5 opacity-60">{format(event.fullDate, 'MMM', { locale: ptBR })}</span>
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-sm font-medium text-secondary/80 truncate">{event.title}</h4>
                          <p className="text-[10px] text-secondary/40 mt-0.5 max-w-[200px] truncate">{event.time} • {event.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
