# Requirements Document

## Introduction

Friedrich Ataksi (FA) Türkiye Platformu, FA hastaları, yakınları ve uzmanlar için tasarlanmış kapsamlı bir topluluk ve bilgi merkezi web uygulamasıdır. Platform, kullanıcıların bilgiye erişmesini, deneyimlerini paylaşmasını ve birbirleriyle bağlantı kurmasını sağlar. Erişilebilirlik, özellikle motor beceri kaybı olan kullanıcılar için kritik öneme sahiptir.

## Glossary

- **Platform**: Friedrich Ataksi Türkiye web uygulaması
- **Kullanıcı**: Platforma Google hesabı ile giriş yapan kişi
- **Ziyaretçi**: Giriş yapmamış, platformu görüntüleyen kişi
- **Admin**: Yönetim paneline erişimi olan, içerik ve profilleri yöneten kişi
- **Profil**: FA Network'te görüntülenen kullanıcı bilgileri ve hikayesi
- **AI Asistan**: Google Gemini API ile çalışan chatbot
- **Bilgi Bankası**: Admin tarafından eklenen kategorili makaleler
- **Onay Durumu**: Profillerin yayınlanma izni (beklemede, onaylandı, reddedildi)
- **Supabase**: Backend ve authentication servisi
- **Erişilebilir Tasarım**: Motor beceri kaybı olan kullanıcılar için optimize edilmiş arayüz

## Requirements

### Requirement 1: Kullanıcı Kimlik Doğrulama

**User Story:** Bir ziyaretçi olarak, Google hesabım ile platforma giriş yapabilmek istiyorum, böylece profil oluşturabilir ve kişiselleştirilmiş özelliklere erişebilirim.

#### Acceptance Criteria

1. WHEN bir ziyaretçi giriş butonuna tıkladığında, THE Platform SHALL Google OAuth ekranını gösterecek
2. WHEN Google kimlik doğrulama başarılı olduğunda, THE Platform SHALL kullanıcıyı Supabase profiles tablosuna kaydedecek
3. WHEN yeni bir kullanıcı ilk kez giriş yaptığında, THE Platform SHALL onay_durumu alanını 'beklemede' olarak ayarlayacak
4. WHEN kullanıcı giriş yaptığında, THE Platform SHALL kullanıcı oturumunu güvenli şekilde yönetecek
5. THE Platform SHALL kullanıcıya çıkış yapma imkanı sunacak

### Requirement 2: Erişilebilir Arayüz Tasarımı

**User Story:** Motor beceri kaybı olan bir kullanıcı olarak, büyük butonlar ve yüksek kontrast ile tasarlanmış bir arayüz görmek istiyorum, böylece platformu rahatça kullanabilirim.

#### Acceptance Criteria

1. THE Platform SHALL minimum 44x44 piksel boyutunda tıklanabilir alanlar sunacak
2. THE Platform SHALL WCAG AA standardına uygun renk kontrastı (minimum 4.5:1) kullanacak
3. THE Platform SHALL minimum 16px font boyutu kullanacak
4. THE Platform SHALL tüm interaktif elementlerde hover ve focus durumlarını görsel olarak belirtecek
5. THE Platform SHALL klavye navigasyonunu tam olarak destekleyecek

### Requirement 3: AI Chatbot Asistan

**User Story:** Bir kullanıcı olarak, FA hakkında sorular sorabileceğim bir AI asistana erişmek istiyorum, böylece hızlıca bilgi edinebilirim.

#### Acceptance Criteria

1. THE Platform SHALL her sayfada sağ altta sabit bir chatbot butonu gösterecek
2. WHEN kullanıcı chatbot butonuna tıkladığında, THE Platform SHALL modal bir sohbet penceresi açacak
3. WHEN kullanıcı bir soru sorduğunda, THE Platform SHALL Google Gemini API'ye istek gönderecek
4. THE Platform SHALL AI yanıtlarını sadece knowledge_base ve ai_training_data tablolarındaki verilerle sınırlandıracak
5. THE Platform SHALL her AI yanıtında "Ben doktor değilim, tıbbi tavsiye vermiyorum" uyarısını gösterecek
6. WHEN AI yanıt ürettiğinde, THE Platform SHALL yanıtı 5 saniye içinde kullanıcıya sunacak

### Requirement 4: Anasayfa

**User Story:** Bir ziyaretçi olarak, platforma ilk girdiğimde net bir hero bölümü ve hızlı erişim kartları görmek istiyorum, böylece platformun amacını anlayabilir ve kolayca gezinebilirim.

#### Acceptance Criteria

1. THE Platform SHALL anasayfada "Friedrich Ataksi Mücadelesinde Yalnız Değilsiniz" başlığını gösterecek
2. THE Platform SHALL hero bölümünde empatik ve profesyonel bir ton kullanacak
3. THE Platform SHALL üç hızlı erişim kartı sunacak: Asistana Sor, FA Network, Bilgi Bankası
4. WHEN kullanıcı bir hızlı erişim kartına tıkladığında, THE Platform SHALL ilgili sayfaya yönlendirecek
5. THE Platform SHALL anasayfayı 2 saniye içinde yükleyecek

