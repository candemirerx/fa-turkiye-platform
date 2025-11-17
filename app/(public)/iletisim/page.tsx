import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, Users, Pill, Heart, AlertTriangle } from 'lucide-react';

const whatsappGroups = [
  {
    id: 1,
    name: 'FA Deneyimler',
    description:
      'FA hastaları ve yakınlarının deneyimlerini paylaştığı ana grup',
    icon: Heart,
    link: '#', // Gerçek WhatsApp grup linki buraya eklenecek
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 2,
    name: 'İlaç ve Tedaviler',
    description:
      'İlaç deneyimleri, tedavi süreçleri ve yan etkiler hakkında bilgi paylaşımı',
    icon: Pill,
    link: '#',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    name: 'Yakınlar Destek Grubu',
    description: 'FA hastalarının yakınları için özel destek ve paylaşım grubu',
    icon: Users,
    link: '#',
    color: 'from-purple-500 to-indigo-500',
  },
];

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            <span>İletişim</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WhatsApp Grupları
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            FA topluluğu ile iletişimde kalın, deneyimlerinizi paylaşın
          </p>
        </div>

        {/* Warning */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-6">
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">
                  Önemli Uyarı
                </h3>
                <p className="text-amber-800 leading-relaxed">
                  Bu WhatsApp grupları resmi değildir ve FA hastaları ile
                  yakınları tarafından gönüllü olarak kurulmuştur. Gruplarda
                  paylaşılan bilgiler kişisel deneyimlere dayanmaktadır ve
                  tıbbi tavsiye yerine geçmez. Sağlık sorunlarınız için mutlaka
                  bir sağlık profesyoneline danışın.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {whatsappGroups.map((group) => {
            const Icon = group.icon;
            return (
              <Card
                key={group.id}
                className="hover:shadow-xl transition-all group"
              >
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${group.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center">{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-6">{group.description}</p>
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Gruba Katıl</span>
                  </a>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="max-w-3xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Grup Kuralları</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Gruplarda saygılı ve empatik bir dil kullanın
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Kişisel bilgilerinizi paylaşırken dikkatli olun
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Tıbbi tavsiye vermekten kaçının, sadece kişisel
                    deneyimlerinizi paylaşın
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Reklam, spam ve ticari içerik paylaşmayın
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>
                    Diğer üyelerin gizliliğine saygı gösterin
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
