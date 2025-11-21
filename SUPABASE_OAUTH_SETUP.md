# Supabase OAuth Ayarları (Google Login)

## 🔧 Vercel'de 404 Hatası Çözümü

Eğer Vercel'de Google ile giriş yaparken **404 hatası** alıyorsanız, aşağıdaki adımları takip edin:

---

## 1️⃣ Supabase Dashboard Ayarları

### Redirect URLs'leri Ekleyin

1. [Supabase Dashboard](https://app.supabase.com) → Projenizi seçin
2. **Authentication** → **URL Configuration** bölümüne gidin
3. **Redirect URLs** kısmına aşağıdaki URL'leri ekleyin:

```
http://localhost:3000/auth/callback
https://VERCEL-DOMAIN.vercel.app/auth/callback
https://CUSTOM-DOMAIN.com/auth/callback
```

**Önemli:** `VERCEL-DOMAIN` ve `CUSTOM-DOMAIN` kısımlarını kendi domain'inizle değiştirin!

### Site URL'i Ayarlayın

**Site URL** kısmına production URL'inizi ekleyin:
```
https://VERCEL-DOMAIN.vercel.app
```

veya custom domain kullanıyorsanız:
```
https://CUSTOM-DOMAIN.com
```

---

## 2️⃣ Vercel Environment Variables

Vercel Dashboard'da aşağıdaki environment variables'ların eklendiğinden emin olun:

1. [Vercel Dashboard](https://vercel.com) → Projenizi seçin
2. **Settings** → **Environment Variables** bölümüne gidin
3. Aşağıdaki değişkenleri ekleyin:

| Variable Name | Value | Source |
|--------------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` | Supabase Dashboard → Settings → API |

**Önemli:** Bu değişkenleri ekledikten sonra projeyi **yeniden deploy** edin!

---

## 3️⃣ Google OAuth Provider Ayarları

### Supabase'de Google Provider'ı Aktifleştirin

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** provider'ını bulun ve **Enable** edin
3. Google Cloud Console'dan aldığınız:
   - **Client ID**
   - **Client Secret**
   
   değerlerini girin

### Google Cloud Console Ayarları

1. [Google Cloud Console](https://console.cloud.google.com) → API & Services → Credentials
2. OAuth 2.0 Client ID'nizi seçin
3. **Authorized redirect URIs** kısmına aşağıdaki URL'i ekleyin:

```
https://xxxxx.supabase.co/auth/v1/callback
```

**Önemli:** `xxxxx` kısmını kendi Supabase project ID'nizle değiştirin!

---

## 4️⃣ Test Etme

### Local'de Test
```bash
npm run dev
```
- http://localhost:3000/giris adresine gidin
- "Google ile Giriş Yap" butonuna tıklayın
- Google hesabınızla giriş yapın
- http://localhost:3000/auth/callback adresine yönlendirilmeli
- Ardından ana sayfaya (/) veya admin sayfasına (/admin) yönlendirilmelisiniz

### Vercel'de Test
- https://VERCEL-DOMAIN.vercel.app/giris adresine gidin
- Aynı akışı takip edin

---

## 🐛 Hata Ayıklama

### 404 Hatası Alıyorsanız
✅ Supabase Dashboard'da Redirect URLs doğru mu?
✅ Vercel Environment Variables eklenmiş mi?
✅ Vercel'de son deployment başarılı mı?
✅ Google Cloud Console'da Authorized redirect URIs doğru mu?

### "Invalid redirect URL" Hatası Alıyorsanız
- Supabase Dashboard → URL Configuration → Redirect URLs listesini kontrol edin
- Tam URL'i (protocol dahil) eklediğinizden emin olun

### "Invalid client" Hatası Alıyorsanız
- Google Cloud Console'da Client ID ve Client Secret'ı kontrol edin
- Supabase Dashboard'da Google Provider ayarlarını kontrol edin

---

## 📝 Kod Değişiklikleri

✅ `hooks/useAuth.ts` - `window.location.origin` kullanıyor (dinamik)
✅ `app/auth/callback/route.ts` - Admin kontrolü ve hata yönetimi eklendi
✅ Hiçbir yerde sabit kodlanmış `localhost:3000` yok

---

## 🎯 Admin Girişi

Eğer `admin@fa-platform.com` email'i ile giriş yaparsanız, otomatik olarak `/admin` sayfasına yönlendirilirsiniz.

Diğer tüm kullanıcılar `/` (ana sayfa) sayfasına yönlendirilir.
