import { createClient } from '@/lib/supabase/server';
import ArticleCard from '@/components/bilgi-bankasi/ArticleCard';
import BilgiBankasiHeader from '@/components/bilgi-bankasi/BilgiBankasiHeader';
import { BookOpen } from 'lucide-react';

export default async function BilgiBankasiPage() {
  const supabase = await createClient();

  const { data: articles, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('created_at', { ascending: false });

  // Kategorilere göre grupla
  const articlesByCategory: Record<string, NonNullable<typeof articles>> = {};
  
  if (articles) {
    articles.forEach((article) => {
      if (!articlesByCategory[article.kategori]) {
        articlesByCategory[article.kategori] = [];
      }
      articlesByCategory[article.kategori]?.push(article);
    });
  }

  const categories = Object.keys(articlesByCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <BilgiBankasiHeader />

        {/* Content */}
        {!articles || articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Henüz İçerik Yok
            </h2>
            <p className="text-gray-600">
              Bilgi bankası içerikleri yakında eklenecek.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-blue-600 rounded-full" />
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articlesByCategory[category]?.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
