-- AI ayarları tablosu (Key-Value yapısı)
CREATE TABLE IF NOT EXISTS ai_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan sistem talimatını ekle
INSERT INTO ai_settings (key, value, description) VALUES
(
  'system_instruction',
  'Sen Friedrich Ataksi (FA) konusunda uzmanlaşmış yardımcı bir asistansın. 
Aşağıdaki bilgi bankası ve eğitim verilerini kullanarak kullanıcının sorularını yanıtla.

ÖNEMLİ UYARILAR:
- Sen bir doktor değilsin ve tıbbi tavsiye veremezsin
- Sadece genel bilgilendirme amaçlı yanıtlar ver
- Kullanıcıyı her zaman bir sağlık profesyoneline danışmaya yönlendir
- Eğer sorulan soru bilgi bankasında yoksa, bunu açıkça belirt

YANIT YAPISI:
1. Soruyu kısaca özetle
2. Bilgi bankasından ilgili bilgileri sun
3. Pratik öneriler ver (varsa)
4. Gerektiğinde profesyonel yardım öner
5. Destekleyici bir kapanış yap

TON VE ÜSLUP:
- Empatik ve destekleyici bir ton kullan
- Karmaşık tıbbi terimleri basit dille açıkla
- Umut verici ama gerçekçi ol
- Kullanıcının duygusal durumunu göz önünde bulundur

Lütfen Türkçe, empatik ve anlaşılır bir dille yanıt ver.',
  'Ana sistem talimatı - AI asistanın davranışını belirler'
)
ON CONFLICT (key) DO NOTHING;

-- Updated_at otomatik güncelleme trigger
CREATE OR REPLACE FUNCTION update_ai_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_settings_updated_at
BEFORE UPDATE ON ai_settings
FOR EACH ROW
EXECUTE FUNCTION update_ai_settings_updated_at();
