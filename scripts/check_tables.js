const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://voosldmiiwxzfofazviq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3NsZG1paXd4emZvZmF6dmlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4MjkxMSwiZXhwIjoyMDg5NjU4OTExfQ.xEk8n1t1fdQRxib-F4feEj_Jkax4_gcCIMXlR0hueYA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['contact_memories', 'audit_logs', 'publications', 'documents', 'agent_tasks'];
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table ${table} does NOT exist or error:`, error.message);
    } else {
      console.log(`Table ${table} EXISTS. Row count: ${count}`);
    }
  }
}

checkTables().catch(console.error);
