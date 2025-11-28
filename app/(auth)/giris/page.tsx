'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Mail, UserPlus, AlertCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function GirisContent() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const messageType = searchParams.get('message');
  
  const [activeTab, setActiveTab] = useState<'google' | 'email'>('email');
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Mesaj tipine göre uyarı mesajı
  const getInfoMessage = () => {
    if (messageType === 'profile') {
      return 'Profil eklemek için giriş yapın';
    }
    return null;
  };

  const infoMessage = getInfoMessage();

  useEffect(() => {
    if (user) {
      router.push(redirectUrl || '/');
    }
  }, [user, router, redirectUrl]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        // Kayıt işlemi
        if (!email.trim()) {
          setError('Email adresi gereklidir');
          setSubmitting(false);
          return;
        }

        const result = await signUpWithEmail(email, password);

        if (result?.user && !result.user.email_confirmed_at) {
          setError('Kayıt başarılı! Lütfen email adresinizi kontrol edin ve doğrulama linkine tıklayın.');
        } else if (result?.user) {
          setError('Kayıt başarılı! Giriş yapılıyor...');
          await signInWithEmail(email, password);
        }
      } else {
        // Giriş işlemi
        if (!email.trim()) {
          setError('Email adresi gereklidir');
          setSubmitting(false);
          return;
        }
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      let errorMessage = 'Bir hata oluştu';

      if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email veya şifre hatalı';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Lütfen email adresinizi doğrulayın';
      } else if (err.message?.includes('User already registered')) {
        errorMessage = 'Bu email adresi zaten kayıtlı. Giriş yapmayı deneyin.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
          </h1>
          <p className="text-gray-600">
            Friedrich Ataksi Türkiye Platformu
          </p>
        </div>

        {/* Info Message */}
        {infoMessage && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800 text-sm font-medium">{infoMessage}</p>
          </div>
        )}

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'email'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Mail className="w-5 h-5 inline-block mr-2" />
            Email
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'google'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <svg className="w-5 h-5 inline-block mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
            </svg>
            Google
          </button>
        </div>

        {/* Email Sign In/Up */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
            />
            <Input
              type="password"
              label="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? "Şifrenizi belirleyin (min. 6 karakter)" : "Şifrenizi girin"}
              required
            />

            {error && (
              <div className={`p-3 rounded-lg text-sm ${error.includes('başarılı')
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
                }`}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'İşleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="w-full text-sm text-blue-600 hover:underline"
            >
              {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
            </button>
          </form>
        )}

        {/* Google Sign In */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-lg">Google ile {isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}</span>
            </button>

            <p className="text-sm text-gray-500 text-center">
              Google hesabınızla hızlıca {isSignUp ? 'kayıt olun' : 'giriş yapın'}
            </p>
          </div>
        )}

        <p className="text-sm text-gray-500 text-center mt-6">
          Giriş yaparak{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Kullanım Koşulları
          </a>
          &apos;nı kabul etmiş olursunuz.
        </p>
      </div>
    </main>
  );
}

export default function GirisPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    }>
      <GirisContent />
    </Suspense>
  );
}
