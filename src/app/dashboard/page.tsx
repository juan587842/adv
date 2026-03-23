import { UrgentDeadlinesZone } from "@/components/dashboard/F1_UrgentDeadlines";
import { ActiveCasesZone } from "@/components/dashboard/F2_ActiveCases";
import { InboxZone } from "@/components/dashboard/F3_InboxOverview";
import { FinancialOverviewZone } from "@/components/dashboard/F4_FinancialOverview";
import { RecentActivityZone } from "@/components/dashboard/F5_RecentActivity";
import { DashboardFAB } from "@/components/dashboard/DashboardFAB";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* ROW 1: PRIORITY ZONE (Asymmetric Focus) */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4">
          <UrgentDeadlinesZone />
        </div>
      </section>

      {/* ROW 2: PIPELINE & INBOX */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveCasesZone />
        <InboxZone />
      </section>

      {/* ROW 3: FINANCIAL & ACTIVITY */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialOverviewZone />
        <RecentActivityZone />
      </section>

      <DashboardFAB />
    </div>
  );
}
