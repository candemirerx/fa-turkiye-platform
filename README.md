# Friedrich Ataksi Türkiye Platformu

FA hastaları, yakınları ve uzmanlar için topluluk ve bilgi merkezi web uygulaması.

## 🎯 Özellikler

### Kullanıcı Özellikleri
- ✅ **Google OAuth Girişi** - Güvenli ve hızlı kimlik doğrulama
- ✅ **AI Chatbot Asistan** - Google Gemini destekli 7/24 soru-cevap
- ✅ **FA Network** - Topluluk üyelerinin hikayelerini paylaşma
- ✅ **Bilgi Bankası** - Kategorize edilmiş FA bilgileri
- ✅ **Etkinlikler** - Zoom toplantıları ve webinarlar
- ✅ **WhatsApp Grupları** - Topluluk iletişim kanalları
- ✅ **Erişilebilir Tasarım** - Motor beceri kaybı olan kullanıcılar için optimize edilmiş (WCAG 2.1 AA)

### Admin Özellikleri
- ✅ **Profil Yönetimi** - Kullanıcı profillerini onayla/reddet
- ✅ **İçerik Yönetimi** - Bilgi bankası makaleleri ekle/düzenle
- ✅ **AI Eğitimi** - AI asistan için eğitim verilerini yönet
- ✅ **Dashboard** - Platform istatistikleri

## 🛠 Teknoloji Yığını

- **Framework**: Next.js 14+ (App Router)
- **Dil**: TypeScript
- **Stil**: Tailwind CSS
- **Backend & Auth**: Supabase (PostgreSQL + Google Auth)
- **AI**: Google Gemini API
- **İkonlar**: Lucide React
- **Deployment**: Vercel

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Environment Variables
`.env.local` dosyasını oluşturun (`.env.example` dosyasını referans alın):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
ADMIN_PASSWORD=your_admin_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'de `.kiro/specs/fa-turkiye-platform/design.md` dosyasındaki SQL kodlarını çalıştırın
4. Authentication > Providers > Google'ı aktif edin

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın

## 📁 Proje Yapısı

```
fa-turkiye-platform/
├── app/                    # Next.js App Router sayfaları
│   ├── (auth)/            # Authentication sayfaları
│   ├── (public)/          # Public sayfalar (anasayfa, bilgi bankası, network, vb.)
│   ├── admin/             # Admin paneli
│   └── api/               # API routes (chat, admin auth)
├── components/            # React bileşenleri
│   ├── layout/           # Header, Navigation, Footer
│   ├── ai/               # AI Chatbot bileşenleri
│   ├── network/          # FA Network bileşenleri
│   ├── bilgi-bankasi/    # Bilgi bankası bileşenleri
│   ├── admin/            # Admin bileşenleri
│   └── ui/               # Temel UI bileşenleri (Button, Card, Input, vb.)
├── lib/                   # Utility fonksiyonları
│   ├── supabase/         # Supabase client & server
│   ├── gemini/           # Gemini AI client
│   └── utils/            # Yardımcı fonksiyonlar
├── hooks/                 # Custom React hooks (useAuth)
├── types/                 # TypeScript type tanımları
└── .kiro/specs/          # Proje spesifikasyonları
```

## 🔐 Admin Paneli

Admin paneline erişim: `/admin`

Varsayılan şifre: `220309` (`.env.local` dosyasında değiştirilebilir)

### Admin Özellikleri:
- Bekleyen profilleri onayla/reddet
- Bilgi bankası makaleleri ekle/düzenle/sil
- AI eğitim verilerini onayla/sil
- Platform istatistiklerini görüntüle

## 🌐 Deployment

Detaylı deployment talimatları için `DEPLOYMENT.md` dosyasına bakın.

### Hızlı Vercel Deployment:
1. GitHub'a push edin
2. [Vercel](https://vercel.com) hesabı oluşturun
3. Repository'yi import edin
4. Environment variables ekleyin
5. Deploy edin!

## 📝 Geliştirme Notları

- **Node.js Versiyonu**: 20.9.0+ önerilir (mevcut: 18.20.8 geliştirme için çalışır)
- **Erişilebilirlik**: Tüm interaktif elementler minimum 44x44px
- **Güvenlik**: Row Level Security (RLS) aktif, API keys environment variables'da
- **Performance**: Next.js Image optimization, dynamic imports kullanılıyor

## 🤝 Katkıda Bulunma

Bu proje FA topluluğu için gönüllü olarak geliştirilmiştir. Katkılarınızı bekliyoruz!

## 📄 Lisans

ISC

## 🙏 Teşekkürler

Bu platform FA hastaları, yakınları ve tüm destek veren gönüllüler için geliştirilmiştir. Birlikte güçlüyüz! ❤️
