import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-hackops.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
    console.warn(
      'SUPABASE NOTICE: NEXT_PUBLIC_SUPABASE_URL is missing or using placeholder. Using fallback client.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
