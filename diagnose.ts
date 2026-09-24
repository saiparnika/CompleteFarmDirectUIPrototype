import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

async function main() {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Authenticate as a farmer. Wait, I don't have the password.
  // The UI is logged in. Let's just query via RPC or bypass RLS? No, we need the exact error.
  // We can query as a farmer by logging in. Let's use the 'parnika@example.com' or 'farmer@example.com' if we know it.
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'farmer@example.com',
    password: 'password123'
  });

  if (authError) {
    console.log("Auth Error:", authError);
    return;
  }

  console.log("Logged in farmer UID:", authData.user?.id);

  const { data, error } = await supabase
    .from('orders')
    .select('id, status');

  console.log("Orders Error:", error);
  console.log("Orders Data:", data);
}

main().catch(console.error);
