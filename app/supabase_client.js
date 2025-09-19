import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseURL || !supabaseKEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseURL, supabaseKEY, {
  auth: {
    persistSession: true, // keep users logged in after refresh
    autoRefreshToken: true, // refresh tokens automatically
    detectSessionInUrl: true, // handle login callbacks from URL
  },
});

export default supabase;
