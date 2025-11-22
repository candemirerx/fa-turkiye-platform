# 🤖 Chatbot Ayarlar Sistemi - Kurulum Rehberi

## 🎨 Yeni Özellikler

### ✨ Modern Chatbot Arayüzü
- **Ferah Tasarım**: Gradient renkler, yumuşak gölgeler, modern border-radius
- **Ayarlar Butonu**: Header'da kolay erişilebilir ayarlar ikonu
- **Responsive**: Mobil ve masaüstünde mükemmel görünüm
- **Animasyonlar**: Smooth geçişler ve hover efektleri

### ⚙️ Ayarlar Ekranı (3 Sekme)

#### 1. 📋 Bilgilendirme
- **Sarı Uyarı Kutusu**: Tıbbi sorumluluk reddi
- **AI Hakkında**: Asistanın yetenekleri
- **Kullanım Kılavuzu**: Nasıl kullanılır

#### 2. 🧠 AI Eğitimi
- **Soru-Cevap Formu**: Kullanıcılar eğitim verisi gönderebilir
- **Admin Onayı**: Gönderilen veriler admin onayından sonra aktif olur
- **Başarı Mesajları**: Anlık geri bildirim

#### 3. 💡 Öneriler
- **Bilgi Bankası Önerileri**: Kullanıcılar konu önerebilir
- **Kaynak Önerileri**: Eklenecek kaynaklar için öneriler
- **İyileştirme Fikirleri**: Platform geliştirme önerileri

---

## 🚀 KURULUM

### Adım 1: SQL Migration

Supabase Dashboard → SQL Editor'de çalıştırın:

```sql
-- Bilgi bankası önerileri tablosu
CREATE TABLE IF NOT EXISTS knowledge_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oneri TEXT NOT NULL,
  durum TEXT DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'reddedildi')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at otomatik güncelleme trigger
CREATE OR REPLACE FUNCTION update_knowledge_suggestions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_knowledge_suggestions_updated_at
BEFORE UPDATE ON knowledge_suggestions
FOR EACH ROW
EXECUTE FUNCTION update_knowledge_suggestions_updated_at();

-- Index oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_knowledge_suggestions_durum ON knowledge_suggestions(durum);
CREATE INDEX IF NOT EXISTS idx_knowledge_suggestions_created_at ON knowledge_suggestions(created_at DESC);
```

### Adım 2: Test Edin

1. Ana sayfada chatbot'u açın
2. Sağ üstteki **⚙️ Ayarlar** butonuna tıklayın
3. 3 sekmeyi test edin:
   - Bilgilendirme (sarı uyarı kutusunu görün)
   - AI Eğitimi (soru-cevap gönderin)
   - Öneriler (öneri gönderin)

---

## 📱 KULLANICI DENEYİMİ

### Chatbot Ana Ekran

**Özellikler:**
- ✨ Gradient header (purple → pink)
- 🎨 Ferah mesaj balonları
- 💬 Smooth scroll
- ⌨️ Büyük dokunma alanları (mobil için)
- 🔄 Loading animasyonu

**Butonlar:**
- ⚙️ Ayarlar (sağ üst)
- ❌ Kapat (sağ üst)

### Ayarlar Ekranı

