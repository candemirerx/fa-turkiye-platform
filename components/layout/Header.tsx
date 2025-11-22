'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, Menu, X, Home, BookOpen, Users, Calendar, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { label: 'Anasayfa', href: '/', icon: Home },
  { label: 'Bilgi Bankası', href: '/bilgi-bankasi', icon: BookOpen },
  { label: 'FA Network', href: '/network', icon: Users },
  { label: 'Etkinlikler', href: '/etkinlikler', icon: Calendar },
  { label: 'Gruplar (İletişim)', href: '/iletisim', icon: MessageCircle },
];

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">FA</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                FA Türkiye
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                    'focus:outline-none focus:ring-4 focus:ring-blue-500',
                    'min-h-[44px]',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <div className="w-24 h-11 bg-gray-100 animate-pulse rounded-lg" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 hidden lg:block">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px]"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px]"
              >
                <LogIn className="w-5 h-5" />
                <span>Giriş Yap</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-12 h-12 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
            aria-label="Menü"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* Mobile Navigation Links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-6 py-4 rounded-lg font-medium transition-all w-full',
                    'focus:outline-none focus:ring-4 focus:ring-blue-500',
                    'min-h-[56px]', // Daha büyük tıklama alanı mobilde
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-lg">{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gray-200">
              {loading ? (
                <div className="w-full h-14 bg-gray-100 animate-pulse rounded-lg" />
              ) : user ? (
                <div className="space-y-2">
                  <div className="px-6 py-2 text-sm text-gray-600">
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-6 py-4 w-full text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[56px]"
                  >
                    <LogOut className="w-6 h-6" />
                    <span className="text-lg">Çıkış Yap</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-4 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[56px]"
                >
                  <LogIn className="w-6 h-6" />
                  <span className="text-lg">Giriş Yap</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
