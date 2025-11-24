'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
    const { user, loading, signInWithEmail } = useAuth();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            // Admin kontrolü
            if (user.email === 'admin@fa-platform.com') {
                router.push('/admin');
            } else {
                // Admin değilse ana sayfaya yönlendir
                router.push('/');
            }
        }
    }, [user, router]);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // Gizli admin şifresi kontrolü
            if (password === '220309') {
                await signInWithEmail('admin@fa-platform.com', '220309');
                // useEffect otomatik olarak /admin'e yönlendirecek
            } else {
                setError('Geçersiz admin şifresi');
            }
        } catch (err: any) {
            setError(err.message || 'Giriş başarısız');
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
        <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Admin Girişi
                    </h1>
                    <p className="text-purple-200">
                        Yönetim paneline erişim
                    </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-purple-200 mb-2">
                            Admin Şifresi
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••"
                            required
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg text-sm bg-red-500/20 text-red-200 border border-red-500/50">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition-all"
                    >
                        {submitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-purple-300 hover:text-white transition-colors"
                    >
                        ← Ana Sayfaya Dön
                    </a>
                </div>
            </div>
        </main>
    );
}
