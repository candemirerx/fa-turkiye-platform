import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLogin from '@/components/admin/AdminLogin';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, Brain, LogOut } from 'lucide-react';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = await checkAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />
              <h1 className="text-lg sm:text-xl font-bold">Admin Paneli</h1>
            </div>
            <form action="/api/admin/auth" method="DELETE">
              <button
                type="submit"
                className="flex items-center gap-2 px-3 py-2 sm:px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-700"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 sm:gap-2 py-3 sm:py-4 min-w-max sm:min-w-0">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 whitespace-nowrap"
            >
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/profiller"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 whitespace-nowrap"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Profiller</span>
            </Link>
            <Link
              href="/admin/bilgi-bankasi"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Bilgi Bankası</span>
              <span className="sm:hidden">Bilgi</span>
            </Link>
            <Link
              href="/admin/ai-egitim"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 whitespace-nowrap"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">AI Eğitim</span>
              <span className="sm:hidden">AI</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
