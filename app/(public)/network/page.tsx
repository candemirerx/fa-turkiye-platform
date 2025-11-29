'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types';
import ProfileCard from '@/components/network/ProfileCard';
import { Users, Plus, Search, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function NetworkPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userProfiles, setUserProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const supabase = createClient();

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserProfiles();
    } else {
      setUserProfiles([]);
    }
  }, [user]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('onay_durumu', 'onaylandı');

    if (data) {
      // Client-side'da sıralama yap
      const sortedData = data.sort((a, b) => {
        // Önce display_order'a göre sırala (null değerler sona)
        const orderA = a.display_order ?? 999999;
        const orderB = b.display_order ?? 999999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        // Aynı display_order için created_at'e göre sırala
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      setProfiles(sortedData);
    }
    setLoading(false);
  };

  const fetchUserProfiles = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (data) {
      setUserProfiles(data);
    }
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.ad_soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.sehir.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            <span>FA Network</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Topluluk Üyeleri
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            FA hastaları ve yakınlarının hikayelerini keşfedin, deneyimlerinden
            öğrenin
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="İsim veya şehir ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-500 min-h-[44px]"
              />
            </div>

            {/* Profile Buttons */}
            {user && userProfiles.length > 0 ? (
              <div className="flex gap-2">
                <Link
                  href={`/network/profil-duzenle/${userProfiles[0].id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px] whitespace-nowrap"
                >
                  <Edit className="w-5 h-5" />
                  <span>Profili Güncelle</span>
                </Link>
                <Link
                  href="/network/profil-olustur?new=true"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px] whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  <span>Yeni Profil</span>
                </Link>
              </div>
            ) : (
              <Link
                href={user ? "/network/profil-olustur" : "/giris?redirect=/network/profil-olustur&message=profile"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px] whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                <span>Profil Oluştur</span>
              </Link>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Sonuç Bulunamadı' : 'Henüz Profil Yok'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Arama kriterlerinize uygun profil bulunamadı.'
                : 'İlk profili siz oluşturun!'}
            </p>
            {!searchTerm && (
              <Link
                href={user ? "/network/profil-olustur" : "/giris?redirect=/network/profil-olustur&message=profile"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500"
              >
                <Plus className="w-5 h-5" />
                <span>İlk Profili Oluştur</span>
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 text-gray-600">
              <span className="font-medium">{filteredProfiles.length}</span>{' '}
              profil bulundu
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((profile) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
