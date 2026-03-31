// Discover enum values for agent_tasks.type and invoices.status
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const s = createClient(
  'https://voosldmiiwxzfofazviq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3NsZG1paXd4emZvZmF6dmlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4MjkxMSwiZXhwIjoyMDg5NjU4OTExfQ.xEk8n1t1fdQRxib-F4feEj_Jkax4_gcCIMXlR0hueYA'
);

const T = 'ce014a21-9207-4a53-8c80-39292cd8c0cd';

async function main() {
  const out = [];

  // Test agent_tasks type enum
  out.push('=== agent_tasks type enum ===');
  const taskCandidates = [
    'prazo_vencendo','publicacao_nova','follow_up_pendente','anomalia',
    'prazo','publicacao','follow_up','anomalia_detectada',
    'system','manual','auto','custom',
    'alert','warning','info','task','reminder',
    'new_publication','deadline_approaching','contact_inactive',
    'monitoring','processing','notification',
  ];
  for (const t of taskCandidates) {
    const { error } = await s.from('agent_tasks').insert({
      tenant_id: T, type: t, title: '__test__', status: 'pending'
    });
    if (!error) {
      out.push('  VALID: ' + t);
      await s.from('agent_tasks').delete().eq('title', '__test__');
    }
  }

  // Check existing agent_task to see what type it has
  const { data: existingTask } = await s.from('agent_tasks').select('type, status, priority').limit(1);
  if (existingTask?.[0]) {
    out.push('  Existing task type: ' + existingTask[0].type);
    out.push('  Existing task status: ' + existingTask[0].status);
    out.push('  Existing task priority: ' + existingTask[0].priority);
  }

  // Test invoices status enum
  out.push('\n=== invoices status enum ===');
  const statusCandidates = [
    'paid','pending','overdue','cancelled','draft',
    'pago','pendente','atrasado','cancelado','rascunho',
    'open','closed','voided','partial','refunded',
    'emitido','recebido','vencido','em_aberto',
  ];
  for (const st of statusCandidates) {
    const { error } = await s.from('invoices').insert({
      tenant_id: T, description: '__test__', amount: 1, status: st, created_by: '6689db37-dd08-42dd-9b94-d93ab8f62a53'
    });
    if (!error) {
      out.push('  VALID: ' + st);
      await s.from('invoices').delete().eq('description', '__test__');
    }
  }

  fs.writeFileSync('c:/Users/Juan Paulo/Desktop/Adv/scripts/enum_result.txt', out.join('\n'));
  console.log('DONE');
}

main().catch(console.error);
