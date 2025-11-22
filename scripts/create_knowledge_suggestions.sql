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
