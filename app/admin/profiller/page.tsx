import { createClient } from '@/lib/supabase/server';
import ProfileManagement from '@/components/admin/ProfileManagement';
import { Users } from 'lucide-react';

export default async function AdminProfillerPage() {
  const supabase = await createClient();

  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });

  const pendingCount = allProfiles?.filter(p => p.onay_durumu === 'beklemede').length || 0;
  const approvedCount = allProfiles?.filter(p => p.onay_durumu === 'onaylandı').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Profil Yönetimi</h1>
          <p className="text-slate-500 mt-1">Profilleri inceleyin ve yönetin</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-sm font-medium">
            {pendingCount} Bekliyor
          </div>
          <div className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-medium">
            {approvedCount} Onaylı
          </div>
        </div>
      </div>

      <ProfileManagement profiles={allProfiles || []} />
    </div>
  );
}
