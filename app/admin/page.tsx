import { createClient } from '@/lib/supabase/server';
import {
  Users,
  BookOpen,
  Brain,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Get stats
  const { count: pendingProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('onay_durumu', 'beklemede');

  const { count: approvedProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('onay_durumu', 'onaylandı');

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

  // Recent profiles
  const { data: recentProfiles } = await supabase
    .from('profiles')
    .select('id, ad_soyad, sehir, onay_durumu, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform istatistikleri ve özet</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Pending Profiles */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              Bekliyor
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-slate-900">{pendingProfiles || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Bekleyen Profil</p>
        </div>

        {/* Approved Profiles */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              Aktif
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-slate-900">{approvedProfiles || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Onaylı Profil</p>
        </div>

        {/* Knowledge Base */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              İçerik
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-slate-900">{totalArticles || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Bilgi Bankası</p>
        </div>

        {/* AI Training */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              AI
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-slate-900">{pendingAIData || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Bekleyen AI Verisi</p>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Hızlı İşlemler</h2>
          </div>
          <div className="p-4 lg:p-6 space-y-3">
            <Link
              href="/admin/profiller"
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Profilleri İncele</p>
                  <p className="text-sm text-slate-500">{pendingProfiles || 0} bekleyen onay</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/bilgi-bankasi"
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Bilgi Bankası</p>
                  <p className="text-sm text-slate-500">İçerik yönetimi</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/ai-egitim"
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">AI Eğitim</p>
                  <p className="text-sm text-slate-500">Chatbot verilerini yönet</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>

        {/* Recent Profiles */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 lg:p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Son Profiller</h2>
            <Link
              href="/admin/profiller"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProfiles && recentProfiles.length > 0 ? (
              recentProfiles.map((profile) => (
                <div key={profile.id} className="p-4 lg:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {profile.ad_soyad.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{profile.ad_soyad}</p>
                      <p className="text-sm text-slate-500">{profile.sehir}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      profile.onay_durumu === 'onaylandı'
                        ? 'bg-emerald-100 text-emerald-700'
                        : profile.onay_durumu === 'beklemede'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {profile.onay_durumu === 'onaylandı'
                      ? 'Onaylı'
                      : profile.onay_durumu === 'beklemede'
                      ? 'Bekliyor'
                      : 'Reddedildi'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                Henüz profil bulunmuyor
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
