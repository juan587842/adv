"use client";

import { useState } from "react";
import { Calculator, Calendar as CalendarIcon, Info, ArrowRight } from "lucide-react";

export default function CPCCalculator() {
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("15");
  const [resultDate, setResultDate] = useState<string | null>(null);

  const calculateDeadline = () => {
    if (!startDate || !days) return;
    
    const date = new Date(startDate);
    let remainingDays = parseInt(days, 10);
    
    while (remainingDays > 0) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        remainingDays--;
      }
    }
    
    setResultDate(date.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  };

  return (
    <div className="bg-surface rounded-xl shadow-card overflow-hidden flex flex-col h-full">
      <div className="bg-primary/[0.04] p-4 border-b border-primary/[0.04] flex items-center justify-between">
        <h3 className="font-semibold text-secondary text-sm flex items-center gap-2">
          <Calculator size={16} className="text-primary/70" /> Calculadora CPC
        </h3>
        <span className="text-[9px] uppercase font-bold text-secondary/30 bg-background/50 px-2 py-0.5 rounded-md tracking-wider">Apenas Dias Úteis</span>
      </div>
      
      <div className="p-5 flex-1 space-y-4">
        <div>
          <label className="block text-[10px] font-semibold text-secondary/40 mb-1.5 uppercase tracking-widest">Data de Publicação / Intimação</label>
          <div className="relative">
             <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={14} />
             <input 
               type="date" 
               className="w-full pl-10 pr-4 py-2 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary"
               value={startDate}
               onChange={(e) => setStartDate(e.target.value)}
             />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-secondary/40 mb-1.5 uppercase tracking-widest">Prazo (Dias)</label>
          <select 
            className="w-full px-4 py-2 bg-background/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 text-secondary"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          >
            <option value="5">5 dias (Embargos de Declaração)</option>
            <option value="8">8 dias (CLT - Recurso Ordinário)</option>
            <option value="15">15 dias (Apelação, Contestação CPC)</option>
            <option value="30">30 dias (Fazenda Pública)</option>
            <option value="other">Outro prazo personalizado...</option>
          </select>
        </div>

        <button 
          onClick={calculateDeadline}
          className="w-full py-2.5 bg-primary text-background rounded-lg text-sm font-semibold hover:bg-primary-light transition-colors mt-2"
        >
          Calcular Prazo Fatal
        </button>

        {resultDate && (
          <div className="mt-4 p-4 bg-green-500/[0.06] rounded-lg">
            <p className="text-[10px] text-green-400/80 font-semibold uppercase mb-1 flex items-center gap-1 tracking-wider">
              <ArrowRight size={12} /> Prazo Fatal Estimado
            </p>
            <p className="text-sm text-secondary font-bold capitalize">{resultDate}</p>
            <div className="mt-2 text-[10px] text-secondary/30 flex items-start gap-1">
              <Info size={11} className="flex-shrink-0 mt-0.5" />
              <p>Cálculo exclui sábados e domingos. Verifique feriados municipais no TRT correspondente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
