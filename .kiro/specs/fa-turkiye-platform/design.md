# Database Design Document

## Giriş

Bu doküman, Friedrich Ataksi Türkiye Platformu için Supabase üzerinde çalışan PostgreSQL veritabanı şemasını tanımlar. Tüm tablolar, indeksler, foreign key'ler, constraint'ler ve Row Level Security (RLS) politikaları bu dokümanda belirtilmiştir.

## Teknoloji Stack

- **Veritabanı**: PostgreSQL (Supabase)
- **ORM**: Supabase Client
- **Authentication**: Supabase Auth (Google OAuth)
- **Storage**: Supabase Storage (avatar dosyaları için)

## Genel Kurallar

1. **ID Format**: Tüm primary key'ler UUID formatında olacak
2. **Timestamp**: Her tablo `created_at` ve `updated_at` alanlarına sahip olacak
3. **Soft Delete**: Silme işlemleri fiziksel silme yerine durum değişikliği ile yapılacak
4. **RLS**: Tüm tablolar Row Level Security ile korunacak
5. **Türkçe Alan Adları**: Veritabanı alanları Türkçe snake_case formatında olacak

---

## Tablolar

### 1. profiles

Kullanıcı profil bilgilerini saklar. FA hastası, yakını veya ilgilenen kişilerin kendi hikayelerini ve yetkinliklerini paylaşabildiği tablodur.

