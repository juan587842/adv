"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Activity, Search, Filter, ShieldAlert, Download, Eye, FileText, UserCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { JsonViewerModal } from "@/components/modals/JsonViewerModal";

type AuditLog = {
  id: string;
  tenant_id: string;
  user_id: string;
  action_type: string;
  resource_id: string;
  metadata: any;
  created_at: string;
  user_email?: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJson, setSelectedJson] = useState<Record<string, any> | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: members, error: mErr } = await supabase
        .from('tenant_members')
        .select('tenant_id, role')
        .eq('user_id', user.id)
        .single();
        
      if (mErr || !members) return;

      // Only admins can view logs
      if (members.role !== 'admin') {
         setLoading(false);
         return;
      }

      // Fetch logs
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          user:user_id (email)
        `)
        .eq('tenant_id', members.tenant_id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      
      // Map user email if we joined it (auth.users isn't exposed to public schema, so we need to rely on profiles, or fallback to user_id)
      // Since auth.users is protected, we'll fetch from profiles
      const logData = data || [];
      
      // Let's get profiles for these user_ids
      const userIds = [...new Set(logData.map(l => l.user_id))];
      const { data: profiles } = await supabase.from('profiles').select('id, email, full_name').in('id', userIds);
      
      const enrichedLogs = logData.map(log => {
        const profile = profiles?.find(p => p.id === log.user_id);
        return {
          ...log,
          user_email: profile ? (profile.full_name || profile.email) : log.user_id
        };
      });

      setLogs(enrichedLogs);
    } catch (err) {
      console.error("Error fetching audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('VIEW')) return <Eye size={14} className="text-blue-500" />;
    if (action.includes('DOWNLOAD')) return <Download size={14} className="text-amber-500" />;
    if (action.includes('APPROVE') || action.includes('HITL')) return <ShieldCheck size={14} className="text-green-500" />;
    return <Activity size={14} className="text-secondary/50" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-secondary">
            <ShieldCheck className="text-primary" /> Trilha de Auditoria (LGPD)
          </h1>
          <p className="text-secondary/60 text-sm mt-1">
            Registro imutável de acessos e ações críticas no sistema. Acesso restrito a DPOs e Administradores.
          </p>
        </div>
        
        <div className="flex bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4 py-2 rounded-xl text-xs font-medium items-center gap-2">
            <ShieldAlert size={16} /> 
            Logs Invioláveis (Append-only)
        </div>
      </div>

      <div className="bg-surface border border-primary/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-primary/10 flex items-center gap-4 bg-background/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" size={16} />
            <input 
              type="text"
               placeholder="Buscar log por usuário ou recurso..." 
               className="w-full pl-9 pr-4 py-2 bg-background border border-primary/20 rounded-lg text-sm focus:outline-none focus:border-primary/50 text-secondary"
            />
          </div>
          <button className="p-2 border border-primary/20 rounded-lg text-secondary/60 hover:text-primary hover:bg-primary/5 transition-colors">
            <Filter size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-secondary/60 uppercase bg-primary/5 border-b border-primary/10">
              <tr>
                <th className="px-6 py-4 font-medium">Data/Hora (UTC-3)</th>
                <th className="px-6 py-4 font-medium">Usuário Responsável</th>
                <th className="px-6 py-4 font-medium">Ação Realizada</th>
                <th className="px-6 py-4 font-medium">Recurso/ID Alvo</th>
                <th className="px-6 py-4 font-medium text-right">Metadados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondary/40">
                    <Activity className="animate-spin mx-auto mb-2" size={20} />
                    Carregando trilha de auditoria...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-secondary/40">
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-secondary/70 font-mono">
                      {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserCircle size={16} className="text-secondary/40" />
                        <span className="font-medium text-secondary/90 truncate max-w-[150px]" title={log.user_email}>
                          {log.user_email || log.user_id.substring(0,8)+'...'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                         <span className="flex items-center justify-center w-6 h-6 rounded-md bg-background border border-primary/10">
                           {getActionIcon(log.action_type)}
                         </span>
                         <span className="font-semibold text-xs tracking-wider uppercase text-secondary/80">
                           {log.action_type}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-secondary/60">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} className="text-primary/40" />
                        {log.resource_id ? (log.resource_id.length > 20 ? log.resource_id.substring(0,20)+'...' : log.resource_id) : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       {Object.keys(log.metadata || {}).length > 0 ? (
                         <button 
                           onClick={() => setSelectedJson(log.metadata)}
                           className="text-[10px] uppercase font-bold text-primary/60 hover:text-primary bg-primary/5 px-2 py-1 rounded"
                         >
                           Ver JSON
                         </button>
                       ) : (
                         <span className="text-[10px] text-secondary/30">-</span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedJson && (
        <JsonViewerModal
          data={selectedJson}
          onClose={() => setSelectedJson(null)}
        />
      )}
    </div>
  );
}
