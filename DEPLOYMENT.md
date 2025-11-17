# Deployment Rehberi

## Vercel'e Deploy

### 1. Vercel Hesabı Oluşturun
- [vercel.com](https://vercel.com) adresinden ücretsiz hesap oluşturun
- GitHub hesabınızı bağlayın

### 2. Projeyi GitHub'a Push Edin
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 3. Vercel'de Proje Oluşturun
- Vercel dashboard'da "New Project" tıklayın
- GitHub repository'nizi seçin
- Framework Preset: Next.js (otomatik algılanır)

### 4. Environment Variables Ekleyin
Vercel dashboard'da Settings > Environment Variables bölümünden:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-key
ADMIN_PASSWORD=220309
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 5. Deploy Edin
- "Deploy" butonuna tıklayın
- İlk deploy 2-3 dakika sürer
- Deploy tamamlandığında otomatik URL alırsınız

## Supabase Production Setup

### 1. Google OAuth Yapılandırması
1. Supabase Dashboard > Authentication > Providers > Google
2. "Enabled" seçeneğini aktif edin
3. Google Cloud Console'dan OAuth credentials oluşturun:
   - Authorized redirect URIs: `https://your-project.supabase.co/auth/v1/callback`
4. Client ID ve Client Secret'ı Supabase'e ekleyin

### 2. Storage Bucket Oluşturma
1. Supabase Dashboard > Storage
2. "New bucket" tıklayın
3. Bucket adı: `profiles`
4. Public bucket olarak işaretleyin
5. Policies ekleyin:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profiles');

-- Allow public read access
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profiles');
```

### 3. RLS Policies Kontrolü
Tüm RLS policies'lerin aktif olduğundan emin olun (design.md'de SQL kodları mevcut)

## Domain Yapılandırması

### Custom Domain Ekleme (Opsiyonel)
1. Vercel Dashboard > Settings > Domains
2. Domain adınızı ekleyin
3. DNS kayıtlarını güncelleyin (Vercel otomatik talimat verir)
4. SSL sertifikası otomatik oluşturulur

## Post-Deployment Checklist

- [ ] Tüm sayfalar yükleniyor mu?
- [ ] Google OAuth çalışıyor mu?
- [ ] Profil oluşturma çalışıyor mu?
- [ ] Avatar yükleme çalışıyor mu?
- [ ] AI Chatbot yanıt veriyor mu?
- [ ] Admin paneline giriş yapılabiliyor mu?
- [ ] Bilgi bankası makaleleri görünüyor mu?

## Monitoring

### Vercel Analytics
- Otomatik olarak aktiftir
- Dashboard'dan performans metrikleri görülebilir

### Error Tracking (Opsiyonel)
Sentry entegrasyonu için:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Güncelleme

Yeni değişiklikleri deploy etmek için:
```bash
git add .
git commit -m "Update message"
git push
```

Vercel otomatik olarak yeni deploy başlatır.

## Sorun Giderme

### Build Hatası
- Vercel logs'u kontrol edin
- Local'de `npm run build` çalıştırın
- TypeScript hatalarını düzeltin

### Environment Variables
- Tüm değişkenlerin doğru girildiğinden emin olun
- Değişiklik sonrası redeploy gerekir

### Database Bağlantı Hatası
- Supabase URL ve keys'leri kontrol edin
- RLS policies'lerin doğru olduğundan emin olun

## Destek

Sorun yaşarsanız:
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
