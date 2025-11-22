-- Migration: Add display_order column to profiles table
-- Bu migration'ı Supabase SQL Editor'de çalıştırın

-- 1. display_order sütununu ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- 2. Mevcut profiller için display_order değerlerini created_at'e göre ata
-- (İlk oluşturulan profil 1, ikinci 2, vs.)
WITH ordered_profiles AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM profiles
  WHERE display_order IS NULL
)
UPDATE profiles
SET display_order = ordered_profiles.row_num
FROM ordered_profiles
WHERE profiles.id = ordered_profiles.id;

-- 3. Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_display_order 
ON profiles(display_order);

-- 4. Yeni profiller için otomatik display_order atama fonksiyonu
CREATE OR REPLACE FUNCTION set_profile_display_order()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.display_order IS NULL THEN
    SELECT COALESCE(MAX(display_order), 0) + 1 
    INTO NEW.display_order 
    FROM profiles;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger oluştur
DROP TRIGGER IF EXISTS trigger_set_profile_display_order ON profiles;
CREATE TRIGGER trigger_set_profile_display_order
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_profile_display_order();
