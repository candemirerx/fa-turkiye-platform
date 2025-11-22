import { createClient } from '@/lib/supabase/server';
import AIDataApproval from '@/components/admin/AIDataApproval';
import SystemPromptEditor from '@/components/admin/SystemPromptEditor';
import { Card, CardContent } from '@/components/ui/Card';
import { Brain, FileText, Settings } from 'lucide-react';

export default async function AdminAIEgitimPage() {
  const supabase = await createClient();

  // Bekleyen eğitim verilerini getir
  const { data: pendingData } = await supabase
    .from('ai_training_data')
    .select('*')
    .eq('onaylandi_mi', false)
    .order('created_at', { ascending: false });

  // Onaylanmış eğitim verilerini getir
  const { data: approvedData } = await supabase
    .from('ai_training_data')
    .select('*')
    .eq('onaylandi_mi', true)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      {/* Başlık */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          AI Eğitim Yönetimi
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Yapay zeka sistem talimatlarını düzenleyin ve eğitim verilerini yönetin
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Sistem Talimatı</p>
                <p className="text-2xl font-bold mt-1">Aktif</p>
              </div>
              <Settings className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Bekleyen Veri</p>
                <p className="text-2xl font-bold mt-1">{pendingData?.length || 0}</p>
              </div>
              <Brain className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Onaylı Veri</p>
                <p className="text-2xl font-bold mt-1">{approvedData?.length || 0}</p>
              </div>
              <FileText className="w-10 h-10 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sistem Talimatı Düzenleyici */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-600" />
          Sistem Talimatı
        </h2>
        <SystemPromptEditor />
      </div>

      {/* Bekleyen Eğitim Verileri */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Brain className="w-6 h-6 text-yellow-600" />
          Bekleyen Eğitim Verileri ({pendingData?.length || 0})
        </h2>
        <AIDataApproval data={pendingData || []} />
      </div>

      {/* Onaylanmış Veriler */}
      {approvedData && approvedData.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            Onaylanmış Eğitim Verileri ({approvedData.length})
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
