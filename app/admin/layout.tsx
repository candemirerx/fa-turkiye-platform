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
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6" />
              <h1 className="text-xl font-bold">Admin Paneli</h1>
            </div>
            <form action="/api/admin/auth" method="DELETE">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-700"
              >
                <LogOut className="w-5 h-5" />
                <span>Çıkış</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/admin/profiller"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <Users className="w-5 h-5" />
              <span>Profiller</span>
            </Link>
            <Link
              href="/admin/bilgi-bankasi"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <BookOpen className="w-5 h-5" />
              <span>Bilgi Bankası</span>
            </Link>
            <Link
              href="/admin/ai-egitim"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
            >
              <Brain className="w-5 h-5" />
              <span>AI Eğitim</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
