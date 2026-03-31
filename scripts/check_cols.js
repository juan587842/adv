const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://voosldmiiwxzfofazviq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3NsZG1paXd4emZvZmF6dmlxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDA4MjkxMSwiZXhwIjoyMDg5NjU4OTExfQ.xEk8n1t1fdQRxib-F4feEj_Jkax4_gcCIMXlR0hueYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCols() {
  const t = ['audit_logs', 'documents', 'contact_memories'];
  let res = '';
  for(let tn of t) {
     const { data, error } = await supabase.from(tn).select('*').limit(1);
     if (error && error.code === 'PGRST116') {
        const {data:d2, error:e2} = await supabase.from(tn).select('*').limit(1).maybeSingle();
        // still might fail if it's empty
     }
     
     // fetch columns by forcing an error
     const {error: e3} = await supabase.from(tn).select('non_existent_column_123').limit(1);
     if (e3) {
        res += `${tn}: ${e3.message}\n`;
     }
  }
  console.log(res);
}
checkCols().catch(console.error);
