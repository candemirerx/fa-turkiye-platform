# Friedrich Ataksi Türkiye Platformu - Ürün Gereksinim Dokümanı (PRD)

## 📋 Doküman Bilgileri

| Alan | Değer |
|------|-------|
| Proje Adı | Friedrich Ataksi Türkiye Platformu |
| Versiyon | 1.0.0 |
| Oluşturulma Tarihi | 25 Kasım 2025 |
| Durum | Aktif Geliştirme |

---

## 1. Yönetici Özeti

### 1.1 Vizyon
Friedrich Ataksi (FA) hastaları, yakınları ve sağlık profesyonelleri için Türkiye'nin ilk kapsamlı dijital topluluk ve bilgi merkezi platformu.

### 1.2 Misyon
FA topluluğunu bir araya getirmek, güvenilir bilgiye erişimi kolaylaştırmak ve hastaların yaşam kalitesini artırmak için teknoloji destekli çözümler sunmak.

### 1.3 Hedef Kitle
- **Birincil:** Friedrich Ataksi hastaları
- **İkincil:** Hasta yakınları (ebeveynler, eşler, kardeşler)
- **Üçüncül:** Sağlık profesyonelleri ve danışmanlar

---

## 2. Problem Tanımı

### 2.1 Mevcut Sorunlar
1. **Bilgi Eksikliği:** FA hakkında Türkçe kaynak yetersizliği
2. **İzolasyon:** Hastaların birbirinden habersiz olması
3. **Erişilebilirlik:** Motor beceri kaybı olan kullanıcılar için uygun olmayan web siteleri
4. **Destek Ağı:** Organize topluluk yapısının olmaması
5. **7/24 Destek:** Anlık soru-cevap imkanının bulunmaması

### 2.2 Çözüm Yaklaşımı
Erişilebilir, kullanıcı dostu ve AI destekli bir web platformu ile tüm bu sorunlara tek noktadan çözüm sunmak.

---

## 3. Ürün Özellikleri

### 3.1 Kullanıcı Modülleri

#### 3.1.1 Ana Sayfa
- **Açıklama:** Platform giriş noktası ve navigasyon merkezi
- **Özellikler:**
  - 4 ana modüle hızlı erişim kartları (Bilgi Bankası, FA Network, Etkinlikler, Gruplar)
  - Mobil öncelikli responsive tasarım
  - WhatsApp ve email iletişim butonları
- **Kullanıcı Akışı:** Ziyaretçi → Ana Sayfa → İlgili Modül

#### 3.1.2 Bilgi Bankası
- **Açıklama:** FA hakkında kategorize edilmiş bilgi deposu
- **Özellikler:**
  - Kategorilere göre gruplandırılmış makaleler
  - 3 içerik tipi desteği: Manuel, Link, Dosya
  - Görüntülenme sayacı
  - Özet ve kaynak URL desteği
- **Veri Modeli:**
  ```
  knowledge_base {
    id, baslik, icerik, kategori, goruntulenme_sayisi,
    icerik_tipi (manuel|link|dosya), kaynak_url, dosya_adi, ozet
  }
  ```

#### 3.1.3 FA Network (Topluluk)
- **Açıklama:** Topluluk üyelerinin profil ve hikaye paylaşım alanı
- **Özellikler:**
  - Profil oluşturma ve düzenleme
  - Avatar yükleme (Supabase Storage)
  - İsim/şehir bazlı arama
  - Onay sistemi (beklemede → onaylandı/reddedildi)
  - Sıralama sistemi (display_order)
  - AI destekli yazım düzeltme
- **Veri Modeli:**
  ```
  profiles {
    id, user_id, ad_soyad, yas, yakinlik_derecesi, sehir,
    hikayem_text, yetkinlikler_cv, avatar_url, onay_durumu, display_order
  }
  ```
- **Yakınlık Dereceleri:** Friedrich Ataksi, Ebeveyn, Eşi, Sağlık danışmanı

