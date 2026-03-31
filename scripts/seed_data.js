// Final fix: insert remaining data with correct enum values
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const s = createClient(
  'https://voosldmiiwxzfofazviq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3NsZG1paXd4emZvZmF6dmlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4MjkxMSwiZXhwIjoyMDg5NjU4OTExfQ.xEk8n1t1fdQRxib-F4feEj_Jkax4_gcCIMXlR0hueYA'
);
const T = 'ce014a21-9207-4a53-8c80-39292cd8c0cd';

async function main() {
  const out = [];

  // 1. Insert more agent_tasks with type 'process_alert' 
  out.push('Agent Tasks:');
  const { data: tasks, error: tErr } = await s.from('agent_tasks').insert([
    { tenant_id: T, type: 'process_alert', title: 'Prazo de contestação vence em 4 dias', summary: 'O prazo para contestação precisa de ação urgente.', priority: 'high', status: 'pending' },
    { tenant_id: T, type: 'process_alert', title: 'Nova publicação DJe detectada', summary: 'Publicação no DJe referente ao caso Silva. Revisar.', priority: 'medium', status: 'pending' },
  ]).select();
  out.push(tErr ? '  ❌ ' + tErr.message : '  ✅ ' + tasks.length + ' tarefas inseridas');

  // 2. Update existing invoices to have status 'rascunho' (the only valid enum we found)
  // But first let's try other common enum values
  out.push('\nInvoice status enum discovery:');
  const statusTests = ['rascunho','emitida','paga','cancelada','vencida','aberta','fechada','aprovada','em_analise','aguardando'];
  for (const st of statusTests) {
    const { error } = await s.from('invoices').insert({
      tenant_id: T, description: '__test__', amount: 1, status: st, created_by: '6689db37-dd08-42dd-9b94-d93ab8f62a53'
    });
    if (!error) {
      out.push('  VALID: ' + st);
      await s.from('invoices').delete().eq('description', '__test__');
    }
  }

  // Update 2 invoices to 'paga' if that's valid, otherwise use 'rascunho'
  const { data: allInv } = await s.from('invoices').select('id, description').eq('tenant_id', T);
  out.push('\nExisting invoices: ' + (allInv?.length || 0));

  // Final count
  out.push('\n=== CONTAGEM FINAL ===');
  for (const t of ['contacts','cases','calendar_events','invoices','campaigns','agent_tasks']) {
    const { count } = await s.from(t).select('*', { count: 'exact', head: true });
    out.push(`  ${t}: ${count || 0}`);
  }

  fs.writeFileSync('c:/Users/Juan Paulo/Desktop/Adv/scripts/final_result.txt', out.join('\n'));
  console.log(out.join('\n'));
}

main().catch(console.error);
