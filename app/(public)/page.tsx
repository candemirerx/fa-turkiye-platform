import Link from 'next/link';
import { MessageCircle, Users, BookOpen, Heart, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            <span>Yalnız Değilsiniz</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Friedrich Ataksi Mücadelesinde
            <span className="block text-blue-600 mt-2">
              Birlikte Güçlüyüz
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            FA hastaları, yakınları ve uzmanlar için oluşturulmuş bir topluluk
            ve bilgi merkezi. Deneyimlerinizi paylaşın, bilgi edinin, destek
            bulun.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/network"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px]"
            >
              <Users className="w-5 h-5" />
              <span>FA Network'e Katıl</span>
            </Link>
            <Link
              href="/bilgi-bankasi"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[44px]"
            >
              <BookOpen className="w-5 h-5" />
              <span>Bilgi Bankası</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Hızlı Erişim
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Asistan */}
            <Card className="hover:shadow-xl transition-all cursor-pointer group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  AI Asistana Sor
                </h3>
                <p className="text-gray-600 mb-4">
                  FA hakkında sorularınızı yapay zeka destekli asistanımıza
                  sorun. 7/24 yanıtınızda.
                </p>
                <button className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  Sohbete Başla →
                </button>
              </CardContent>
            </Card>

            {/* FA Network */}
            <Link href="/network">
              <Card className="hover:shadow-xl transition-all cursor-pointer group h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    FA Network
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Topluluk üyelerinin hikayelerini okuyun, deneyimlerini
                    öğrenin ve kendi hikayenizi paylaşın.
                  </p>
                  <span className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                    Profilleri Gör →
                  </span>
                </CardContent>
              </Card>
            </Link>

            {/* Bilgi Bankası */}
            <Link href="/bilgi-bankasi">
              <Card className="hover:shadow-xl transition-all cursor-pointer group h-full">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Bilgi Bankası
                  </h3>
                  <p className="text-gray-600 mb-4">
                    FA hakkında detaylı bilgiler, tedavi seçenekleri ve
                    araştırmalar hakkında makaleler.
                  </p>
                  <span className="text-green-600 font-medium hover:text-green-700 transition-colors">
                    Makaleleri İncele →
                  </span>
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