#### 3.1.4 Etkinlikler
- **Açıklama:** Topluluk etkinlikleri ve online buluşmalar
- **Özellikler:**
  - Yaklaşan ve geçmiş etkinlik ayrımı
  - Zoom/online toplantı linkleri
  - Tarih ve saat gösterimi (Türkçe format)
- **Veri Modeli:**
  ```
  events {
    id, baslik, tarih, link, aciklama, aktif_mi
  }
  ```

#### 3.1.5 İletişim/Gruplar
- **Açıklama:** WhatsApp grupları ve iletişim kanalları
- **Özellikler:**
  - WhatsApp grup linkleri
  - Direkt iletişim butonları

### 3.2 AI Asistan Modülü

#### 3.2.1 Chatbot
- **Açıklama:** Google Gemini 2.5 Flash destekli 7/24 soru-cevap asistanı
- **Özellikler:**
  - Bilgi bankası ve eğitim verilerinden context oluşturma
  - Sohbet geçmişi (localStorage)
  - Yeni sohbet başlatma
  - Ayarlar paneli
  - Tıbbi sorumluluk reddi
  - 30 saniye timeout
- **Teknik Detaylar:**
  - Model: `gemini-2.5-flash`
  - Context: Knowledge base + AI training data
  - System prompt: Veritabanından dinamik yükleme

#### 3.2.2 AI Eğitim Verileri
- **Açıklama:** Chatbot'un bilgi tabanını genişleten soru-cevap çiftleri
- **Veri Modeli:**
  ```
  ai_training_data {
    id, soru, cevap, onaylandi_mi
  }
  ```

#### 3.2.3 Sistem Talimatları
- **Açıklama:** AI asistanın davranışını belirleyen talimatlar
- **Veri Modeli:**
  ```
  ai_system_instructions {
    id, instruction_key, instruction_title, instruction_content, is_active
  }
  ai_settings {
    key, value, description
  }
  ```

### 3.3 Admin Paneli

#### 3.3.1 Dashboard
- **Açıklama:** Platform istatistikleri ve hızlı erişim
- **Metrikler:**
  - Bekleyen profil sayısı
  - Toplam profil sayısı
  - Bilgi bankası makale sayısı
  - Bekleyen AI eğitim verisi sayısı

#### 3.3.2 Profil Yönetimi
- **Özellikler:**
  - Tüm profilleri listeleme
  - Onaylama/Reddetme
  - Sıralama düzenleme (display_order)
  - Profil silme

#### 3.3.3 Bilgi Bankası Yönetimi
- **Özellikler:**
  - Makale ekleme (3 tip: manuel, link, dosya)
  - Makale silme
  - Kullanıcı önerilerini inceleme ve onaylama
- **Öneri Sistemi:**
  ```
  knowledge_suggestions {
    id, oneri, durum (beklemede|onaylandi|reddedildi)
  }
  ```

#### 3.3.4 AI Eğitim Yönetimi
- **Özellikler:**
  - Sistem talimatı düzenleme
  - Eğitim verisi onaylama/silme
  - İstatistik görüntüleme

---

## 4. Kimlik Doğrulama ve Yetkilendirme

### 4.1 Kullanıcı Kimlik Doğrulama
- **Yöntemler:**
  - Google OAuth 2.0
  - Email/Şifre (Supabase Auth)
- **Akış:**
  1. Kullanıcı giriş sayfasına yönlendirilir
  2. Google veya Email ile kimlik doğrulama
  3. Email doğrulama (email/şifre için)
  4. Session oluşturma

### 4.2 Admin Kimlik Doğrulama
- **Yöntem:** Şifre tabanlı (environment variable)
- **Session:** HTTP-only cookie (`admin_session`)
- **Varsayılan Şifre:** `220309` (değiştirilebilir)

### 4.3 Yetkilendirme Seviyeleri
| Rol | Yetkiler |
|-----|----------|
| Anonim | Ana sayfa, Bilgi bankası (okuma), Network (okuma), Etkinlikler |
| Kullanıcı | + Profil oluşturma, Chatbot kullanımı |
| Admin | + Tüm yönetim işlemleri |

---

