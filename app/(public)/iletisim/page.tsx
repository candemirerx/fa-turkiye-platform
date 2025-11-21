import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MessageCircle, Users, Pill, Heart, AlertTriangle, Brain, Coffee, UserCircle2, Mail, Radio } from 'lucide-react';

// Topluluk
const community = {
  name: 'Friedrich Ataksi Topluluğu',
  description: 'FA hastaları ve yakınlarının ana topluluğu',
  icon: Users,
  link: 'https://chat.whatsapp.com/KXIeJISqjwz6IRucVLbu9v?mode=wwt',
  color: 'from-emerald-500 to-teal-500',
};

// Gruplar
const whatsappGroups = [
  {
    id: 1,
    name: 'FA Deneyimler',
    description: 'Hasta ve ailelerinin tecrübelerini paylaştığı blog yazıları ve makaleler',
    icon: Heart,
    link: 'https://chat.whatsapp.com/JhEgvNEPQUfHg990c3yu9j?mode=wwt',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 2,
    name: 'FA İlaç ve Tedaviler',
    description: 'Mevcut tedaviler ve araştırmalar hakkında bilgi paylaşımı',
    icon: Pill,
    link: 'https://chat.whatsapp.com/Hw68VqZuOKv1zEFn4Jz40N?mode=wwt',
    color: 'from-blue-500 to-cyan-500',
    hasWarning: true,
  },
  {
    id: 3,
    name: 'FA Psikoloji',
    description: 'Mücadele yöntemleri, psikolojik destek ve sosyoloji',
    icon: Brain,
    link: 'https://chat.whatsapp.com/BqVgTkyLEp80xkUV4QGnXR?mode=wwt',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    id: 4,
    name: 'FA Sohbet/Muhabbet',
    description: 'Günlük sohbet ve dostluk için rahat bir ortam',
    icon: Coffee,
    link: 'https://chat.whatsapp.com/IPdNpA1iKHTLJAFchRktYy?mode=wwt',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 5,
    name: 'FA Erkekler',
    description: 'Erkek FA hastaları için özel paylaşım grubu',
    icon: UserCircle2,
    link: 'https://chat.whatsapp.com/KeOfXX2grFR5cEaZrrhSi3?mode=wwt',
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 6,
    name: 'FA Kadınlar',
    description: 'Kadın FA hastaları için özel paylaşım grubu',
    icon: UserCircle2,
    link: 'https://chat.whatsapp.com/HsILocQvdE65Nh4oRlhgci?mode=wwt',
    color: 'from-pink-500 to-rose-500',
  },
];

// WhatsApp Kanalı
const whatsappChannel = {
  name: 'Friedreich Ataksi TÜRKİYE Kanalı',
  description: 'WhatsApp kanalımızı takip edin',
  icon: Radio,
  link: 'https://whatsapp.com/channel/0029Vb62zivDjiOloxgw6o2M',
  color: 'from-indigo-500 to-purple-500',
};

export default function IletisimPage() {
  const CommunityIcon = community.icon;
  const whatsappNumber = '05317716546';
  const email = 'candemirerx@gmail.com';

  // WhatsApp linki oluştur (Türkiye için +90 kodu ile)
  const whatsappLink = `https://wa.me/9${whatsappNumber}`;
  const mailLink = `mailto:${email}`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* İletişim Kutusu */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="hover:shadow-xl transition-all">
            <CardHeader>
              <CardTitle className="text-center text-3xl font-bold text-gray-900">
                İletişim
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* WhatsApp Butonu */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[56px] text-lg shadow-md"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>WhatsApp ile İletişime Geç</span>
              </a>

              {/* Mail Bağlantısı */}
              <a
                href={mailLink}
                className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 min-h-[56px] text-lg shadow-md"
              >
                <Mail className="w-6 h-6" />
                <span>mailim</span>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Topluluk */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="hover:shadow-xl transition-all group">
            <CardHeader>
              <div
                className={`w-20 h-20 bg-gradient-to-br ${community.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <CommunityIcon className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-center text-2xl">{community.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 text-lg">{community.description}</p>
              <a
                href={community.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-4 focus:ring-green-500 min-h-[44px] text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Topluluğa Katıl</span>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Gruplar */}
        <div className="mb-12">
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
                    <p className="text-gray-600 mb-4">{group.description}</p>

                    {/* İlaç ve Tedaviler grubu için özel uyarı */}
                    {group.hasWarning && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-800 font-medium">
                          ⚠️ Bu içerik tıbbi tavsiye niteliğinde değildir
                        </p>
                      </div>
                    )}

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
        </div>

        {/* WhatsApp Kanalı */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="hover:shadow-xl transition-all group bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <CardHeader>
              <div
                className={`w-20 h-20 bg-gradient-to-br ${whatsappChannel.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
              >
                <Radio className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-center text-2xl">{whatsappChannel.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 text-lg">{whatsappChannel.description}</p>
              <a
                href={whatsappChannel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 min-h-[44px] text-lg shadow-md"
              >
                <Radio className="w-5 h-5" />
                <span>Kanalı Takip Et</span>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Grup Kuralları */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Grup Kuralları
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Saygılı ve empatik bir dil kullanın</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Kişisel bilgilerinizi paylaşırken dikkatli olun</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Tıbbi tavsiye vermekten kaçının, deneyimlerinizi paylaşın</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Reklam ve ticari içerik paylaşmayın</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Diğer üyelerin gizliliğine saygı gösterin</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Önemli Uyarı */}
        <div className="max-w-3xl mx-auto">
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
      </div>
    </div>
  );
}
