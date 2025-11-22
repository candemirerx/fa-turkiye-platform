# 🤖 AI Sistem Talimatı Yönetimi - Kurulum Rehberi

## 📋 Genel Bakış

Bu sistem, yapay zeka asistanın davranışını kontrol eden sistem talimatlarını (system prompt) veritabanından yönetmenizi sağlar. Artık kod değiştirmeden AI'nın davranışını admin panelinden düzenleyebilirsiniz!

---

## 🚀 KURULUM ADIMLARI

### Adım 1: SQL Migration'ı Çalıştırın

**ÖNEMLİ:** Bu adımı mutlaka yapmalısınız!

1. Supabase Dashboard'a gidin (https://supabase.com)
2. Projenizi seçin
3. Sol menüden **SQL Editor**'ü açın
4. Aşağıdaki dosyanın içeriğini kopyalayıp çalıştırın:

```
scripts/create_ai_settings.sql
```

**Bu SQL kodu şunları yapar:**
- ✅ `ai_settings` tablosunu oluşturur (key-value yapısı)
- ✅ Varsayılan sistem talimatını ekler
- ✅ Otomatik güncelleme trigger'ını ayarlar

### Adım 2: Sayfayı Test Edin

1. Tarayıcınızda `/admin` sayfasına gidin
2. Admin şifresi ile giriş yapın: **220309**
3. **AI Eğitim** sekmesine tıklayın
4. "Sistem Talimatı" bölümünü göreceksiniz

---

## 🎯 KULLANIM

### Sistem Talimatını Düzenleme

1. **AI Eğitim** sayfasında geniş metin kutusunu göreceksiniz
2. Mevcut sistem talimatı otomatik olarak yüklenir
3. İstediğiniz değişiklikleri yapın
4. **Kaydet** butonuna tıklayın
5. ✅ Değişiklikler **anında** etkili olur!

### Sistem Talimatı Nedir?

Sistem talimatı (System Prompt), yapay zekanın:
- 🎭 **Kişiliğini** (empatik, profesyonel, vb.)
- 📝 **Yanıt formatını** (nasıl yapılandırılacağı)
- 🎨 **Ton ve üslubunu** (resmi, samimi, vb.)
- 🛡️ **Güvenlik kurallarını** (ne yapmaması gerektiği)
- 🎯 **Uzmanlık alanını** (Friedrich Ataksi)

belirler.

---

## 📊 TEKNİK DETAYLAR

### Veritabanı Yapısı

**Tablo:** `ai_settings`

| Sütun | Tip | Açıklama |
|-------|-----|----------|
| key | TEXT (PK) | Ayar anahtarı (örn: 'system_instruction') |
| value | TEXT | Ayar değeri (sistem talimatı metni) |
| description | TEXT | Açıklama |
| created_at | TIMESTAMPTZ | Oluşturulma tarihi |
| updated_at | TIMESTAMPTZ | Son güncelleme tarihi |

### API Endpoint'leri

**Sistem Talimatını Getir:**
```
GET /api/admin/system-instruction
```

**Sistem Talimatını Güncelle:**
```
PUT /api/admin/system-instruction
Body: { "systemInstruction": "yeni talimat..." }
```

### Chatbot Entegrasyonu

Chatbot her yanıt üretirken:

1. ✅ Veritabanından sistem talimatını çeker (`ai_settings` tablosu)
2. ✅ Bilgi bankası verilerini ekler
3. ✅ Eğitim verilerini (SSS) ekler
4. ✅ Hepsini birleştirip Gemini API'ye gönderir
5. ✅ Yanıtı kullanıcıya döner

**Fallback Mekanizması:**
Eğer veritabanından çekilemezse, kod içindeki varsayılan talimat kullanılır.

---

## 🎨 ARAYÜZ ÖZELLİKLERİ

### ✨ Kullanıcı Dostu Tasarım

