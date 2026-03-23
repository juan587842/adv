import { UrgentDeadlinesZone } from "@/components/dashboard/F1_UrgentDeadlines";
import { ActiveCasesZone } from "@/components/dashboard/F2_ActiveCases";
import { InboxZone } from "@/components/dashboard/F3_InboxOverview";
import { FinancialOverviewZone } from "@/components/dashboard/F4_FinancialOverview";
import { RecentActivityZone } from "@/components/dashboard/F5_RecentActivity";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Visão Geral</h1>
          <p className="text-sm text-secondary/70 mt-1">Bem-vindo ao Juris AI. Aqui está o resumo operacional do escritório hoje.</p>
        </div>
        
        <div className="hidden md:flex gap-3">
          <button className="px-5 py-2.5 bg-surface/50 backdrop-blur-md rounded-xl text-sm font-semibold text-secondary/70 hover:bg-surface hover:text-secondary hover:shadow-[0_4px_16px_rgba(230,196,135,0.05)] transition-all">
            Gerar Relatório
          </button>
          <button className="px-5 py-2.5 bg-primary text-background rounded-xl text-sm font-bold hover:bg-primary-light hover:shadow-[0_4px_16px_rgba(230,196,135,0.2)] transition-all">
            Novo Processo
          </button>
        </div>
      </div>

      {/* F-Pattern Layout Grid */}
      
      {/* Top Banner - F1: Highest priority, horizontal reading line 1 */}
      <div className="w-full">
        <UrgentDeadlinesZone />
      </div>
      
      {/* Middle Section - Secondary horizontal reading line */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* F2: Active cases taking main visual weight next */}
        <div className="lg:col-span-2">
          <ActiveCasesZone />
        </div>
        
        {/* F3: Quick glance zone on the right */}
        <div className="lg:col-span-1">
          <InboxZone />
        </div>
      </div>
      
      {/* Bottom Section - Vertical scanning zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* F4: Financial metrics */}
        <div className="lg:col-span-1">
          <FinancialOverviewZone />
        </div>
        
        {/* F5: Audit logs and latest activities taking the lower exit path */}
        <div className="lg:col-span-1">
          <RecentActivityZone />
        </div>
      </div>
    </div>
  );
}
