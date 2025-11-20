import { createClient } from '@/lib/supabase/server';
import ProfileManagement from '@/components/admin/ProfileManagement';

export default async function AdminProfillerPage() {
  const supabase = await createClient();

  // Tüm profilleri çek
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profil Yönetimi
        </h1>
        <p className="text-gray-600">
          Profilleri inceleyin, düzenleyin ve yönetin
        </p>
      </div>

      <ProfileManagement profiles={allProfiles || []} />
    </div>
  );
}
