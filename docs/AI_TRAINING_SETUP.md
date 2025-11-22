# AI Eğitim Yönetim Sistemi - Kurulum Talimatları

## Yeni Özellikler

### 1. Sistem Talimatları Yönetimi
- Yapay zekanın davranışını kontrol eden sistem talimatlarını düzenleyebilirsiniz
- Talimatları aktif/pasif yapabilirsiniz
- Gerçek zamanlı düzenleme ile anında etkili olur

### 2. Gelişmiş Eğitim Veri Yönetimi
- Bekleyen, onaylı ve tüm eğitim verilerini sekmeli arayüzle görüntüleyin
- İstatistik kartları ile hızlı genel bakış
- Mobil uyumlu tasarım

### 3. Veri Dışa Aktarma
- Tüm eğitim verilerini ve sistem talimatlarını JSON formatında indirin
- Yedekleme ve analiz için kullanın

## Veritabanı Kurulumu

### Adım 1: SQL Migration'ı Çalıştırın

Supabase Dashboard'unuzda SQL Editor'e gidin ve aşağıdaki dosyayı çalıştırın:

```
scripts/create_ai_system_instructions.sql
```

Bu işlem:
- `ai_system_instructions` tablosunu oluşturur
- Varsayılan sistem talimatlarını ekler
- Otomatik güncelleme trigger'ını ayarlar

### Adım 2: Veritabanı Tiplerini Güncelleyin

`types/database.ts` dosyası zaten güncellenmiştir. Herhangi bir değişiklik yapmanıza gerek yok.

## Kullanım

### Admin Paneline Erişim

1. `/admin` sayfasına gidin
2. Admin şifresi ile giriş yapın (220309)
3. "AI Eğitim" sekmesine tıklayın

### Sistem Talimatlarını Düzenleme

1. **Sistem Talimatları** sekmesinde talimatları görebilirsiniz
2. **Düzenle** butonuna tıklayarak talimatı değiştirin
3. **Kaydet** butonuna basın - değişiklikler anında etkili olur
4. **Toggle** butonu ile talimatı aktif/pasif yapabilirsiniz

### Eğitim Verilerini Yönetme

1. **Bekleyen Veriler** sekmesinde onay bekleyen verileri görün
2. **Onayla** veya **Sil** butonlarını kullanın
3. **Onaylı Veriler** sekmesinde onaylanmış verileri görüntüleyin

### Veri Dışa Aktarma

1. **Tüm Verileri Dışa Aktar** butonuna tıklayın
2. JSON dosyası otomatik olarak indirilir
3. Dosya şunları içerir:
   - Tüm sistem talimatları
   - Onaylanmış eğitim verileri
   - İstatistikler

## Mobil Uyumluluk

Tüm admin paneli mobil cihazlarda sorunsuz çalışır:
- Responsive grid layout
- Mobil uyumlu butonlar
- Yatay kaydırmalı navigasyon
- Dokunmatik optimizasyonlar

## API Endpoint'leri

### Sistem Talimatları
- `GET /api/admin/ai-instructions` - Tüm talimatları getir
- `PUT /api/admin/ai-instructions` - Talimat güncelle
- `POST /api/admin/ai-instructions` - Yeni talimat ekle

### Veri Dışa Aktarma
- `GET /api/admin/export-training` - JSON formatında veri indir

## Yapay Zeka Entegrasyonu

Sistem talimatları otomatik olarak yapay zeka yanıtlarında kullanılır:

1. Kullanıcı soru sorar
2. Sistem aktif talimatları veritabanından çeker
3. Talimatlar + bilgi bankası + eğitim verileri birleştirilir
4. Gemini API'ye gönderilir
5. Yanıt kullanıcıya döner

## Sorun Giderme

### Talimatlar Görünmüyor
- SQL migration'ın çalıştırıldığından emin olun
- Supabase bağlantısını kontrol edin

### Değişiklikler Etkili Olmuyor
- Tarayıcı önbelleğini temizleyin
- Sayfayı yenileyin
- Talimatın "aktif" olduğundan emin olun

### Mobil Görünüm Sorunları
- Tarayıcıyı güncelleyin
- Responsive mod'da test edin (F12 > Device Toolbar)

## Güvenlik Notları

- Sistem talimatları sadece admin kullanıcılar tarafından düzenlenebilir
- Tüm değişiklikler veritabanında loglanır (created_at, updated_at)
- API endpoint'leri admin authentication gerektirir