**Header:**
- ← Geri butonu (chatbot'a dön)
- ❌ Kapat butonu

**Sekmeler:**
1. **📋 Bilgilendirme**
   - Sarı uyarı kutusu (tıbbi sorumluluk)
   - AI hakkında bilgi
   - Kullanım kılavuzu

2. **🧠 AI Eğitimi**
   - Soru textarea
   - Cevap textarea
   - Gönder butonu
   - Başarı/hata mesajları

3. **💡 Öneriler**
   - Öneri textarea
   - Gönder butonu
   - Başarı/hata mesajları

---

## 🎨 TASARIM ÖZELLİKLERİ

### Renkler

**Chatbot:**
- Header: `from-purple-600 via-purple-500 to-pink-500`
- Kullanıcı mesajları: `from-purple-600 to-purple-500`
- AI mesajları: `bg-white border-gray-200`
- Gönder butonu: `from-purple-600 to-purple-500`

**Ayarlar:**
- Header: `from-indigo-600 via-purple-600 to-pink-600`
- Bilgilendirme: Amber (sarı)
- AI Eğitimi: Blue (mavi)
- Öneriler: Green (yeşil)

### Animasyonlar

- `hover:scale-95` - Buton basma efekti
- `transition-all` - Smooth geçişler
- `animate-bounce` - Loading noktaları
- `backdrop-blur-sm` - Blur efektleri

### Responsive

- Mobil: `w-full h-[100dvh]`
- Desktop: `sm:max-w-lg sm:h-[700px] sm:rounded-2xl`
- Padding: `p-4 sm:p-5`
- Font: `text-sm sm:text-base`

---

## 🔧 API ENDPOINT'LERİ

### AI Eğitim Verisi Gönderimi

**Endpoint:** `POST /api/ai-training`

**Body:**
```json
{
  "soru": "Friedrich Ataksi nedir?",
  "cevap": "Friedrich Ataksi, kalıtsal bir sinir sistemi hastalığıdır..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Eğitim veriniz kaydedildi"
}
```

### Bilgi Bankası Önerisi

**Endpoint:** `POST /api/knowledge-suggestions`

**Body:**
```json
{
  "oneri": "FA'da beslenme konusunda bir makale eklenebilir"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Öneriniz başarıyla kaydedildi"
}
```

---

## 📊 VERİTABANI YAPISI

### `knowledge_suggestions` Tablosu

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| id | UUID | Primary key |
| oneri | TEXT | Öneri metni |
| durum | TEXT | 'beklemede', 'onaylandi', 'reddedildi' |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |
| updated_at | TIMESTAMPTZ | Güncellenme tarihi |

**Indexler:**
- `idx_knowledge_suggestions_durum` - Durum filtreleme için
- `idx_knowledge_suggestions_created_at` - Tarih sıralama için

---

## 💡 KULLANIM ÖRNEKLERİ

### Kullanıcı Akışı 1: AI Eğitimi

1. Chatbot'u aç
2. Ayarlar butonuna tıkla
3. "AI Eğitimi" sekmesine geç
4. Soru yaz: "FA'da fizik tedavi önemli mi?"
5. Cevap yaz: "Evet, fizik tedavi FA hastalarında..."
6. Gönder'e bas
7. Başarı mesajı gör
8. Form temizlenir

### Kullanıcı Akışı 2: Öneri Gönderme

1. Chatbot'u aç
2. Ayarlar butonuna tıkla
3. "Öneriler" sekmesine geç
4. Öneri yaz: "FA'da beslenme rehberi eklenebilir"
5. Gönder'e bas
6. Başarı mesajı gör
7. Form temizlenir

---

## 🎯 ÖZELLİKLER

### ✅ Tamamlanan

- [x] Modern chatbot arayüzü
- [x] Ayarlar butonu
- [x] 3 sekmeli ayarlar ekranı
- [x] Sarı uyarı kutusu (ayarlarda)
- [x] AI eğitim verisi gönderimi
- [x] Bilgi bankası önerileri
- [x] Responsive tasarım
- [x] Animasyonlar ve geçişler
- [x] Form validasyonu
- [x] Başarı/hata mesajları
- [x] API endpoint'leri
- [x] Veritabanı tablosu

### 🔮 Gelecek İyileştirmeler

- [ ] Admin panelinde öneri yönetimi
- [ ] Öneri durumu bildirimi
- [ ] Dosya yükleme (eğitim verisi için)
- [ ] Öneri kategorileri
- [ ] Kullanıcı öneri geçmişi

---

## 🎨 EKRAN GÖRÜNTÜLERİ

### Chatbot Ana Ekran
- Gradient header
- Ferah mesaj alanı
- Modern input
- Ayarlar butonu

### Ayarlar - Bilgilendirme
- Sarı uyarı kutusu
- AI hakkında bilgi
- Kullanım kılavuzu

### Ayarlar - AI Eğitimi
- Soru-cevap formu
- Gönder butonu
- Başarı mesajı

### Ayarlar - Öneriler
- Öneri formu
- Gönder butonu
- Başarı mesajı

---

## 🚀 BAŞARIYLA TAMAMLANDI!

Chatbot artık modern, kullanıcı dostu ve katkı odaklı! 🎉

**Önemli:** SQL migration'ını çalıştırmayı unutmayın!
