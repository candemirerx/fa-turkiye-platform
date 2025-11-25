'use client';

import { useState } from 'react';
import { X, FileText, Link as LinkIcon, Upload, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SuggestionType = 'manuel' | 'belge' | 'link';

export default function SuggestionModal({ isOpen, onClose }: SuggestionModalProps) {
  const [type, setType] = useState<SuggestionType>('manuel');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    baslik: '',
    icerik: '',
    link: '',
    aciklama: '',
    gonderen_email: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'dan küçük olmalıdır');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let fileUrl = null;

      // Dosya yükleme - profiles bucket'ını kullan (mevcut bucket)
      if (type === 'belge' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `suggestion-${Date.now()}.${fileExt}`;
        const filePath = `suggestions/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profiles')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profiles')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      }

      // Öneriyi kaydet
      const { error: insertError } = await supabase
        .from('knowledge_suggestions')
        .insert([{
          tip: type,
          baslik: formData.baslik,
          icerik: type === 'manuel' ? formData.icerik : null,
          link: type === 'link' ? formData.link : null,
          dosya_url: fileUrl,
          aciklama: formData.aciklama,
          gonderen_email: formData.gonderen_email || null,
          durum: 'beklemede',
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setFormData({ baslik: '', icerik: '', link: '', aciklama: '', gonderen_email: '' });
        setFile(null);
        setType('manuel');
      }, 2000);
    } catch (err) {
      console.error('Öneri gönderme hatası:', err);
      setError('Öneri gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Öneride Bulun</h3>
            <p className="text-white/90 text-sm">Bilgi bankasına katkıda bulunun</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-white rounded-xl hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5 text-green-600" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">Teşekkürler!</h4>
            <p className="text-gray-600">Öneriniz başarıyla gönderildi. Admin ekibimiz inceleyecektir.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Öneri Tipi Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Öneri Tipi</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setType('manuel')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    type === 'manuel' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className={`w-5 h-5 ${type === 'manuel' ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${type === 'manuel' ? 'text-green-700' : 'text-gray-700'}`}>Manuel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('belge')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    type === 'belge' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Upload className={`w-5 h-5 ${type === 'belge' ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${type === 'belge' ? 'text-green-700' : 'text-gray-700'}`}>Belge</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('link')}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    type === 'link' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <LinkIcon className={`w-5 h-5 ${type === 'link' ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className={`text-sm font-medium ${type === 'link' ? 'text-green-700' : 'text-gray-700'}`}>Link</span>
                </button>
              </div>
            </div>

            {/* Başlık */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Başlık *</label>
              <input
                type="text"
                value={formData.baslik}
                onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Önerinizin başlığı"
                required
              />
            </div>

            {/* Manuel İçerik */}
            {type === 'manuel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik *</label>
                <textarea
                  value={formData.icerik}
                  onChange={(e) => setFormData({ ...formData, icerik: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Eklemek istediğiniz bilgiyi yazın..."
                  rows={5}
                  required
                />
              </div>
            )}

            {/* Belge Yükleme */}
            {type === 'belge' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Belge Yükle *</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  {file ? (
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm text-gray-500">PDF, DOC, DOCX veya TXT</span>
                    </div>
                  )}
                </label>
              </div>
            )}

            {/* Link */}
            {type === 'link' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link *</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://..."
                  required
                />
              </div>
            )}

            {/* Açıklama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama (Opsiyonel)</label>
              <textarea
                value={formData.aciklama}
                onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Bu öneri hakkında ek bilgi..."
                rows={2}
              />
            </div>

            {/* E-posta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-posta (Opsiyonel)</label>
              <input
                type="email"
                value={formData.gonderen_email}
                onChange={(e) => setFormData({ ...formData, gonderen_email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Geri bildirim için e-posta adresiniz"
              />
            </div>

            {/* Hata Mesajı */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Gönder Butonu */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                'Öneriyi Gönder'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
