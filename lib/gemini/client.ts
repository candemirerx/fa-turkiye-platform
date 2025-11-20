import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key kontrolu
const apiKey = process.env.GEMINI_API_KEY;
console.log('🔑 GEMINI_API_KEY Status:', apiKey ? 'VAR' : 'YOK');
console.log('🔑 GEMINI_API_KEY Length:', apiKey?.length || 0);

const genAI = new GoogleGenerativeAI(apiKey!);

export async function generateAIResponse(
  userMessage: string,
  context: string
): Promise<string> {
  const startTime = Date.now();

  try {
    console.log('\n🤖 ===== GEMINI API CAGRISI BASLADI =====');
    console.log('📝 Kullanici mesaji:', userMessage.substring(0, 100) + '...');
    console.log('📚 Context uzunlugu:', context.length, 'karakter');

    // Gemini 2.5 Flash modelini kullan (en yeni ve hizli)
    console.log('🔧 Model seciliyor: gemini-2.5-flash');
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const systemPrompt = `Sen Friedrich Ataksi (FA) konusunda uzmanlaşmış yardımcı bir asistansın. 
Aşağıdaki bilgi bankası ve eğitim verilerini kullanarak kullanıcının sorularını yanıtla.

ÖNEMLİ UYARILAR:
- Sen bir doktor değilsin ve tıbbi tavsiye veremezsin
- Sadece genel bilgilendirme amaçlı yanıtlar ver
- Kullanıcıyı her zaman bir sağlık profesyoneline danışmaya yönlendir
- Eğer sorulan soru bilgi bankasında yoksa, bunu açıkça belirt

BİLGİ BANKASI VE EĞİTİM VERİLERİ:
${context}

Lütfen Türkçe, empatik ve anlaşılır bir dille yanıt ver.`;

    const prompt = `${systemPrompt}\n\nKullanıcı Sorusu: ${userMessage}`;

    console.log('📤 Gemini API istegi gonderiliyor...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const elapsedTime = Date.now() - startTime;
    console.log(`✅ Gemini API yaniti alindi (${elapsedTime}ms)`);
    console.log(`📊 Yanit uzunlugu: ${text.length} karakter`);
    console.log('🤖 ===== GEMINI API CAGRISI TAMAMLANDI =====\n');

    return text;
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(`\n🚨 ========== GEMINI API HATASI (${elapsedTime}ms) ========== 🚨`);
    console.error('⚠️ Hata tipi:', typeof error);
    console.error('⚠️ Hata constructor:', error?.constructor?.name);

    // Hata detaylarini logla
    if (error instanceof Error) {
      console.error('📛 Error name:', error.name);
      console.error('📛 Error message:', error.message);
      console.error('📛 Error stack:\n', error.stack);
    } else {
      console.error('📛 Bilinmeyen hata formati:', error);
    }

    // Gemini ozel hata yapisini kontrol et
    if (error && typeof error === 'object') {
      const errorObj = error as any;

      console.error('\n--- Gemini API Hata Detaylari ---');

      if (errorObj.status) {
        console.error('🔴 HTTP Status:', errorObj.status);
      }

      if (errorObj.statusText) {
        console.error('🔴 Status Text:', errorObj.statusText);
      }

      if (errorObj.errorDetails) {
        console.error('🔴 Error Details:', JSON.stringify(errorObj.errorDetails, null, 2));
      }

      if (errorObj.message) {
        console.error('🔴 API Error Message:', errorObj.message);
      }

      console.error('🔴 Tum hata anahtarlari:', Object.keys(error));

      try {
        console.error('🔴 Hata objesi (tam JSON):\n', JSON.stringify(error, null, 2));
      } catch (e) {
        console.error('🔴 Hata objesi JSON olarak serialize edilemedi:', e);
      }
    }

    console.error('🚨 ================================================= 🚨\n');

    throw new Error('AI yanit olusturulurken bir hata olustu: ' + (error instanceof Error ? error.message : String(error)));
  }
}
