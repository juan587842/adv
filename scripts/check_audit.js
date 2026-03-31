const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://voosldmiiwxzfofazviq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3NsZG1paXd4emZvZmF6dmlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4MjkxMSwiZXhwIjoyMDg5NjU4OTExfQ.xEk8n1t1fdQRxib-F4feEj_Jkax4_gcCIMXlR0hueYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect(table) {
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]).join(', '));
  } else {
    // Force find columns since we don't have access to schema easily.
    // Actually, we can fetch from information_schema
  }
}

async function findCols() {
  const { data, error } = await supabase.rpc('get_schema_columns', { table_name: 'audit_logs' });
  if (error) {
     console.log('Cant use rpc get_schema_columns');
  }
}
findCols();
