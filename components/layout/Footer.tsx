import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              FA Türkiye Platformu
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Friedrich Ataksi hastaları, yakınları ve uzmanlar için
              oluşturulmuş bir topluluk ve bilgi merkezi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/bilgi-bankasi"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Bilgi Bankası
                </a>
              </li>
              <li>
                <a
                  href="/network"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  FA Network
                </a>
              </li>
              <li>
                <a
                  href="/etkinlikler"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  Etkinlikler
                </a>
              </li>
              <li>
                <a
                  href="/iletisim"
                  className="text-gray-600 hover:text-blue-600 text-sm transition-colors"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Destek
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Sorularınız için AI asistanımızı kullanabilir veya WhatsApp
              gruplarımıza katılabilirsiniz.
            </p>
            <p className="text-xs text-gray-500">
              Bu platform gönüllüler tarafından yönetilmektedir.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span>
              2025 FA Türkiye Platformu. Tüm hakları saklıdır.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
