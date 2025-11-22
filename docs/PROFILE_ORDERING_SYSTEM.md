# FA Network Profil Sıralama Sistemi

## Yapılan Değişiklikler

### 1. Veritabanı Değişiklikleri
- `profiles` tablosuna `display_order` (INTEGER, nullable) sütunu eklendi
- Mevcut profiller için otomatik sıra numaraları atandı (created_at'e göre)
- Yeni profiller için otomatik sıra numarası atama trigger'ı oluşturuldu
- Performans için index eklendi

### 2. Type Definitions (types/database.ts)
- Profile Row, Insert ve Update tiplerine `display_order` alanı eklendi

### 3. Network Sayfası (app/(public)/network/page.tsx)
- Profiller artık önce `display_order`'a göre (küçükten büyüğe)
- Sonra `created_at`'e göre (eskiden yeniye) sıralanıyor
- İlk oluşturulan profil en üstte görünür

### 4. Admin Paneli (components/admin/ProfileManagement.tsx)
- **Yeni Özellikler:**
  - Yukarı Taşı (↑) butonu
  - Aşağı Taşı (↓) butonu
  - Sadece "Onaylananlar" tabında görünür
  - İlk profil için yukarı, son profil için aşağı butonu devre dışı

- **Sıralama Mantığı:**
  - Profiller display_order ve created_at'e göre sıralanır
  - Yukarı/aşağı butonları ile profillerin display_order değerleri swap edilir
  - Her değişiklik sonrası sayfa otomatik yenilenir

## Kullanım

### Veritabanı Migration'ı Çalıştırma
1. Supabase Dashboard'a gidin
2. SQL Editor'ı açın
3. `migrations/add_display_order_to_profiles.sql` dosyasının içeriğini kopyalayın
4. SQL Editor'a yapıştırın ve çalıştırın

### Admin Panelinde Sıralama
1. Admin paneline giriş yapın
2. "Profil Yönetimi" bölümüne gidin
3. "Onaylananlar" tabını seçin
4. Her profilin yanındaki ↑ ve ↓ butonları ile sırayı değiştirin

## Teknik Detaylar

### Display Order Değerleri
- Null değerler en sona atılır (nullsFirst: false)
- Yeni profiller otomatik olarak en büyük değer + 1 alır
- Manuel sıralama yapıldığında değerler swap edilir

### Sıralama Algoritması
```typescript
.sort((a, b) => {
    // Önce display_order'a göre
    const orderA = a.display_order ?? 999999;
    const orderB = b.display_order ?? 999999;
    if (orderA !== orderB) {
        return orderA - orderB;
    }
    // Sonra created_at'e göre
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
})
```

## Notlar
- Sıralama sadece onaylanan profiller için çalışır
- Beklemedeki ve reddedilen profiller created_at'e göre sıralanır
- Display order değerleri unique olmak zorunda değildir
- Aynı display_order değerine sahip profiller created_at'e göre sıralanır
