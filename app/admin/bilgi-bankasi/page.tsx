'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { KnowledgeBase } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ArticleEditor from '@/components/admin/ArticleEditor';
import Button from '@/components/ui/Button';
import { Trash2, Eye, BookOpen, Link as LinkIcon, FileText, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';

interface KnowledgeSuggestion {
  id: string;
  oneri: string;
  durum: 'beklemede' | 'onaylandi' | 'reddedildi';
  created_at: string;
}

export default function AdminBilgiBankasiPage() {
  const supabase = createClient();
  const [articles, setArticles] = useState<KnowledgeBase[]>([]);
  const [suggestions, setSuggestions] = useState<KnowledgeSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'suggestions'>('articles');

  useEffect(() => {
    fetchArticles();
    fetchSuggestions();
  }, []);

  const fetchArticles = async () => {
    const { data } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setArticles(data);
    }
    setLoading(false);
  };

  const fetchSuggestions = async () => {
    const { data } = await supabase
      .from('knowledge_suggestions')
      .select('*')
      .eq('durum', 'beklemede')
      .order('created_at', { ascending: false });

    if (data) {
      setSuggestions(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu makaleyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleting(id);
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setArticles(articles.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silme sırasında hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  const handleSuggestionAction = async (id: string, action: 'onaylandi' | 'reddedildi') => {
    try {
      const { error } = await supabase
        .from('knowledge_suggestions')
        .update({ durum: action })
        .eq('id', id);

      if (error) throw error;

      setSuggestions(suggestions.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Suggestion action error:', error);
      alert('İşlem başarısız oldu');
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'link':
        return <LinkIcon className="w-4 h-4" />;
      case 'dosya':
        return <Upload className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getContentTypeBadge = (type: string) => {
    const colors = {
      manuel: 'bg-blue-100 text-blue-800',
      link: 'bg-green-100 text-green-800',
      dosya: 'bg-purple-100 text-purple-800',
    };
    const labels = {
      manuel: 'Manuel',
      link: 'Link',
      dosya: 'Dosya',
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[type as keyof typeof colors] || colors.manuel}`}>
        {labels[type as keyof typeof labels] || 'Manuel'}
      </span>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bilgi Bankası Yönetimi
        </h1>
        <p className="text-gray-600">
          Makaleleri ekleyin, düzenleyin veya silin. Kullanıcı önerilerini inceleyin.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'articles'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Makaleler ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'suggestions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Öneriler ({suggestions.length})
            {suggestions.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {suggestions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Makaleler Tab */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Yeni Makale Ekle</CardTitle>
              </CardHeader>
              <CardContent>
                <ArticleEditor onSuccess={fetchArticles} />
              </CardContent>
            </Card>
          </div>

          {/* Articles List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mevcut Makaleler ({articles.length})
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600">Henüz makale eklenmemiş</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {articles.map((article) => (
                  <Card key={article.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getContentTypeIcon(article.icerik_tipi)}
                            <h3 className="font-semibold text-gray-900">
                              {article.baslik}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-600">
                              Kategori: {article.kategori}
                            </span>
                            {getContentTypeBadge(article.icerik_tipi)}
                          </div>
                          {article.kaynak_url && (
                            <a
                              href={article.kaynak_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline block mb-1"
                            >
                              🔗 {article.kaynak_url}
                            </a>
                          )}
                          {article.dosya_adi && (
                            <p className="text-xs text-gray-600 mb-1">
                              📎 {article.dosya_adi}
                            </p>
                          )}
                          {article.ozet && (
                            <p className="text-xs text-gray-600 italic mb-2">
                              &quot;{article.ozet}&quot;
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Eye className="w-3 h-3" />
                            <span>{article.goruntulenme_sayisi} görüntülenme</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Öneriler Tab */}
      {activeTab === 'suggestions' && (
        <div className="max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Önerileri</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Kullanıcıların chatbot ayarlarından gönderdiği bilgi bankası önerileri
              </p>
            </CardHeader>
            <CardContent>
              {suggestions.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Bekleyen öneri bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 mb-2 whitespace-pre-wrap">
                            {suggestion.oneri}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(suggestion.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleSuggestionAction(suggestion.id, 'onaylandi')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleSuggestionAction(suggestion.id, 'reddedildi')}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