#### Şema

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_soyad TEXT NOT NULL,
  sehir TEXT NOT NULL,
  hikayem_text TEXT,
  yetkinlikler_cv TEXT,
  avatar_url TEXT,
  onay_durumu TEXT NOT NULL DEFAULT 'beklemede' CHECK (onay_durumu IN ('beklemede', 'onaylandı', 'reddedildi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Alanlar

| Alan | Tip | Zorunlu | Default | Açıklama |
|------|-----|---------|---------|----------|
| `id` | UUID | ✅ | gen_random_uuid() | Primary key |
| `user_id` | UUID | ✅ | - | Supabase Auth user ID (foreign key) |
| `ad_soyad` | TEXT | ✅ | - | Kullanıcının adı soyadı |
| `sehir` | TEXT | ✅ | - | Kullanıcının yaşadığı şehir |
| `hikayem_text` | TEXT | ❌ | NULL | Kullanıcının FA hikayesi (markdown destekli) |
| `yetkinlikler_cv` | TEXT | ❌ | NULL | Kullanıcının yetenekleri ve deneyimleri |
| `avatar_url` | TEXT | ❌ | NULL | Supabase Storage'daki avatar URL'i |
| `onay_durumu` | TEXT | ✅ | 'beklemede' | Profil onay durumu (enum) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | Oluşturulma zamanı |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Son güncellenme zamanı |

#### İndeksler

```sql
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_onay_durumu ON profiles(onay_durumu);
CREATE INDEX idx_profiles_sehir ON profiles(sehir);
CREATE UNIQUE INDEX idx_profiles_user_id_unique ON profiles(user_id);
```

#### RLS Politikaları

```sql
-- RLS'i etkinleştir
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Herkes onaylanmış profilleri görebilir
CREATE POLICY "Onaylanmış profiller herkese açık"
  ON profiles FOR SELECT
  USING (onay_durumu = 'onaylandı');

-- Kullanıcılar kendi profillerini görebilir
CREATE POLICY "Kullanıcılar kendi profillerini görebilir"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi profillerini oluşturabilir
CREATE POLICY "Kullanıcılar profil oluşturabilir"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Kullanıcılar kendi profillerini güncelleyebilir"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### Trigger'lar

```sql
-- updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. knowledge_base

Friedrich Ataksi hakkında kategorize edilmiş makalelerin saklandığı tablodur. Sadece admin bu tabloya yazabilir.

#### Şema

```sql
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baslik TEXT NOT NULL,
  icerik TEXT NOT NULL,
  kategori TEXT NOT NULL,
  goruntulenme_sayisi INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Alanlar

| Alan | Tip | Zorunlu | Default | Açıklama |
|------|-----|---------|---------|----------|
| `id` | UUID | ✅ | gen_random_uuid() | Primary key |
| `baslik` | TEXT | ✅ | - | Makale başlığı |
| `icerik` | TEXT | ✅ | - | Makale içeriği (markdown/HTML destekli) |
| `kategori` | TEXT | ✅ | - | Makale kategorisi (örn: "Tedavi", "Genetik", "Yaşam") |
| `goruntulenme_sayisi` | INTEGER | ✅ | 0 | Makale görüntülenme sayısı |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | Oluşturulma zamanı |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Son güncellenme zamanı |

#### İndeksler

```sql
CREATE INDEX idx_knowledge_base_kategori ON knowledge_base(kategori);
CREATE INDEX idx_knowledge_base_goruntulenme ON knowledge_base(goruntulenme_sayisi DESC);
CREATE INDEX idx_knowledge_base_created_at ON knowledge_base(created_at DESC);
```

#### RLS Politikaları

```sql
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Herkes makaleleri okuyabilir
CREATE POLICY "Makaleler herkese açık"
  ON knowledge_base FOR SELECT
  TO PUBLIC
  USING (true);

-- Sadece authenticated kullanıcılar ekleyebilir (admin kontrolü uygulama katmanında)
CREATE POLICY "Sadece giriş yapmış kullanıcılar ekleyebilir"
  ON knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar güncelleyebilir
CREATE POLICY "Sadece giriş yapmış kullanıcılar güncelleyebilir"
  ON knowledge_base FOR UPDATE
  TO authenticated
  USING (true);

-- Sadece authenticated kullanıcılar silebilir
CREATE POLICY "Sadece giriş yapmış kullanıcılar silebilir"
  ON knowledge_base FOR DELETE
  TO authenticated
  USING (true);
```

#### Trigger'lar

```sql
CREATE TRIGGER update_knowledge_base_updated_at BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 3. events

Topluluk için düzenlenen Zoom toplantıları ve etkinliklerin saklandığı tablodur.

#### Şema

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  baslik TEXT NOT NULL,
  tarih TIMESTAMPTZ NOT NULL,
  link TEXT NOT NULL,
  aciklama TEXT,
  aktif_mi BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Alanlar

| Alan | Tip | Zorunlu | Default | Açıklama |
|------|-----|---------|---------|----------|
| `id` | UUID | ✅ | gen_random_uuid() | Primary key |
| `baslik` | TEXT | ✅ | - | Etkinlik başlığı |
| `tarih` | TIMESTAMPTZ | ✅ | - | Etkinlik tarihi ve saati |
| `link` | TEXT | ✅ | - | Zoom veya etkinlik katılım linki |
| `aciklama` | TEXT | ❌ | NULL | Etkinlik açıklaması |
| `aktif_mi` | BOOLEAN | ✅ | true | Etkinliğin aktif olup olmadığı |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | Oluşturulma zamanı |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Son güncellenme zamanı |

#### İndeksler

```sql
CREATE INDEX idx_events_tarih ON events(tarih DESC);
CREATE INDEX idx_events_aktif_mi ON events(aktif_mi);
CREATE INDEX idx_events_aktif_tarih ON events(aktif_mi, tarih DESC);
```

#### RLS Politikaları

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Herkes aktif etkinlikleri görebilir
CREATE POLICY "Aktif etkinlikler herkese açık"
  ON events FOR SELECT
  TO PUBLIC
  USING (aktif_mi = true);

-- Authenticated kullanıcılar tüm etkinlikleri görebilir
CREATE POLICY "Giriş yapmış kullanıcılar tüm etkinlikleri görebilir"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Sadece authenticated kullanıcılar ekleyebilir
CREATE POLICY "Sadece giriş yapmış kullanıcılar etkinlik ekleyebilir"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Sadece authenticated kullanıcılar güncelleyebilir
CREATE POLICY "Sadece giriş yapmış kullanıcılar güncelleyebilir"
  ON events FOR UPDATE
  TO authenticated
  USING (true);

-- Sadece authenticated kullanıcılar silebilir
CREATE POLICY "Sadece giriş yapmış kullanıcılar silebilir"
  ON events FOR DELETE
  TO authenticated
  USING (true);
```

#### Trigger'lar

```sql
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 4. ai_training_data

Google Gemini AI asistanının eğitim verilerini saklar. Kullanıcılar öneri gönderebilir, admin onayladıktan sonra AI kullanır.

#### Şema

```sql
CREATE TABLE ai_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soru TEXT NOT NULL,
  cevap TEXT NOT NULL,
  onaylandi_mi BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

#### Alanlar

| Alan | Tip | Zorunlu | Default | Açıklama |
|------|-----|---------|---------|----------|
| `id` | UUID | ✅ | gen_random_uuid() | Primary key |
| `soru` | TEXT | ✅ | - | Kullanıcı sorusu veya konusu |
| `cevap` | TEXT | ✅ | - | AI'ın öğrenmesi gereken cevap |
| `onaylandi_mi` | BOOLEAN | ✅ | false | Admin onayı (true ise AI kullanır) |
| `created_at` | TIMESTAMPTZ | ✅ | NOW() | Oluşturulma zamanı |
| `updated_at` | TIMESTAMPTZ | ✅ | NOW() | Son güncellenme zamanı |

#### İndeksler

```sql
CREATE INDEX idx_ai_training_data_onaylandi_mi ON ai_training_data(onaylandi_mi);
CREATE INDEX idx_ai_training_data_created_at ON ai_training_data(created_at DESC);
```

#### RLS Politikaları

```sql
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;

-- Sadece onaylanmış veriler okunabilir (AI için)
CREATE POLICY "Onaylanmış AI verileri okunabilir"
  ON ai_training_data FOR SELECT
  TO PUBLIC
  USING (onaylandi_mi = true);

-- Authenticated kullanıcılar tüm verileri görebilir
CREATE POLICY "Giriş yapmış kullanıcılar tüm verileri görebilir"
  ON ai_training_data FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated kullanıcılar veri ekleyebilir
CREATE POLICY "Giriş yapmış kullanıcılar veri ekleyebilir"
  ON ai_training_data FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated kullanıcılar güncelleyebilir
CREATE POLICY "Giriş yapmış kullanıcılar güncelleyebilir"
  ON ai_training_data FOR UPDATE
  TO authenticated
  USING (true);

-- Authenticated kullanıcılar silebilir
CREATE POLICY "Giriş yapmış kullanıcılar silebilir"
  ON ai_training_data FOR DELETE
  TO authenticated
  USING (true);
```

#### Trigger'lar

```sql
CREATE TRIGGER update_ai_training_data_updated_at BEFORE UPDATE ON ai_training_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Supabase Storage Buckets

### avatars

Kullanıcı profil fotoğraflarını saklar.

#### Yapılandırma

```sql
-- Bucket oluşturma
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

#### Storage Policies

```sql
-- Herkes avatar'ları görebilir
CREATE POLICY "Avatar dosyaları herkese açık"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Kullanıcılar kendi avatar'larını yükleyebilir
CREATE POLICY "Kullanıcılar avatar yükleyebilir"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Kullanıcılar kendi avatar'larını güncelleyebilir
CREATE POLICY "Kullanıcılar kendi avatar'larını güncelleyebilir"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Kullanıcılar kendi avatar'larını silebilir
CREATE POLICY "Kullanıcılar kendi avatar'larını silebilir"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

#### Dosya Kuralları

- **Format**: JPG, PNG, WebP
- **Maksimum Boyut**: 5 MB
- **Naming Convention**: `{user_id}/{timestamp}.{extension}`
- **Public Access**: true

---

## İlişkiler (Relations)

### Foreign Keys

```
profiles.user_id → auth.users.id (CASCADE on DELETE)
```

### Logical Relations

- `knowledge_base.kategori` → Uygulama katmanında tanımlı kategori listesi
- `profiles.onay_durumu` → Enum: ['beklemede', 'onaylandı', 'reddedildi']

---

## Performans Optimizasyonları

### 1. Sık Kullanılan Sorgular İçin İndeksler

```sql
-- Profil arama (şehir ve onay durumu)
CREATE INDEX idx_profiles_composite ON profiles(sehir, onay_durumu) 
  WHERE onay_durumu = 'onaylandı';

-- Bilgi bankası kategoriye göre sıralama
CREATE INDEX idx_kb_kategori_views ON knowledge_base(kategori, goruntulenme_sayisi DESC);

-- Aktif etkinlikler sıralı
CREATE INDEX idx_events_active_upcoming ON events(tarih ASC) 
  WHERE aktif_mi = true AND tarih > NOW();
```

### 2. Partial Indexes

```sql
-- Sadece beklemede olan profiller için indeks (admin paneli)
CREATE INDEX idx_profiles_pending ON profiles(created_at DESC) 
  WHERE onay_durumu = 'beklemede';

-- Sadece onaylanmamış AI verileri için indeks (admin paneli)
CREATE INDEX idx_ai_data_pending ON ai_training_data(created_at DESC) 
  WHERE onaylandi_mi = false;
```

---

## Güvenlik Notları

### 1. Row Level Security (RLS)

Tüm tablolar RLS ile korunmuştur. Her tablo için okuma, yazma, güncelleme ve silme politikaları ayrı ayrı tanımlanmıştır.

### 2. Admin Yetkilendirmesi

Admin işlemleri (profil onaylama, makale ekleme) uygulama katmanında `ADMIN_PASSWORD` environment variable ile kontrol edilir. Veritabanı katmanında admin rolü yoktur, tüm authenticated kullanıcılar insert/update yapabilir ancak uygulama katmanında şifre kontrolü vardır.

### 3. SQL Injection Koruması

Supabase client parametreli sorgular kullanır, bu nedenle SQL injection riski minimumdur.

### 4. XSS Koruması

- `hikayem_text`, `icerik` gibi alanlar kullanıcı tarafından girildiğinde HTML sanitize edilmelidir
- React'ın built-in XSS koruması kullanılmalıdır
- Markdown render ederken güvenli kütüphaneler kullanılmalıdır

---

## Migration Stratejisi

### İlk Kurulum

```bash
# 1. Supabase projesinde SQL Editor'ü aç
# 2. Aşağıdaki sırayla tabloları oluştur:

# a) update_updated_at_column function
# b) profiles tablosu + indeksler + RLS + trigger
# c) knowledge_base tablosu + indeksler + RLS + trigger
# d) events tablosu + indeksler + RLS + trigger
# e) ai_training_data tablosu + indeksler + RLS + trigger
# f) Storage bucket ve policies
```

### Güncelleme Stratejisi

- Tüm schema değişiklikleri migration dosyaları olarak saklanmalıdır
- Migration dosyaları `supabase/migrations/` klasöründe tutulmalıdır
- Her migration geri alınabilir (rollback) olmalıdır

---

## Backup ve Recovery

### Otomatik Backup

Supabase otomatik olarak günlük backup alır (Pro plan).

### Manuel Backup

```bash
# pg_dump kullanarak manuel backup
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

### Point-in-Time Recovery

Supabase'in PITR özelliği ile herhangi bir zamana geri dönülebilir (Pro plan).

---

## Monitoring ve Logging

### Key Metrics

1. **Query Performance**: Slow query log'larını izle (> 1000ms)
2. **Connection Pool**: Aktif connection sayısını izle
3. **Storage Usage**: Avatar dosyalarının toplam boyutunu izle
4. **RLS Performance**: RLS policy'lerinin performans etkisini izle

### Alerts

- Connection pool %80'i aştığında
- Slow query sayısı artığında
- Storage quota'ya yaklaşıldığında

---

## Versiyon

**Document Version**: 1.0  
**Last Updated**: 2025-11-20  
**Database Version**: PostgreSQL 15 (Supabase)  
**Author**: FA Platform Architect
