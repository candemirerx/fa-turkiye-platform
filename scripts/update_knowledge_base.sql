-- Bilgi bankası tablosuna yeni alanlar ekle
ALTER TABLE knowledge_base
ADD COLUMN IF NOT EXISTS icerik_tipi TEXT DEFAULT 'manuel' CHECK (icerik_tipi IN ('manuel', 'link', 'dosya')),
ADD COLUMN IF NOT EXISTS kaynak_url TEXT,
ADD COLUMN IF NOT EXISTS dosya_adi TEXT,
ADD COLUMN IF NOT EXISTS ozet TEXT;

-- Yorum ekle
COMMENT ON COLUMN knowledge_base.icerik_tipi IS 'İçerik türü: manuel, link veya dosya';
COMMENT ON COLUMN knowledge_base.kaynak_url IS 'Link türü içerikler için kaynak URL';
COMMENT ON COLUMN knowledge_base.dosya_adi IS 'Dosya türü içerikler için dosya adı';
COMMENT ON COLUMN knowledge_base.ozet IS 'Link ve dosya içerikleri için özet';
