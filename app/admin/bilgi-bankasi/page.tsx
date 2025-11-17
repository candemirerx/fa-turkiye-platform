'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { KnowledgeBase } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import ArticleEditor from '@/components/admin/ArticleEditor';
import Button from '@/components/ui/Button';
import { Trash2, Eye, BookOpen } from 'lucide-react';

export default function AdminBilgiBankasiPage() {
  const supabase = createClient();
  const [articles, setArticles] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bilgi Bankası Yönetimi
        </h1>
        <p className="text-gray-600">
          Makaleleri ekleyin, düzenleyin veya silin
        </p>
      </div>

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
            <div className="space-y-4">
              {articles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {article.baslik}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Kategori: {article.kategori}
                        </p>
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
    </div>
  );
}
