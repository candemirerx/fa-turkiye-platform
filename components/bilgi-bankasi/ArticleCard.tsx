import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Eye, Calendar } from 'lucide-react';
import { KnowledgeBase } from '@/types';

interface ArticleCardProps {
  article: KnowledgeBase;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/bilgi-bankasi/${article.id}`}>
      <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
        <CardHeader>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mb-2">
            <span className="px-3 py-1 bg-blue-100 rounded-full">
              {article.kategori}
            </span>
          </div>
          <CardTitle className="group-hover:text-blue-600 transition-colors">
            {article.baslik}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 line-clamp-3 mb-4">
            {article.icerik.substring(0, 150)}...
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{article.goruntulenme_sayisi} görüntülenme</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(article.created_at).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
