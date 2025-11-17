import { createClient } from '@/lib/supabase/server';
import AIDataApproval from '@/components/admin/AIDataApproval';

export default async function AdminAIEgitimPage() {
  const supabase = await createClient();

  const { data: pendingData } = await supabase
    .from('ai_training_data')
    .select('*')
    .eq('onaylandi_mi', false)
    .order('created_at', { ascending: false });

  const { data: approvedData } = await supabase
    .from('ai_training_data')
    .select('*')
    .eq('onaylandi_mi', true)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Eğitim Verisi Yönetimi
        </h1>
        <p className="text-gray-600">
          Kullanıcıların önerdiği AI eğitim verilerini inceleyin ve onaylayın
        </p>
      </div>

      {/* Pending Data */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Bekleyen Veriler ({pendingData?.length || 0})
        </h2>
        <AIDataApproval data={pendingData || []} />
      </div>

      {/* Approved Data */}
      {approvedData && approvedData.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Onaylanmış Veriler ({approvedData.length})
          </h2>
          <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
            <p className="text-green-800">
              <strong>{approvedData.length}</strong> adet onaylanmış veri AI
              asistanın bilgi tabanında kullanılıyor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
