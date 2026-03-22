import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://voosldmiiwxzfofazviq.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvb3NsZG1paXd4emZvZmF6dmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODI5MTEsImV4cCI6MjA4OTY1ODkxMX0.-L70LzlURYrRlMjV1IjZAOD-0E02ViF1-k50ClVh570';

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'test@juris.com',
    password: 'Password123!',
    options: {
      data: {
        name: 'Test User'
      }
    }
  });

  if (error) {
    console.error('Sign up error:', error.message);
  } else {
    console.log('User signed up successfully:', data.user?.id);
  }
}

signUpUser();
