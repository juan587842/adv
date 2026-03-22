import Link from "next/link";
import { 
  Briefcase, 
  CalendarDays, 
  Gavel, 
  Inbox, 
  LayoutDashboard, 
  Settings, 
  BrainCircuit, 
  Users,
  DollarSign,
  BookOpen,
  ShieldCheck
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-primary/[0.06]">
          <Gavel className="w-5 h-5 text-primary mr-3" />
          <span className="text-lg font-bold text-primary tracking-wide">Juris AI</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 space-y-0.5 px-3">
          <SidebarItem href="/dashboard" icon={<LayoutDashboard size={18} />} text="Visão Geral" active />
          <SidebarItem href="/dashboard/cases" icon={<Briefcase size={18} />} text="Dossiês" />
          <SidebarItem href="/dashboard/contacts" icon={<Users size={18} />} text="Clientes & Leads" />
          <SidebarItem href="/dashboard/inbox" icon={<Inbox size={18} />} text="Inbox" />
          <SidebarItem href="/dashboard/calendar" icon={<CalendarDays size={18} />} text="Prazos" />
          <SidebarItem href="/dashboard/financial" icon={<DollarSign size={18} />} text="Financeiro" />
          <SidebarItem href="/dashboard/publications" icon={<BookOpen size={18} />} text="Clipping" />
          
          <div className="mt-6 mb-2 px-3 text-[10px] font-semibold text-primary/40 uppercase tracking-widest">
            Inteligência
          </div>
          <SidebarItem href="/dashboard/ai" icon={<BrainCircuit size={18} />} text="Skills & Macros" />
          
          <div className="mt-6 mb-2 px-3 text-[10px] font-semibold text-primary/40 uppercase tracking-widest">
            Gestão
          </div>
          <SidebarItem href="/dashboard/settings" icon={<Settings size={18} />} text="Configurações" />
          <SidebarItem href="/dashboard/settings/audit" icon={<ShieldCheck size={18} />} text="Auditoria (LGPD)" />
        </nav>
        
        <div className="p-4 border-t border-primary/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-xs font-bold">
            JP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-secondary/90">Dr. Juan Paulo</span>
            <span className="text-[10px] text-primary/50">Administrator</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-14 flex items-center justify-between px-8 border-b border-primary/[0.06] bg-surface/60 backdrop-blur-md z-10">
            <div />
            <div className="flex items-center gap-4 text-xs">
                <div className="bg-primary/[0.06] text-primary/80 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    AI Agent Online
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, text, active = false }: { href: string; icon: React.ReactNode; text: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm
        ${active 
          ? 'bg-primary/[0.08] text-primary font-medium' 
          : 'text-secondary/60 hover:text-secondary/90 hover:bg-white/[0.02]'
        }`}
    >
      <div className={`${active ? 'text-primary' : 'text-secondary/40'}`}>
        {icon}
      </div>
      <span>{text}</span>
    </Link>
  );
}
