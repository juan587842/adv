import { Gavel } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";

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
        
        <SidebarNav />
        
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
