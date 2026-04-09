"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarDays,
  Inbox,
  LayoutDashboard,
  Settings,
  BrainCircuit,
  Users,
  DollarSign,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Cpu,
  FileText,
} from "lucide-react";

const mainLinks = [
  { href: "/dashboard", icon: <LayoutDashboard size={18} />, text: "Visão Geral", exact: true },
  { href: "/dashboard/cases", icon: <Briefcase size={18} />, text: "Processos" },
  { href: "/dashboard/contacts", icon: <Users size={18} />, text: "Clientes & Leads" },
  { href: "/dashboard/inbox", icon: <Inbox size={18} />, text: "Caixa de Entrada" },
  { href: "/dashboard/calendar", icon: <CalendarDays size={18} />, text: "Prazos" },
  { href: "/dashboard/financial", icon: <DollarSign size={18} />, text: "Financeiro" },
  { href: "/dashboard/publications", icon: <BookOpen size={18} />, text: "Publicações (Clipping)" },
];

const intelligenceLinks = [
  { href: "/dashboard/intelligence", icon: <BrainCircuit size={18} />, text: "Central de IA", exact: true },
  { href: "/dashboard/intelligence/tools", icon: <Sparkles size={18} />, text: "Ferramentas" },
  { href: "/dashboard/intelligence/drafts", icon: <FileText size={18} />, text: "Minutas Salvas" },
  { href: "/dashboard/ai", icon: <Cpu size={18} />, text: "Skills & Macros" },
];

const managementLinks: Array<{ href: string; icon: React.ReactNode; text: string; exact?: boolean }> = [
  { href: "/dashboard/settings/channels", icon: <Settings size={18} />, text: "Canais & Integrações" },
  { href: "/dashboard/settings/audit", icon: <ShieldCheck size={18} />, text: "Auditoria (LGPD)" },
];

export default function SidebarNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className={`flex-1 overflow-y-auto py-4 space-y-0.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
      {mainLinks.map((link) => (
        <SidebarItem key={link.href} {...link} active={isActive(link.href, link.exact)} isCollapsed={isCollapsed} />
      ))}

      {!isCollapsed ? (
        <div className="mt-6 mb-2 px-3 text-[10px] font-semibold text-primary/40 uppercase tracking-widest transition-opacity duration-300">
          Inteligência
        </div>
      ) : (
        <div className="mt-6 mb-2 border-b border-primary/10 mx-2" />
      )}
      {intelligenceLinks.map((link) => (
        <SidebarItem key={link.href} {...link} active={isActive(link.href, link.exact)} isCollapsed={isCollapsed} />
      ))}

      {!isCollapsed ? (
        <div className="mt-6 mb-2 px-3 text-[10px] font-semibold text-primary/40 uppercase tracking-widest transition-opacity duration-300">
          Gestão
        </div>
      ) : (
        <div className="mt-6 mb-2 border-b border-primary/10 mx-2" />
      )}
      {managementLinks.map((link) => (
        <SidebarItem key={link.href} {...link} active={isActive(link.href, link.exact)} isCollapsed={isCollapsed} />
      ))}
    </nav>
  );
}

function SidebarItem({
  href,
  icon,
  text,
  active = false,
  isCollapsed = false,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  exact?: boolean;
  isCollapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      title={isCollapsed ? text : undefined}
      className={`flex items-center gap-3 py-2 rounded-lg transition-all duration-200 text-sm overflow-hidden
        ${isCollapsed ? 'justify-center px-0 mx-auto w-10' : 'px-3'}
        ${active
          ? "bg-primary/[0.08] text-primary font-medium"
          : "text-secondary/60 hover:text-secondary/90 hover:bg-white/[0.02]"
        }`}
    >
      <div className={`flex-shrink-0 ${active ? "text-primary" : "text-secondary/40"}`}>
        {icon}
      </div>
      {!isCollapsed && <span className="truncate whitespace-nowrap">{text}</span>}
    </Link>
  );
}
