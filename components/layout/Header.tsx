'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">FA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                FA Türkiye
              </h1>
              <p className="text-xs text-gray-600">
                Yalnız Değilsiniz
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {loading ? (
              <div className="w-24 h-11 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                <LogIn className="w-5 h-5" />
                <span>Giriş Yap</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
