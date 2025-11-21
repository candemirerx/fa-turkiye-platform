import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();

    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      // Hata durumunda giriş sayfasına yönlendir
      return NextResponse.redirect(`${origin}/giris?error=${encodeURIComponent(error.message)}`);
    }

    // Kullanıcı bilgilerini al
    const { data: { user } } = await supabase.auth.getUser();

    // Admin kontrolü - admin@fa-platform.com ise /admin'e yönlendir
    if (user?.email === 'admin@fa-platform.com') {
      return NextResponse.redirect(`${origin}/admin`);
    }
  }

  // Normal kullanıcılar veya code yoksa ana sayfaya yönlendir
  return NextResponse.redirect(`${origin}/`);
}
