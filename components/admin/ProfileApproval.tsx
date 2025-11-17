'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Check, X, User, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface ProfileApprovalProps {
  profiles: Profile[];
}

export default function ProfileApproval({ profiles }: ProfileApprovalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  const handleApprove = async (profileId: string) => {
    setLoading(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onay_durumu: 'onaylandı' })
        .eq('id', profileId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Approve error:', error);
      alert('Onaylama sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (profileId: string) => {
    if (!confirm('Bu profili reddetmek istediğinizden emin misiniz?')) {
      return;
    }

    setLoading(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onay_durumu: 'reddedildi' })
        .eq('id', profileId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Reject error:', error);
      alert('Reddetme sırasında hata oluştu');
    } finally {
      setLoading(null);
    }
  };

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Bekleyen Profil Yok
        </h2>
        <p className="text-gray-600">
          Tüm profiller incelenmiş durumda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {profiles.map((profile) => (
        <Card key={profile.id}>
          <CardHeader>
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 relative flex-shrink-0">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.ad_soyad}
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <CardTitle className="mb-2">{profile.ad_soyad}</CardTitle>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.sehir}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Oluşturulma: {new Date(profile.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(profile.id)}
                  disabled={loading === profile.id}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading === profile.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Onayla
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleReject(profile.id)}
                  disabled={loading === profile.id}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  {loading === profile.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-1" />
                      Reddet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Details */}
          {(profile.hikayem_text || profile.yetkinlikler_cv) && (
            <CardContent className="space-y-4">
              {profile.hikayem_text && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Hikaye:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {profile.hikayem_text}
                  </p>
                </div>
              )}
              {profile.yetkinlikler_cv && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Yetkinlikler:
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {profile.yetkinlikler_cv}
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
