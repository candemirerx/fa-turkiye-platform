# Bilgi Bankası Yönetim Sistemi

## 📚 Genel Bakış

Bilgi bankası sistemi artık **3 farklı içerik türünü** desteklemektedir:
1. **📝 Manuel**: Doğrudan metin girişi
2. **🔗 Link**: Harici kaynak linkleri
3. **📎 Dosya**: Dosya yüklemeleri

## 🗄️ Veritabanı Değişiklikleri

### Yeni Alanlar

`knowledge_base` tablosuna eklenen alanlar:

```sql
- icerik_tipi: 'manuel' | 'link' | 'dosya'
- kaynak_url: TEXT (Link türü için)
- dosya_adi: TEXT (Dosya türü için)
- ozet: TEXT (Link ve dosya için özet)
```

### Migration

SQL migration dosyası: `scripts/update_knowledge_base.sql`

```bash
# Supabase SQL Editor'da çalıştırın
```

## 🎯 Özellikler

### 1. Manuel İçerik
- Doğrudan metin girişi
- Tam kontrol
- Klasik makale formatı

### 2. Link İçerik
- **Kaynak URL**: Harici kaynak linki
- **İçerik** (Opsiyonel): Link hakkında ek bilgi
- **Özet**: Linkin kısa özeti
- Kullanıcılar linke tıklayabilir

### 3. Dosya İçerik
- **Dosya Yükleme**: TXT, PDF, Word, Markdown
- **Otomatik İçerik Okuma**: Dosya içeriği otomatik okunur
- **Özet**: Dosyanın kısa özeti
- Dosya adı saklanır

## 📊 Kullanıcı Önerileri

### Öneri Sistemi

Kullanıcılar chatbot ayarlarından bilgi bankası önerileri gönderebilir:

1. **Chatbot** → **Ayarlar** → **Öneriler**
2. Öneri metni yazılır
3. "Öneri Gönder" butonuna basılır

### Admin İncelemesi

Admin panelinde öneriler incelenir:

1. **Bilgi Bankası** → **Öneriler** sekmesi
2. Bekleyen öneriler listelenir
3. **✓ Onayla** veya **✗ Reddet**

## 🎨 Kullanıcı Arayüzü

### İçerik Türü Seçimi

```
┌─────────┬─────────┬─────────┐
│ 📝 Manuel│ 🔗 Link │ 📎 Dosya│
└─────────┴─────────┴─────────┘
```

### Makale Kartları

Her makale kartında:
- İçerik türü ikonu
- İçerik türü badge'i
- Link (varsa, tıklanabilir)
- Dosya adı (varsa)
- Özet (varsa, italik)
- Görüntülenme sayısı

## 📝 Örnek Kullanım

### Manuel Makale

```
Başlık: Friedrich Ataksi Nedir?
Kategori: Genel Bilgi
İçerik: Friedrich Ataksi kalıtsal bir hastalıktır...
```

### Link Makalesi

```
Başlık: FARA Araştırması 2024
Kategori: Araştırmalar
Kaynak URL: https://example.com/fara-2024
İçerik: (Opsiyonel) Ek bilgiler...
Özet: 2024 yılı FARA araştırma sonuçları
```

### Dosya Makalesi

```
Başlık: FA Beslenme Rehberi
Kategori: Beslenme
Dosya: fa-beslenme.pdf
Özet: Friedrich Ataksi hastaları için beslenme önerileri
```

## 🔄 Veri Akışı

### Kullanıcı → Admin

1. Kullanıcı chatbot'tan öneri gönderir
2. `knowledge_suggestions` tablosuna kaydedilir
3. Durum: `beklemede`
4. Admin panelinde görünür

### Admin → Bilgi Bankası

1. Admin öneriyi inceler
2. Onaylar veya reddeder
3. Onaylanan öneriler manuel olarak bilgi bankasına eklenebilir

## 🎯 Gelecek İyileştirmeler

- [ ] Dosya storage entegrasyonu (Supabase Storage)
- [ ] PDF içerik çıkarma
- [ ] Otomatik link önizleme
- [ ] Toplu içe aktarma
- [ ] Makale düzenleme
- [ ] Kategori yönetimi
- [ ] Arama ve filtreleme

## 🚀 Kurulum

### 1. SQL Migration

```sql
-- Supabase SQL Editor'da çalıştırın
-- scripts/update_knowledge_base.sql
```

### 2. Type Güncellemeleri

Types otomatik güncellendi:
- `types/database.ts`

### 3. Bileşenler

Yeni/Güncellenen dosyalar:
- `components/admin/ArticleEditor.tsx` (Yenilendi)
- `app/admin/bilgi-bankasi/page.tsx` (Yenilendi)

## 📖 API Kullanımı

### Makale Ekleme

```typescript
const { error } = await supabase
  .from('knowledge_base')
  .insert({
    baslik: 'Başlık',
    icerik: 'İçerik',
    kategori: 'Kategori',
    icerik_tipi: 'link', // 'manuel' | 'link' | 'dosya'
    kaynak_url: 'https://...', // Link için
    dosya_adi: 'dosya.pdf', // Dosya için
    ozet: 'Özet metni', // Opsiyonel
  });
```

### Öneri Listeleme

```typescript
const { data } = await supabase
  .from('knowledge_suggestions')
  .select('*')
  .eq('durum', 'beklemede')
  .order('created_at', { ascending: false });
```

## ✅ Tamamlandı!

Bilgi bankası sistemi artık çok daha esnek ve güçlü! 🎉