## 5. Teknik Mimari

### 5.1 Teknoloji Yığını
| Katman | Teknoloji |
|--------|-----------|
| Frontend Framework | Next.js 14+ (App Router) |
| Programlama Dili | TypeScript |
| Stil | Tailwind CSS |
| Backend/Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (Google OAuth + Email) |
| Storage | Supabase Storage |
| AI | Google Gemini API |
| İkonlar | Lucide React |
| Deployment | Vercel |

### 5.2 Proje Yapısı
```
fa-turkiye-platform/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Kimlik doğrulama sayfaları
│   │   └── giris/         # Giriş sayfası
│   ├── (public)/          # Public sayfalar
│   │   ├── page.tsx       # Ana sayfa
│   │   ├── bilgi-bankasi/ # Bilgi bankası
│   │   ├── network/       # FA Network
│   │   ├── etkinlikler/   # Etkinlikler
│   │   └── iletisim/      # İletişim
│   ├── admin/             # Admin paneli
│   │   ├── page.tsx       # Dashboard
│   │   ├── profiller/     # Profil yönetimi
│   │   ├── bilgi-bankasi/ # İçerik yönetimi
│   │   └── ai-egitim/     # AI yönetimi
│   ├── api/               # API Routes
│   │   ├── chat/          # Chatbot API
│   │   ├── admin/         # Admin auth
│   │   ├── ai-training/   # AI eğitim
│   │   ├── correct-text/  # Yazım düzeltme
│   │   └── knowledge-suggestions/
│   └── auth/              # Auth callback
├── components/            # React bileşenleri
│   ├── layout/           # Header, Footer, Navigation
│   ├── ai/               # Chatbot bileşenleri
│   ├── network/          # Network bileşenleri
│   ├── bilgi-bankasi/    # Bilgi bankası bileşenleri
│   ├── admin/            # Admin bileşenleri
│   └── ui/               # Temel UI (Button, Card, Input, vb.)
├── lib/                   # Utility fonksiyonları
│   ├── supabase/         # Supabase client (server/client)
│   ├── gemini/           # Gemini AI client
│   └── utils/            # Yardımcı fonksiyonlar
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript tanımları
└── public/               # Statik dosyalar
```

