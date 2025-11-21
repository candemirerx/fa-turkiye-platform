import Link from 'next/link';
import { MessageCircle, Users, BookOpen, Heart, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section with Menu Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-12">
            <Heart className="w-4 h-4" />
            <span>Yalnız Değilsiniz</span>
          </div>

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

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            İletişim
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* WhatsApp Button */}
            <a
              href="https://wa.me/905317716546"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span>WhatsApp ile İletişime Geç</span>
            </a>

            {/* Email Link */}
            <a
              href="mailto:candemirerx@gmail.com"
              className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-6 h-6" />
              <span>mailim</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
