import * as fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

async function fetchSchema() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
  const json = await res.json();
  
  if (json.definitions) {
    console.log("Conversations:", Object.keys(json.definitions.conversations?.properties || {}));
    console.log("Messages:", Object.keys(json.definitions.messages?.properties || {}));
  } else {
    console.log("Missing definitions. Keys:", Object.keys(json));
    console.log("JSON:", JSON.stringify(json, null, 2).substring(0, 1000));
  }
}

fetchSchema();
