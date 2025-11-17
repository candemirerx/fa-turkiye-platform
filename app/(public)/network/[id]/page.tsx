import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, User, Briefcase, Heart } from 'lucide-react';

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Profili çek (sadece onaylanmış)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .eq('onay_durumu', 'onaylandı')
    .single();

  if (error || !profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/network"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-lg px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>FA Network'e Dön</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32" />

          {/* Profile Info */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.ad_soyad}
                    fill
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Name and Location */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {profile.ad_soyad}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{profile.sehir}</span>
              </div>
            </div>

            {/* Story Section */}
            {profile.hikayem_text && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-red-500" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Hikayem
                  </h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {profile.hikayem_text}
                  </p>
                </div>
              </div>
            )}

            {/* Skills/CV Section */}
            {profile.yetkinlikler_cv && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Yetkinlikler & Deneyim
                  </h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {profile.yetkinlikler_cv}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!profile.hikayem_text && !profile.yetkinlikler_cv && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Bu profil henüz detay bilgisi eklenmemiş.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Support Message */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-6">
          <p className="text-blue-800">
            <strong>Topluluk Desteği:</strong> Her hikaye değerlidir ve
            birbirimizden öğrenerek güçleniriz. Kendi hikayenizi paylaşmak
            isterseniz, profil oluşturabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