- 📱 **Mobil Uyumlu**: Tüm ekran boyutlarında çalışır
- 💾 **Otomatik Kayıt Kontrolü**: Kaydedilmemiş değişiklikleri gösterir
- ✅ **Başarı/Hata Mesajları**: Anında geri bildirim
- 📊 **Karakter Sayacı**: Talimat uzunluğunu gösterir
- 💡 **İpuçları**: Nasıl yazılacağına dair öneriler

### 🎯 İstatistik Kartları

Sayfanın üstünde 3 kart görürsünüz:
1. **Sistem Talimatı**: Aktif durumu
2. **Bekleyen Veri**: Onay bekleyen eğitim verileri
3. **Onaylı Veri**: Aktif eğitim verileri

---

## 💡 İPUÇLARI

### İyi Bir Sistem Talimatı Nasıl Yazılır?

1. **Net ve Açık Olun**
   ```
   ✅ İYİ: "Sen Friedrich Ataksi konusunda uzman bir asistansın"
   ❌ KÖTÜ: "Sen bir asistansın"
   ```

2. **Sınırları Belirleyin**
   ```
   ✅ İYİ: "Sen bir doktor değilsin ve tıbbi tavsiye veremezsin"
   ❌ KÖTÜ: "Sağlık konusunda yardım et"
   ```

3. **Yanıt Formatını Tanımlayın**
   ```
   ✅ İYİ: "Yanıtlarını şu yapıda ver: 1. Özet, 2. Detay, 3. Öneri"
   ❌ KÖTÜ: "Güzel yanıtlar ver"
   ```

4. **Ton ve Üslubu Açıklayın**
   ```
   ✅ İYİ: "Empatik, destekleyici ve anlaşılır bir dil kullan"
   ❌ KÖTÜ: "İyi konuş"
   ```

### Örnek Sistem Talimatı

```
Sen Friedrich Ataksi (FA) konusunda uzmanlaşmış yardımcı bir asistansın.

ROLÜN:
- FA hastaları ve yakınlarına destek olmak
- Bilgi bankasındaki bilgileri paylaşmak
- Duygusal destek sağlamak

SINIRLAR:
- Tıbbi teşhis koyamazsın
- İlaç öneremezsin
- Tedavi planlayamazsın
- Doktor tavsiyesinin yerine geçemezsin

YANIT YAPISI:
1. Soruyu özetle
2. İlgili bilgileri sun
3. Pratik öneriler ver
4. Profesyonel yardım öner
5. Destekleyici kapat

TON VE ÜSLUP:
- Empatik ve sıcak
- Basit ve anlaşılır
- Umut verici ama gerçekçi
- Saygılı ve destekleyici

Türkçe yanıt ver.
```

---

## 🔧 SORUN GİDERME

### Sistem Talimatı Görünmüyor

**Çözüm:**
1. SQL migration'ı çalıştırdığınızdan emin olun
2. Tarayıcı konsolunu açın (F12)
3. Network sekmesinde `/api/admin/system-instruction` isteğini kontrol edin
4. Supabase bağlantısını test edin

### Değişiklikler Etkili Olmuyor

**Çözüm:**
1. "Kaydet" butonuna bastığınızdan emin olun
2. Başarı mesajını gördüğünüzü kontrol edin
3. Tarayıcı önbelleğini temizleyin (Ctrl + Shift + R)
4. Chatbot'u yeniden test edin

### Varsayılan Talimat Kullanılıyor

**Çözüm:**
1. Veritabanında `ai_settings` tablosunu kontrol edin
2. `key = 'system_instruction'` kaydının olduğundan emin olun
3. Terminal loglarında "Sistem talimatı kaynağı: Veritabanı" yazısını arayın

---

## 📝 NOTLAR

- ⚡ Değişiklikler **anında** etkili olur, yeniden başlatma gerekmez
- 💾 Tüm değişiklikler veritabanında saklanır
- 📅 `updated_at` alanı otomatik güncellenir
- 🔒 Sadece admin kullanıcılar düzenleyebilir

---

## 🎉 BAŞARIYLA TAMAMLANDI!

Artık AI asistanınızın davranışını kod değiştirmeden yönetebilirsiniz! 🚀

Sorularınız için: candemirerx@gmail.com
