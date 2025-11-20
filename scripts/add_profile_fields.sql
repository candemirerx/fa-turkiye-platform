-- FA Network Profil Formu - Yeni Alanlar Migration
-- Bu scripti Supabase Dashboard > SQL Editor'de çalıştırın

-- Yaş alanı ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS yas INTEGER;

-- Yakınlık derecesi alanı ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS yakinlik_derecesi TEXT;

-- Yaş için constraint ekle (0-120 arası)
ALTER TABLE profiles 
ADD CONSTRAINT yas_check CHECK (yas IS NULL OR (yas >= 0 AND yas <= 120));

-- Başarılı mesajı
SELECT 'Migration başarıyla tamamlandı! Yeni alanlar eklendi: yas, yakinlik_derecesi' as message;
