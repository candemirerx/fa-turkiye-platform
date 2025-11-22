'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { FileText, Link as LinkIcon, Upload, Loader2 } from 'lucide-react';

interface ArticleEditorProps {
  onSuccess: () => void;
}

type ContentType = 'manuel' | 'link' | 'dosya';

export default function ArticleEditor({ onSuccess }: ArticleEditorProps) {
  const supabase = createClient();

  const [contentType, setContentType] = useState<ContentType>('manuel');
  const [baslik, setBaslik] = useState('');
  const [icerik, setIcerik] = useState('');
  const [kategori, setKategori] = useState('');
  const [kaynak_url, setKaynakUrl] = useState('');
  const [ozet, setOzet] = useState('');
  const [dosya, setDosya] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasyon
    if (!baslik.trim() || !kategori.trim()) {
      setError('Başlık ve kategori zorunludur');
      return;
    }

    if (contentType === 'manuel' && !icerik.trim()) {
      setError('İçerik zorunludur');
      return;
    }

    if (contentType === 'link' && !kaynak_url.trim()) {
      setError('Link URL zorunludur');
      return;
    }

    if (contentType === 'dosya' && !dosya) {
      setError('Dosya seçilmelidir');
      return;
    }

    setLoading(true);

    try {
      let finalIcerik = icerik;
      let dosyaAdi = null;

      // Dosya yükleme
      if (contentType === 'dosya' && dosya) {
        dosyaAdi = dosya.name;
        // Dosya içeriğini okuma (basit text okuma)
        const text = await dosya.text();
        finalIcerik = text;
      }

      const { error: insertError } = await supabase
        .from('knowledge_base')
        .insert({
          baslik: baslik.trim(),
          icerik: finalIcerik.trim(),
          kategori: kategori.trim(),
          icerik_tipi: contentType,
          kaynak_url: contentType === 'link' ? kaynak_url.trim() : null,
          dosya_adi: dosyaAdi,
          ozet: ozet.trim() || null,
        });

      if (insertError) throw insertError;

      // Form temizle
      setBaslik('');
      setIcerik('');
      setKategori('');
      setKaynakUrl('');
      setOzet('');
      setDosya(null);
      setContentType('manuel');

      onSuccess();
    } catch (err) {
      console.error('Insert error:', err);
      setError('Makale eklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* İçerik Tipi Seçimi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          İçerik Türü
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setContentType('manuel')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${contentType === 'manuel'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <FileText className="w-4 h-4" />
            Manuel
          </button>
          <button
            type="button"
            onClick={() => setContentType('link')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${contentType === 'link'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <LinkIcon className="w-4 h-4" />
            Link
          </button>
          <button
            type="button"
            onClick={() => setContentType('dosya')}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${contentType === 'dosya'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <Upload className="w-4 h-4" />
            Dosya
          </button>
        </div>
      </div>

      {/* Başlık */}
      <div>
        <label htmlFor="baslik" className="block text-sm font-medium text-gray-700 mb-1">
          Başlık *
        </label>
        <input
          type="text"
          id="baslik"
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Makale başlığı"
          required
        />
      </div>

      {/* Kategori */}
      <div>
        <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
          Kategori *
        </label>
        <select
          id="kategori"
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Kategori seçin</option>
          <option value="Genel Bilgi">Genel Bilgi</option>
          <option value="Tedavi">Tedavi</option>
          <option value="Yaşam Kalitesi">Yaşam Kalitesi</option>
          <option value="Beslenme">Beslenme</option>
          <option value="Egzersiz">Egzersiz</option>
          <option value="Araştırmalar">Araştırmalar</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>

      {/* Manuel İçerik */}
      {contentType === 'manuel' && (
        <div>
          <label htmlFor="icerik" className="block text-sm font-medium text-gray-700 mb-1">
            İçerik *
          </label>
          <textarea
            id="icerik"
            value={icerik}
            onChange={(e) => setIcerik(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={10}
            placeholder="Makale içeriği..."
            required
          />
        </div>
      )}

      {/* Link İçerik */}
      {contentType === 'link' && (
        <>
          <div>
            <label htmlFor="kaynak_url" className="block text-sm font-medium text-gray-700 mb-1">
              Kaynak URL *
            </label>
            <input
              type="url"
              id="kaynak_url"
              value={kaynak_url}
              onChange={(e) => setKaynakUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/makale"
              required
            />
          </div>
          <div>
            <label htmlFor="icerik-link" className="block text-sm font-medium text-gray-700 mb-1">
              İçerik (Opsiyonel)
            </label>
            <textarea
              id="icerik-link"
              value={icerik}
              onChange={(e) => setIcerik(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={5}
              placeholder="Link içeriği hakkında ek bilgi..."
            />
          </div>
          <div>
            <label htmlFor="ozet-link" className="block text-sm font-medium text-gray-700 mb-1">
              Özet
            </label>
            <textarea
              id="ozet-link"
              value={ozet}
              onChange={(e) => setOzet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Linkin kısa özeti..."
            />
          </div>
        </>
      )}

      {/* Dosya İçerik */}
      {contentType === 'dosya' && (
        <>
          <div>
            <label htmlFor="dosya" className="block text-sm font-medium text-gray-700 mb-1">
              Dosya *
            </label>
            <input
              type="file"
              id="dosya"
              onChange={(e) => setDosya(e.target.files?.[0] || null)}
              accept=".txt,.pdf,.doc,.docx,.md"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Desteklenen formatlar: TXT, PDF, Word, Markdown
            </p>
            {dosya && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  📎 <strong>{dosya.name}</strong> ({(dosya.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>
          <div>
            <label htmlFor="ozet-dosya" className="block text-sm font-medium text-gray-700 mb-1">
              Özet
            </label>
            <textarea
              id="ozet-dosya"
              value={ozet}
              onChange={(e) => setOzet(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Dosyanın kısa özeti..."
            />
          </div>
        </>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Ekleniyor...
          </>
        ) : (
          'Makale Ekle'
        )}
      </Button>
    </form>
  );
}
