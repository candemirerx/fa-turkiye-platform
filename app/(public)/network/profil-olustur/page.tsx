import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileForm from '@/components/network/ProfileForm';
import { UserPlus } from 'lucide-react';

interface Props {
  searchParams: Promise<{ new?: string }>;
}

export default async function ProfilOlusturPage({ searchParams }: Props) {
  const params = await searchParams;
  const isNewProfile = params.new === 'true';
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/giris');
  }

  // Check if user already has a profile (only if not creating new)
  let existingProfile = null;
  if (!isNewProfile) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    existingProfile = data;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <UserPlus className="w-4 h-4" />
            <span>
              {existingProfile ? 'Profili Düzenle' : 'Yeni Profil'}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {existingProfile ? 'Profilinizi Düzenleyin' : 'Profil Oluşturun'}
          </h1>
          <p className="text-xl text-gray-600">
            {existingProfile
              ? 'Profil bilgilerinizi güncelleyin'
              : 'Hikayenizi toplulukla paylaşın'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <ProfileForm initialData={existingProfile} userId={user.id} />
        </div>

        {/* Status Message */}
        {existingProfile && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Profil Durumu:{' '}
              <span
                className={`font-semibold ${
                  existingProfile.onay_durumu === 'onaylandı'
                    ? 'text-green-600'
                    : existingProfile.onay_durumu === 'beklemede'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {existingProfile.onay_durumu === 'onaylandı'
                  ? 'Onaylandı'
                  : existingProfile.onay_durumu === 'beklemede'
                  ? 'İnceleniyor'
                  : 'Reddedildi'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
