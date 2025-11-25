-- Bilgi Bankası Önerileri Tablosu
CREATE TABLE IF NOT EXISTS knowledge_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tip VARCHAR(20) NOT NULL CHECK (tip IN ('manuel', 'belge', 'link')),
  baslik VARCHAR(255) NOT NULL,
  icerik TEXT,
  link TEXT,
  dosya_url TEXT,
  aciklama TEXT,
  gonderen_email VARCHAR(255),
  durum VARCHAR(20) DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'reddedildi')),
  admin_notu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Politikaları
ALTER TABLE knowledge_suggestions ENABLE ROW LEVEL SECURITY;

-- Herkes öneri ekleyebilir
CREATE POLICY "Herkes öneri ekleyebilir" ON knowledge_suggestions
  FOR INSERT TO public
  WITH CHECK (true);

-- Sadece adminler görebilir (admin kontrolü uygulama seviyesinde yapılacak)
CREATE POLICY "Herkes kendi önerilerini görebilir" ON knowledge_suggestions
  FOR SELECT TO public
  USING (true);

-- Updated_at trigger
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
