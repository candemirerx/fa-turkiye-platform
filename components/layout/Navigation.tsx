'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Home, BookOpen, Users, Calendar, MessageCircle } from 'lucide-react';

const navItems = [
  { label: 'Anasayfa', href: '/', icon: Home },
  { label: 'Bilgi Bankası', href: '/bilgi-bankasi', icon: BookOpen },
  { label: 'FA Network', href: '/network', icon: Users },
  { label: 'Etkinlikler', href: '/etkinlikler', icon: Calendar },
  { label: 'Gruplar (İletişim)', href: '/iletisim', icon: MessageCircle },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap',
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
        </div>
      </div>
    </nav>
  );
}
