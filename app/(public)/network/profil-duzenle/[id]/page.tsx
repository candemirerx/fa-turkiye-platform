import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ProfileForm from '@/components/network/ProfileForm';
import { Edit } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilDuzenlePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/giris?redirect=/network/profil-duzenle/' + id + '&message=profile');
  }

  // Get the profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile || error) {
    notFound();
  }

  // Check if user owns this profile
  if (profile.user_id !== user.id) {
    redirect('/network');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Edit className="w-4 h-4" />
            <span>Profili Düzenle</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Profilinizi Güncelleyin
          </h1>
          <p className="text-xl text-gray-600">
            Profil bilgilerinizi düzenleyin
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <ProfileForm initialData={profile} userId={user.id} />
        </div>

        {/* Status Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Profil Durumu:{' '}
            <span
              className={`font-semibold ${
                profile.onay_durumu === 'onaylandı'
                  ? 'text-green-600'
                  : profile.onay_durumu === 'beklemede'
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {profile.onay_durumu === 'onaylandı'
                ? 'Onaylandı'
                : profile.onay_durumu === 'beklemede'
                ? 'İnceleniyor'
                : 'Reddedildi'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
