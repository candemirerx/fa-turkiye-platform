import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Eye, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Makaleyi çek
  const { data: article, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !article) {
    notFound();
  }

  // Görüntülenme sayısını artır
  await supabase
    .from('knowledge_base')
    .update({ goruntulenme_sayisi: article.goruntulenme_sayisi + 1 })
    .eq('id', id);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/bilgi-bankasi"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium focus:outline-none focus:ring-4 focus:ring-blue-500 rounded-lg px-4 py-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Bilgi Bankasına Dön</span>
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Category */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {article.kategori}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.baslik}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(article.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.goruntulenme_sayisi + 1} görüntülenme</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.icerik}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <p className="text-sm text-amber-800">
              <strong>Önemli Uyarı:</strong> Bu içerik bilgilendirme amaçlıdır
              ve tıbbi tavsiye yerine geçmez. Sağlık sorunlarınız için mutlaka
              bir sağlık profesyoneline danışın.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
