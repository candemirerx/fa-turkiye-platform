import Link from 'next/link';
import { MessageCircle, Users, BookOpen, Heart, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Menu Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-12 hover:bg-blue-200 transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
            <span>Yalnız Değilsiniz</span>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Bilgi Bankası */}
            <Link href="/bilgi-bankasi">
              <Card className="hover:shadow-xl transition-all cursor-pointer group h-full border-0 shadow-sm hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Bilgi Bankası
                  </h3>
                  <p className="text-sm text-gray-600">
                    FA hakkında detaylı bilgiler ve makaleler.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* FA Network */}
            <Link href="/network">
              <Card className="hover:shadow-xl transition-all cursor-pointer group h-full border-0 shadow-sm hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    FA Network
                  </h3>
                  <p className="text-sm text-gray-600">
                    Topluluk üyeleriyle tanışın ve paylaşın.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Etkinlikler */}
            <Link href="/etkinlikler">
              <Card className="hover:shadow-xl transition-all cursor-pointer group h-full border-0 shadow-sm hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Etkinlikler
                  </h3>
                  <p className="text-sm text-gray-600">
                    Yaklaşan etkinlikleri ve buluşmaları takip edin.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* İletişim */}
            <Link href="/iletisim">
              <Card className="hover:shadow-xl transition-all cursor-pointer group h-full border-0 shadow-sm hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    İletişim
                  </h3>
                  <p className="text-sm text-gray-600">
                    Sorularınız için bizimle iletişime geçin.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                Topluluk
              </div>
              <p className="text-gray-600">
                Birlikte güçlü bir aile
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                Bilgi
              </div>
              <p className="text-gray-600">
                Güncel ve doğru içerik
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                Destek
              </div>
              <p className="text-gray-600">
                7/24 AI asistan desteği
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