### 5.3 Veritabanı Şeması
```sql
-- Profiller
profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  ad_soyad TEXT NOT NULL,
  yas INTEGER,
  yakinlik_derecesi TEXT,
  sehir TEXT NOT NULL,
  hikayem_text TEXT,
  yetkinlikler_cv TEXT,
  avatar_url TEXT,
  onay_durumu ENUM('beklemede', 'onaylandı', 'reddedildi'),
  display_order INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Bilgi Bankası
knowledge_base (
  id UUID PRIMARY KEY,
  baslik TEXT NOT NULL,
  icerik TEXT NOT NULL,
  kategori TEXT NOT NULL,
  goruntulenme_sayisi INTEGER DEFAULT 0,
  icerik_tipi ENUM('manuel', 'link', 'dosya'),
  kaynak_url TEXT,
  dosya_adi TEXT,
  ozet TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Etkinlikler
events (
  id UUID PRIMARY KEY,
  baslik TEXT NOT NULL,
  tarih TIMESTAMP NOT NULL,
  link TEXT NOT NULL,
  aciklama TEXT,
  aktif_mi BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- AI Eğitim Verileri
ai_training_data (
  id UUID PRIMARY KEY,
  soru TEXT NOT NULL,
  cevap TEXT NOT NULL,
  onaylandi_mi BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- AI Sistem Talimatları
ai_system_instructions (
  id UUID PRIMARY KEY,
  instruction_key TEXT UNIQUE,
  instruction_title TEXT,
  instruction_content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- AI Ayarları
ai_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Bilgi Önerileri
knowledge_suggestions (
  id UUID PRIMARY KEY,
  oneri TEXT NOT NULL,
  durum ENUM('beklemede', 'onaylandi', 'reddedildi'),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### 5.4 API Endpoints
| Endpoint | Method | Açıklama |
|----------|--------|----------|
| `/api/chat` | POST | AI chatbot mesaj gönderme |
| `/api/admin/auth` | POST/DELETE | Admin giriş/çıkış |
| `/api/ai-training` | GET/POST | AI eğitim verileri |
| `/api/correct-text` | POST | Yazım düzeltme |
| `/api/knowledge-suggestions` | POST | Bilgi önerisi gönderme |

---

## 6. Erişilebilirlik (WCAG 2.1 AA)

### 6.1 Uygulanan Standartlar
- **Minimum Dokunma Alanı:** 44x44px tüm interaktif elementler
- **Renk Kontrastı:** AA seviyesi uyumlu
- **Klavye Navigasyonu:** Tab ile gezinme desteği
- **Focus Göstergeleri:** Görünür focus ring'ler
- **Responsive Tasarım:** Mobil öncelikli yaklaşım

### 6.2 Motor Beceri Kaybı Optimizasyonları
- Büyük butonlar ve tıklama alanları
- Yeterli boşluklar
- Basit ve anlaşılır navigasyon
- Minimum form alanı

---

## 7. Güvenlik

### 7.1 Uygulanan Önlemler
- **Row Level Security (RLS):** Supabase'de aktif
- **Environment Variables:** Tüm API anahtarları güvenli
- **HTTP-only Cookies:** Admin session
- **Input Validation:** Tüm form girişleri
- **CORS:** Kısıtlı origin'ler

### 7.2 Veri Gizliliği
- Kullanıcı verileri Supabase'de şifreli
- Profil onay sistemi ile içerik moderasyonu
- Tıbbi sorumluluk reddi

---

## 8. Performans

### 8.1 Optimizasyonlar
- Next.js Image optimization
- Dynamic imports
- Server-side rendering (SSR)
- Client-side caching

### 8.2 Hedef Metrikler
| Metrik | Hedef |
|--------|-------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Score | > 90 |

---

## 9. Deployment

### 9.1 Ortamlar
| Ortam | Platform | URL |
|-------|----------|-----|
| Production | Vercel | TBD |
| Development | Local | localhost:3000 |

### 9.2 Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_APP_URL=
```

---

## 10. Gelecek Geliştirmeler (Roadmap)

### Faz 2 (Planlanan)
- [ ] Çoklu dil desteği
- [ ] Push bildirimleri
- [ ] Gelişmiş arama
- [ ] Kullanıcı mesajlaşma
- [ ] Video içerik desteği

### Faz 3 (Gelecek)
- [ ] Mobil uygulama (React Native)
- [ ] Offline destek (PWA)
- [ ] Topluluk forumu
- [ ] Uzman danışmanlık sistemi

---

## 11. Başarı Metrikleri (KPI)

| Metrik | Hedef (6 ay) |
|--------|--------------|
| Kayıtlı Kullanıcı | 500+ |
| Aktif Profil | 100+ |
| Bilgi Bankası Makale | 50+ |
| Chatbot Kullanımı | 1000+ mesaj/ay |
| Etkinlik Katılımı | 50+ kişi/etkinlik |

---

## 12. Ekler

### 12.1 İlgili Dokümanlar
- [AI Eğitim Kurulumu](./AI_TRAINING_SETUP.md)
- [Chatbot Ayarları](./CHATBOT_SETTINGS.md)
- [Bilgi Bankası Sistemi](./KNOWLEDGE_BASE_SYSTEM.md)
- [Profil Sıralama Sistemi](./PROFILE_ORDERING_SYSTEM.md)
- [Sistem Prompt Kurulumu](./SYSTEM_PROMPT_SETUP.md)
- [Deployment Rehberi](../DEPLOYMENT.md)
- [Supabase OAuth Kurulumu](../SUPABASE_OAUTH_SETUP.md)

### 12.2 İletişim
- **WhatsApp:** +90 531 771 6546
- **Email:** candemirerx@gmail.com

---

*Bu doküman Friedrich Ataksi Türkiye Platformu için hazırlanmıştır. Tüm hakları saklıdır.*