### Requirement 5: Bilgi Bankası

**User Story:** Bir kullanıcı olarak, FA hakkında kategorize edilmiş makalelere erişmek istiyorum, böylece hastalık hakkında detaylı bilgi edinebilirim.

#### Acceptance Criteria

1. THE Platform SHALL bilgi bankası sayfasında makaleleri kategorilere göre gruplandıracak
2. WHEN bir makaleye tıklandığında, THE Platform SHALL makale detay sayfasını gösterecek
3. THE Platform SHALL her makale için görüntülenme sayısını artıracak
4. WHEN bilgi bankasında içerik yoksa, THE Platform SHALL "Yakında" mesajı gösterecek
5. THE Platform SHALL makaleleri arama ve filtreleme özelliği sunacak

### Requirement 6: FA Network - Profil Listesi

**User Story:** Bir ziyaretçi olarak, FA topluluğundaki diğer kişilerin profillerini görmek istiyorum, böylece benzer deneyimlere sahip insanlarla bağlantı kurabilirim.

#### Acceptance Criteria

1. THE Platform SHALL sadece onay_durumu 'onaylandı' olan profilleri gösterecek
2. THE Platform SHALL her profil kartında fotoğraf, isim ve şehir bilgisi gösterecek
3. THE Platform SHALL profilleri LinkedIn tarzı kart düzeninde sunacak
4. WHEN bir profil kartına tıklandığında, THE Platform SHALL profil detay sayfasına yönlendirecek
5. THE Platform SHALL profil listesini şehir ve isme göre filtreleme imkanı sunacak

### Requirement 7: FA Network - Profil Detayı

**User Story:** Bir kullanıcı olarak, bir profil kartına tıkladığımda o kişinin hikayesini ve yetkinliklerini görmek istiyorum, böylece onları daha iyi tanıyabilirim.

#### Acceptance Criteria

1. THE Platform SHALL profil detay sayfasında hikayem_text alanını gösterecek
2. THE Platform SHALL profil detay sayfasında yetkinlikler_cv alanını gösterecek
3. THE Platform SHALL profil sahibinin iletişim bilgilerini (varsa) gösterecek
4. THE Platform SHALL profil fotoğrafını yüksek çözünürlükte gösterecek
5. WHEN profil onaylanmamışsa, THE Platform SHALL 404 hatası döndürecek

### Requirement 8: FA Network - Profil Oluşturma

**User Story:** Giriş yapmış bir kullanıcı olarak, kendi profilimi oluşturmak istiyorum, böylece topluluğa katılabilir ve hikayemi paylaşabilirim.

#### Acceptance Criteria

1. WHERE kullanıcı giriş yapmışsa, THE Platform SHALL "Profil Ekle" butonunu gösterecek
2. WHEN kullanıcı profil oluşturma formunu doldurduğunda, THE Platform SHALL tüm zorunlu alanları kontrol edecek
3. THE Platform SHALL profil fotoğrafı yükleme imkanı sunacak
4. WHEN profil kaydedildiğinde, THE Platform SHALL onay_durumu'nu 'beklemede' olarak ayarlayacak
5. THE Platform SHALL kullanıcıya "Profiliniz inceleniyor" mesajı gösterecek
6. WHERE kullanıcının zaten bir profili varsa, THE Platform SHALL düzenleme formunu gösterecek

### Requirement 9: Etkinlikler

**User Story:** Bir kullanıcı olarak, yaklaşan Zoom toplantılarını ve etkinlikleri görmek istiyorum, böylece topluluk etkinliklerine katılabilirim.

#### Acceptance Criteria

1. THE Platform SHALL sadece aktif_mi alanı true olan etkinlikleri gösterecek
2. THE Platform SHALL etkinlikleri tarihe göre sıralayacak (en yakın tarih önce)
3. THE Platform SHALL her etkinlik için başlık, tarih, açıklama ve katılım linki gösterecek
4. WHEN bir etkinlik linkine tıklandığında, THE Platform SHALL kullanıcıyı yeni sekmede Zoom linkine yönlendirecek
5. WHEN etkinlik listesi boşsa, THE Platform SHALL "Yakında duyurulacak" mesajı gösterecek

### Requirement 10: İletişim Sayfası

**User Story:** Bir kullanıcı olarak, WhatsApp gruplarına katılmak istiyorum, böylece diğer hastalar ve yakınlarıyla iletişim kurabilirim.

#### Acceptance Criteria

1. THE Platform SHALL farklı WhatsApp grupları için butonlar gösterecek (FA Deneyimler, İlaç Tedaviler)
2. WHEN bir WhatsApp butonuna tıklandığında, THE Platform SHALL kullanıcıyı WhatsApp grup linkine yönlendirecek
3. THE Platform SHALL "Bu gruplar resmi değildir, hastalar tarafından kurulmuştur" uyarısını gösterecek
4. THE Platform SHALL uyarıyı görsel olarak belirgin şekilde sunacak
5. THE Platform SHALL her grup için kısa bir açıklama gösterecek

