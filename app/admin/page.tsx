import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, BookOpen, Calendar, Brain } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const { count: pendingProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('onay_durumu', 'beklemede');

  const { count: totalProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalArticles } = await supabase
    .from('knowledge_base')
    .select('*', { count: 'exact', head: true });

  const { count: pendingAIData } = await supabase
    .from('ai_training_data')
    .select('*', { count: 'exact', head: true })
    .eq('onaylandi_mi', false);

  const stats = [
    {
      title: 'Bekleyen Profiller',
      value: pendingProfiles || 0,
      icon: Users,
      color: 'from-yellow-500 to-orange-500',
      link: '/admin/profiller',
    },
    {
      title: 'Toplam Profil',
      value: totalProfiles || 0,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      link: '/admin/profiller',
    },
    {
      title: 'Bilgi Bankası',
      value: totalArticles || 0,
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      link: '/admin/bilgi-bankasi',
    },
    {
      title: 'Bekleyen AI Verisi',
      value: pendingAIData || 0,
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      link: '/admin/ai-egitim',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yönetim Paneli</h1>
        <p className="text-gray-600">
          Platform istatistikleri ve hızlı erişim
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.link}>
              <Card className="hover:shadow-xl transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stat.title}</CardTitle>
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Hoş Geldiniz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Admin paneline hoş geldiniz. Buradan profilleri onaylayabilir,
              bilgi bankasını yönetebilir ve AI eğitim verilerini
              düzenleyebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
