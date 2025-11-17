'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Loader2, Plus } from 'lucide-react';
import { KnowledgeBase } from '@/types';

interface ArticleEditorProps {
  initialData?: KnowledgeBase;
  onSuccess?: () => void;
}

export default function ArticleEditor({
  initialData,
  onSuccess,
}: ArticleEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    baslik: initialData?.baslik || '',
    icerik: initialData?.icerik || '',
    kategori: initialData?.kategori || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.baslik.trim()) {
      newErrors.baslik = 'Başlık zorunludur';
    }

    if (!formData.icerik.trim()) {
      newErrors.icerik = 'İçerik zorunludur';
    }

    if (!formData.kategori.trim()) {
      newErrors.kategori = 'Kategori zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const articleData = {
        baslik: formData.baslik.trim(),
        icerik: formData.icerik.trim(),
        kategori: formData.kategori.trim(),
      };

      if (initialData) {
        // Update existing article
        const { error } = await supabase
          .from('knowledge_base')
          .update(articleData)
          .eq('id', initialData.id);

        if (error) throw error;
      } else {
        // Create new article
        const { error } = await supabase
          .from('knowledge_base')
          .insert([articleData]);

        if (error) throw error;
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        // Reset form
        setFormData({ baslik: '', icerik: '', kategori: '' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: 'Makale kaydedilirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Başlık"
        value={formData.baslik}
        onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
        error={errors.baslik}
        required
      />

      <Input
        label="Kategori"
        value={formData.kategori}
        onChange={(e) =>
          setFormData({ ...formData, kategori: e.target.value })
        }
        error={errors.kategori}
        placeholder="Örn: Tedavi, Belirtiler, Araştırmalar"
        required
      />

      <Textarea
        label="İçerik"
        value={formData.icerik}
        onChange={(e) => setFormData({ ...formData, icerik: e.target.value })}
        error={errors.icerik}
        rows={15}
        required
      />

      {errors.submit && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-800">{errors.submit}</p>
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              {initialData ? 'Güncelle' : 'Makale Ekle'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
