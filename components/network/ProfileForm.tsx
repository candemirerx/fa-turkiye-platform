'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Upload, Loader2, Pencil, Check, X, AlertTriangle } from 'lucide-react';
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
  
  // Yazım düzeltme state'leri
  const [correcting, setCorrecting] = useState(false);
  const [correctedText, setCorrectedText] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string>('');

  // Kaydedilmemiş değişiklik kontrolü
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  // İlk veriyi memoize et
  const initialFormData = useMemo(() => ({
    ad_soyad: initialData?.ad_soyad || '',
    yas: initialData?.yas || '',
    yakinlik_derecesi: initialData?.yakinlik_derecesi || '',
    sehir: initialData?.sehir || '',
    hikayem_text: initialData?.hikayem_text || '',
    yetkinlikler_cv: initialData?.yetkinlikler_cv || '',
    avatar_url: initialData?.avatar_url || '',
  }), [initialData]);

  // Form değişikliği kontrolü
  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  // Form değiştiğinde isSaved'i güncelle
  useEffect(() => {
    setIsSaved(!hasChanges());
  }, [formData, hasChanges]);

  // Sayfa kapatma/yenileme uyarısı
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSaved) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaved]);

  // Geri gitme işlemi
  const handleBack = () => {
    if (!isSaved) {
      setPendingNavigation(() => () => router.back());
      setShowUnsavedModal(true);
    } else {
      router.back();
    }
  };

  // Modal'dan kaydetmeden çık
  const handleDiscardChanges = () => {
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };

  // Modal'dan kaydet ve çık
  const handleSaveAndExit = async () => {
    setShowUnsavedModal(false);
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 50 * 1024 * 1024) {
      setErrors({ ...errors, avatar: 'Dosya boyutu 50MB\'dan küçük olmalıdır' });
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

  // Yazım düzeltme fonksiyonu
  const handleCorrectText = async () => {
    if (!formData.hikayem_text.trim()) return;
    
    setCorrecting(true);
    setOriginalText(formData.hikayem_text);
    
    try {
      const response = await fetch('/api/correct-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: formData.hikayem_text }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.correctedText) {
        setCorrectedText(data.correctedText);
        setFormData({ ...formData, hikayem_text: data.correctedText });
      }
    } catch (error) {
      console.error('Düzeltme hatası:', error);
    } finally {
      setCorrecting(false);
    }
  };

  const handleAcceptCorrection = () => {
    setCorrectedText(null);
    setOriginalText('');
  };

  const handleRejectCorrection = () => {
    setFormData({ ...formData, hikayem_text: originalText });
    setCorrectedText(null);
    setOriginalText('');
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

      // Başarı mesajını göster ve kaydedildi olarak işaretle
      setSuccess(true);
      setIsSaved(true);

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
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            FA Hikayem
          </label>
          
          {/* Yazım Düzeltme Butonları */}
          <div className="flex items-center gap-2">
            {correctedText !== null ? (
              <>
                <button
                  type="button"
                  onClick={handleAcceptCorrection}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                  title="Düzeltmeyi Onayla"
                >
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">Onayla</span>
                </button>
                <button
                  type="button"
                  onClick={handleRejectCorrection}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  title="Düzeltmeyi İptal Et"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">İptal</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleCorrectText}
                disabled={correcting || !formData.hikayem_text.trim()}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Yazım-Noktalama Düzeltme"
              >
                {correcting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Pencil className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Yazım-Noktalama Düzeltme</span>
              </button>
            )}
          </div>
        </div>
        
        <Textarea
          value={formData.hikayem_text}
          onChange={(e) => {
            setFormData({ ...formData, hikayem_text: e.target.value });
            // Kullanıcı manuel değişiklik yaparsa düzeltme modundan çık
            if (correctedText !== null) {
              setCorrectedText(null);
              setOriginalText('');
            }
          }}
          placeholder="FA ile ilgili hikayenizi paylaşın..."
          rows={8}
          className={correctedText !== null ? 'border-purple-300 bg-purple-50' : ''}
        />
        
        {correctedText !== null && (
          <p className="mt-2 text-sm text-purple-600">
            ✨ Metin düzeltildi. Değişiklikleri onaylayın veya iptal edin.
          </p>
        )}
      </div>

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
          onClick={handleBack}
          disabled={loading}
        >
          İptal
        </Button>
      </div>

      {/* Kaydedilmemiş Değişiklik Modalı */}
      <Modal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
        title="Kaydedilmemiş Değişiklikler"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-700">
                Kaydedilmemiş değişiklikleriniz var. Çıkmadan önce kaydetmek ister misiniz?
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleSaveAndExit}
              className="flex-1"
            >
              Kaydet
            </Button>
            <Button
              variant="outline"
              onClick={handleDiscardChanges}
              className="flex-1"
            >
              Kaydetme
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowUnsavedModal(false)}
            >
              İptal
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  );
}
