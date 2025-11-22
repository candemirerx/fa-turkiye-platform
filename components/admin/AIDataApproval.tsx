'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AITrainingData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Check, Trash2, Brain, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AIDataApprovalProps {
  data: AITrainingData[];
  onApproved?: (id: string) => void;
  onRejected?: (id: string) => void;
}

export default function AIDataApproval({ data, onApproved, onRejected }: AIDataApprovalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoading(id);
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .update({ onaylandi_mi: true })
        .eq('id', id);

      if (error) throw error;

      onApproved?.(id);
      router.refresh();
    } catch (error) {
      console.error('Approve error:', error);
      alert('Onaylama sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu veriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(id);
    try {
      const { error } = await supabase
        .from('ai_training_data')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onRejected?.(id);
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Bekleyen Veri Yok
        </h2>
        <p className="text-gray-600">
          Tüm AI eğitim verileri incelenmiş durumda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <CardTitle className="flex-1">Soru &amp; Cevap</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => handleApprove(item.id)}
                  disabled={loading === item.id}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                >
                  {loading === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Onayla
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleDelete(item.id)}
                  disabled={loading === item.id}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50 flex-1 sm:flex-none"
                >
                  {loading === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Sil
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Soru:</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {item.soru}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Cevap:</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {item.cevap}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Oluşturulma: {new Date(item.created_at).toLocaleDateString('tr-TR')}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
