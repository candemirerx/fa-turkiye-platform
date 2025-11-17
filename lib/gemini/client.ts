import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAIResponse(
  userMessage: string,
  context: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI yanıt oluşturulurken bir hata oluştu');
  }
}
