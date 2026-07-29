/*
================================================================================
SUPABASE GOOGLE OAUTH SETUP CHECKLIST & DOCUMENTATION
================================================================================
a. Supabase Dashboard → Authentication → Providers → Google must be enabled 
   with a valid Client ID + Client Secret from Google Cloud Console.
b. Supabase Dashboard → Authentication → URL Configuration must include the 
   production domain (https://hackers-ai.vercel.app) and localhost (http://localhost:3000) 
   in Site URL / Redirect URLs.
c. Google Cloud Console → Credentials → OAuth Client → Authorized redirect URIs 
   must include https://jmfhunktyyozbuveonuj.supabase.co/auth/v1/callback exactly.
================================================================================
*/

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const next = searchParams.get('next') ?? '/dashboard';
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page or dashboard if OAuth code exchange failed
  return NextResponse.redirect(`${origin}/dashboard?auth_error=code_exchange_failed`);
}
