'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Upload, Loader2 } from 'lucide-react';
import { Profile } from '@/types';

interface ProfileFormProps {
  initialData?: Profile;
  userId: string;
}

export default function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    ad_soyad: initialData?.ad_soyad || '',
    yas: initialData?.yas || '',
    yakinlik_derecesi: initialData?.yakinlik_derecesi || '',
    sehir: initialData?.sehir || '',
    hikayem_text: initialData?.hikayem_text || '',
    yetkinlikler_cv: initialData?.yetkinlikler_cv || '',
    avatar_url: initialData?.avatar_url || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, avatar: 'Dosya boyutu 5MB\'dan küçük olmalıdır' });
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors({ ...errors, avatar: 'Sadece resim dosyaları yüklenebilir' });
      return;
    }

    setUploading(true);
    setErrors({ ...errors, avatar: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ ...errors, avatar: 'Dosya yüklenirken hata oluştu' });
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ad_soyad.trim()) {
      newErrors.ad_soyad = 'Ad Soyad zorunludur';
    }

    if (!formData.sehir.trim()) {
      newErrors.sehir = 'Şehir zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const profileData = {
        user_id: userId,
        ad_soyad: formData.ad_soyad.trim(),
        yas: formData.yas ? parseInt(formData.yas.toString()) : null,
        yakinlik_derecesi: formData.yakinlik_derecesi.trim() || null,
        sehir: formData.sehir.trim(),
        hikayem_text: formData.hikayem_text.trim() || null,
        yetkinlikler_cv: formData.yetkinlikler_cv.trim() || null,
        avatar_url: formData.avatar_url || null,
        onay_durumu: 'beklemede' as const,
      };

      if (initialData) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (error) throw error;
      }

      // Başarı mesajını göster
      setSuccess(true);

      // 5 saniye sonra mesajı gizle
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: 'Profil kaydedilirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profil Fotoğrafı
        </label>
        <div className="flex items-center gap-4">
          {formData.avatar_url && (
            <img
              src={formData.avatar_url}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          )}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}</span>
            </div>
          </label>
        </div>
        {errors.avatar && (
          <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
        )}
      </div>

      {/* Ad Soyad */}
      <Input
        label="Ad Soyad"
        value={formData.ad_soyad}
        onChange={(e) => setFormData({ ...formData, ad_soyad: e.target.value })}
        error={errors.ad_soyad}
        required
      />

      {/* Yaş */}
      <Input
        label="Yaş"
        type="number"
        value={formData.yas}
        onChange={(e) => setFormData({ ...formData, yas: e.target.value })}
        placeholder="Örn: 35"
        min="0"
        max="120"
      />

      {/* Yakınlık Derecesi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yakınlık Derecesi
        </label>
        <Input
          value={formData.yakinlik_derecesi}
          onChange={(e) => setFormData({ ...formData, yakinlik_derecesi: e.target.value })}
          placeholder="Örn: Friedrich Ataksi, Ebeveyn, Eşi..."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, yakinlik_derecesi: 'Friedrich Ataksi' })}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Friedrich Ataksi
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, yakinlik_derecesi: 'Ebeveyn' })}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Ebeveyn
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, yakinlik_derecesi: 'Eşi' })}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Eşi
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, yakinlik_derecesi: 'Sağlık danışmanı' })}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Sağlık danışmanı
          </button>
        </div>
      </div>

      {/* Şehir */}
      <Input
        label="Şehir"
        value={formData.sehir}
        onChange={(e) => setFormData({ ...formData, sehir: e.target.value })}
        error={errors.sehir}
        required
      />

      {/* Hikayem */}
      <Textarea
        label="FA Hikayem"
        value={formData.hikayem_text}
        onChange={(e) =>
          setFormData({ ...formData, hikayem_text: e.target.value })
        }
        placeholder="FA ile ilgili hikayenizi paylaşın..."
        rows={8}
      />

      {/* Yetkinlikler */}
      <Textarea
        label="Yetkinlikler & Deneyim"
        value={formData.yetkinlikler_cv}
        onChange={(e) =>
          setFormData({ ...formData, yetkinlikler_cv: e.target.value })
        }
        placeholder="Mesleki deneyimleriniz, yetkinlikleriniz..."
        rows={4}
      />

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <p className="text-sm text-green-800 font-medium">
            ✓ Profil durumu gönderildi
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Kaydediliyor...
            </>
          ) : (
            'Profili Kaydet'
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
