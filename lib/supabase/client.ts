import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    throw new Error(
      'CRITICAL SUPABASE ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables in .env.local / Vercel Environment Variables.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