### Requirement 11: Admin Paneli - Kimlik Doğrulama

**User Story:** Bir admin olarak, yönetim paneline güvenli şekilde giriş yapmak istiyorum, böylece platform içeriğini yönetebilirim.

#### Acceptance Criteria

1. THE Platform SHALL admin paneli girişinde şifre isteyecek
2. WHEN girilen şifre environment variable'daki şifre ile eşleştiğinde, THE Platform SHALL admin paneline erişim verecek
3. WHEN şifre yanlış olduğunda, THE Platform SHALL "Geçersiz şifre" mesajı gösterecek
4. THE Platform SHALL admin oturumunu 24 saat boyunca aktif tutacak
5. THE Platform SHALL admin panelini yetkisiz erişime karşı koruyacak

### Requirement 12: Admin Paneli - Profil Yönetimi

**User Story:** Bir admin olarak, bekleyen profilleri inceleyip onaylamak veya reddetmek istiyorum, böylece platform kalitesini kontrol edebilirim.

#### Acceptance Criteria

1. THE Platform SHALL onay_durumu 'beklemede' olan tüm profilleri listeleyecek
2. THE Platform SHALL her profil için tam bilgileri (isim, şehir, hikaye, yetkinlikler) gösterecek
3. WHEN admin "Onayla" butonuna tıkladığında, THE Platform SHALL onay_durumu'nu 'onaylandı' olarak güncelleyecek
4. WHEN admin "Reddet" butonuna tıkladığında, THE Platform SHALL onay_durumu'nu 'reddedildi' olarak güncelleyecek
5. THE Platform SHALL onaylanan profilleri FA Network'te görünür hale getirecek

### Requirement 13: Admin Paneli - Bilgi Bankası Yönetimi

**User Story:** Bir admin olarak, bilgi bankasına yeni makaleler eklemek istiyorum, böylece kullanıcılara güncel bilgi sağlayabilirim.

#### Acceptance Criteria

1. THE Platform SHALL admin panelinde makale ekleme formu sunacak
2. THE Platform SHALL başlık, içerik ve kategori alanlarını zorunlu kılacak
3. WHEN admin makale kaydettiğinde, THE Platform SHALL makaleyi knowledge_base tablosuna ekleyecek
4. THE Platform SHALL mevcut makaleleri düzenleme ve silme imkanı sunacak
5. THE Platform SHALL makale içeriği için zengin metin editörü (rich text editor) sunacak

### Requirement 14: Admin Paneli - AI Eğitim Verisi Yönetimi

**User Story:** Bir admin olarak, kullanıcıların önerdiği AI eğitim verilerini inceleyip onaylamak istiyorum, böylece AI asistanın bilgi tabanını genişletebilirim.

#### Acceptance Criteria

1. THE Platform SHALL onaylandi_mi alanı false olan tüm AI eğitim verilerini listeleyecek
2. THE Platform SHALL her veri için soru ve cevap alanlarını gösterecek
3. WHEN admin "Onayla" butonuna tıkladığında, THE Platform SHALL onaylandi_mi alanını true yapacak
4. THE Platform SHALL onaylanan verileri AI asistanın bağlamına dahil edecek
5. THE Platform SHALL admin'e veri silme imkanı sunacak

### Requirement 15: Veritabanı Yapısı

**User Story:** Bir geliştirici olarak, Supabase'de doğru yapılandırılmış tablolara ihtiyacım var, böylece tüm platform özellikleri çalışabilir.

#### Acceptance Criteria

1. THE Platform SHALL profiles tablosunu şu alanlarla oluşturacak: id, user_id, ad_soyad, sehir, hikayem_text, yetkinlikler_cv, avatar_url, onay_durumu
2. THE Platform SHALL knowledge_base tablosunu şu alanlarla oluşturacak: id, baslik, icerik, kategori, goruntulenme_sayisi
3. THE Platform SHALL events tablosunu şu alanlarla oluşturacak: id, baslik, tarih, link, aciklama, aktif_mi
4. THE Platform SHALL ai_training_data tablosunu şu alanlarla oluşturacak: id, soru, cevap, onaylandi_mi
5. THE Platform SHALL tüm tablolarda uygun foreign key ve constraint'leri tanımlayacak

### Requirement 16: Performans ve Güvenlik

**User Story:** Bir kullanıcı olarak, hızlı yüklenen ve güvenli bir platform kullanmak istiyorum, böylece sorunsuz bir deneyim yaşayabilirim.

#### Acceptance Criteria

1. THE Platform SHALL her sayfayı 3 saniye içinde yükleyecek
2. THE Platform SHALL tüm API isteklerini HTTPS üzerinden gerçekleştirecek
3. THE Platform SHALL kullanıcı verilerini Supabase Row Level Security ile koruyacak
4. THE Platform SHALL API anahtarlarını environment variable'larda saklayacak
5. THE Platform SHALL XSS ve CSRF saldırılarına karşı koruma sağlayacak
