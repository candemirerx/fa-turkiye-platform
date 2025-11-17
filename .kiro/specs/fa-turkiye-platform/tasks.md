# Implementation Plan

- [x] 1. Proje kurulumu ve temel yapılandırma



  - Next.js 14 projesi oluştur (App Router ile)
  - TypeScript, Tailwind CSS, Lucide React kur
  - Klasör yapısını oluştur (app, components, lib, hooks, types)
  - Environment variables için .env.local dosyası hazırla


  - _Requirements: 15.1, 16.4_

- [ ] 2. Supabase entegrasyonu ve veritabanı kurulumu
  - Supabase client ve server utilities oluştur (lib/supabase/)
  - Database types tanımla (types/database.ts)
  - Supabase'de tabloları oluştur (profiles, knowledge_base, events, ai_training_data)


  - Index'leri ekle
  - Row Level Security (RLS) policies uygula
  - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 16.3_

- [ ] 3. Authentication sistemi
  - Google OAuth provider'ı Supabase'de yapılandır


  - useAuth custom hook oluştur
  - Giriş sayfası oluştur (app/(auth)/giris/page.tsx)
  - Header'da giriş/çıkış butonları ekle
  - Session yönetimi ve otomatik token refresh
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_



- [ ] 4. Temel UI bileşenleri
  - Button component (erişilebilir, min 44x44px)
  - Card component
  - Input component (form elemanları)
  - Modal component


  - Tüm bileşenlerde WCAG AA uyumluluğu (kontrast, focus states)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 5. Layout bileşenleri
  - Header component (logo, navigasyon, auth butonları)


  - Navigation component (büyük tıklama alanları, klavye desteği)
  - Footer component
  - Root layout (app/layout.tsx) ve global styles
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 6. Anasayfa


  - Hero bölümü ("Friedrich Ataksi Mücadelesinde Yalnız Değilsiniz")
  - Hızlı erişim kartları (Asistana Sor, FA Network, Bilgi Bankası)
  - Responsive tasarım
  - Erişilebilir navigasyon
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_



- [ ] 7. Google Gemini AI entegrasyonu
  - Gemini client oluştur (lib/gemini/client.ts)
  - API route oluştur (app/api/chat/route.ts)
  - Knowledge base ve AI training data'yı context olarak kullan
  - 5 saniye timeout mekanizması


  - Error handling ve fallback mesajları
  - _Requirements: 3.3, 3.4, 3.6_

- [ ] 8. AI Chatbot UI
  - ChatbotButton component (sabit pozisyon, 60x60px)
  - ChatbotModal component (mesaj geçmişi, input, loading state)


  - "Ben doktor değilim" uyarısı
  - Otomatik scroll ve mesaj formatlaması
  - _Requirements: 3.1, 3.2, 3.5_

- [x] 9. Bilgi Bankası sayfaları


  - Liste sayfası (app/(public)/bilgi-bankasi/page.tsx)
  - Kategoriye göre gruplama ve filtreleme
  - Makale detay sayfası (app/(public)/bilgi-bankasi/[id]/page.tsx)
  - Görüntülenme sayısını artırma
  - "Yakında" mesajı (içerik yoksa)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_



- [ ] 10. FA Network - Profil listesi
  - ProfileCard component (avatar, isim, şehir)
  - Liste sayfası (app/(public)/network/page.tsx)
  - Sadece onaylanmış profilleri göster
  - Şehir ve isme göre filtreleme
  - LinkedIn tarzı kart düzeni


  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 11. FA Network - Profil detayı
  - ProfileDetail component
  - Detay sayfası (app/(public)/network/[id]/page.tsx)


  - Hikaye ve yetkinlikleri göster
  - 404 handling (onaylanmamış profiller için)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 12. FA Network - Profil oluşturma
  - ProfileForm component (form validation, dosya yükleme)


  - Profil oluşturma sayfası (app/(public)/network/profil-olustur/page.tsx)
  - Supabase Storage ile avatar yükleme
  - Onay durumunu 'beklemede' olarak ayarla
  - "Profiliniz inceleniyor" mesajı
  - Giriş yapmış kullanıcı kontrolü
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_



- [ ] 13. Etkinlikler sayfası
  - Liste sayfası (app/(public)/etkinlikler/page.tsx)
  - Sadece aktif etkinlikleri göster
  - Tarihe göre sıralama (en yakın önce)
  - Zoom linklerine yönlendirme (yeni sekmede)


  - "Yakında duyurulacak" mesajı (boşsa)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 14. İletişim sayfası
  - İletişim sayfası (app/(public)/iletisim/page.tsx)
  - WhatsApp grup butonları (FA Deneyimler, İlaç Tedaviler)


  - "Bu gruplar resmi değildir" uyarısı (belirgin)
  - Her grup için açıklama
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 15. Admin paneli - Authentication

  - Admin login component (şifre input)
  - Admin layout (app/admin/layout.tsx) - şifre kontrolü
  - Session-based admin authentication (24 saat)
  - Environment variable'dan şifre kontrolü (ADMIN_PASSWORD)
  - Yetkisiz erişim koruması
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 16. Admin paneli - Profil yönetimi
  - ProfileApproval component
  - Profil yönetimi sayfası (app/admin/profiller/page.tsx)
  - Bekleyen profilleri listele
  - Onayla/Reddet butonları ve işlevleri
  - Profil detaylarını göster
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 17. Admin paneli - Bilgi Bankası yönetimi
  - ArticleEditor component (zengin metin editörü)
  - Bilgi bankası yönetimi sayfası (app/admin/bilgi-bankasi/page.tsx)
  - Makale ekleme formu (başlık, içerik, kategori)
  - Makale düzenleme ve silme
  - Form validasyonu
  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 18. Admin paneli - AI eğitim verisi yönetimi
  - AIDataApproval component
  - AI eğitim yönetimi sayfası (app/admin/ai-egitim/page.tsx)



  - Onaylanmamış verileri listele
  - Onayla/Sil butonları ve işlevleri
  - Onaylanan verileri AI context'ine dahil et
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [ ] 19. Performans optimizasyonları
  - Next.js Image component kullanımı
  - Dynamic imports (ChatbotModal, ProfileForm)
  - Database query optimizasyonları
  - Static generation ve revalidation
  - _Requirements: 16.1_

- [ ] 20. Güvenlik sıkılaştırma
  - Input sanitization (XSS prevention)
  - CORS yapılandırması
  - Rate limiting
  - File upload güvenliği (type validation, size limits)
  - API key protection
  - _Requirements: 16.2, 16.3, 16.4, 16.5_

- [ ]* 21. Test yazımı
  - [ ]* 21.1 Unit testler (utility functions, hooks)
    - Form validation testleri
    - useAuth hook testleri
    - Data transformation testleri
    - _Requirements: 16.1_
  
  - [ ]* 21.2 Integration testler
    - Authentication flow testi
    - Profile creation testi
    - AI chatbot interaction testi
    - _Requirements: 16.1_
  
  - [ ]* 21.3 Accessibility testler
    - Keyboard navigation testi
    - Color contrast validation
    - Screen reader compatibility
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 22. Deployment hazırlığı
  - Vercel'e deploy
  - Environment variables yapılandırması
  - Supabase production setup
  - Google OAuth production credentials
  - Domain yapılandırması
  - _Requirements: 16.1, 16.2_
