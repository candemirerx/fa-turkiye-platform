import { createClient } from '@/lib/supabase/server';
import ProfileApproval from '@/components/admin/ProfileApproval';

export default async function AdminProfillerPage() {
  const supabase = await createClient();

  const { data: pendingProfiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('onay_durumu', 'beklemede')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Profil Yönetimi
        </h1>
        <p className="text-gray-600">
          Bekleyen profilleri inceleyin ve onaylayın
        </p>
      </div>

      <ProfileApproval profiles={pendingProfiles || []} />
    </div>
  );
}
