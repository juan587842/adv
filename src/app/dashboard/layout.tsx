"use client";

import { useState } from "react";
import { Gavel, ChevronLeft, ChevronRight } from "lucide-react";
import SidebarNav from "@/components/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background print:block print:h-auto print:overflow-visible print:bg-white">
      {/* Sidebar with enhanced contrast */}
      <aside 
        className={`relative flex-shrink-0 flex flex-col bg-[#0c111c] border-r border-primary/[0.08] shadow-[4px_0_24px_-8px_rgba(0,0,0,0.5)] transition-all duration-300 z-20 print:hidden ${
          isCollapsed ? 'w[72px] sm:w-[72px]' : 'w-64 sm:w-[280px]'
        }`}
      >
        <div className="h-14 flex items-center justify-between px-5 py-2 border-b border-primary/10">
          <div className={`flex items-center overflow-hidden transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <Gavel className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
            <span className="text-lg font-bold text-primary tracking-wide whitespace-nowrap">Juris AI</span>
          </div>
          {isCollapsed && (
            <div className="w-full flex justify-center py-2 absolute left-0 right-0">
               <Gavel className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>
        
        <SidebarNav isCollapsed={isCollapsed} />
        
        <div className={`p-4 border-t border-primary/10 flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold shadow-sm">
            JP
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden whitespace-nowrap">
              <span className="text-sm font-medium text-secondary/90 truncate">Dr. Juan Paulo</span>
              <span className="text-[10px] text-primary/50">Administrator</span>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-surface border border-primary/20 text-secondary hover:text-primary hover:border-primary/40 flex items-center justify-center shadow-lg transition-colors z-50"
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative print:overflow-visible print:block print:h-auto print:flex-none">
        <header className="h-14 flex items-center justify-between px-8 border-b border-primary/5 bg-background/80 backdrop-blur-md z-10 print:hidden">
            <div />
            <div className="flex items-center gap-4 text-xs">
                <div className="bg-primary/[0.06] text-primary/80 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    AI Agent Online
                </div>
            </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 print:p-0 print:overflow-visible print:block print:h-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
