import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      console.error('GEMINI_API_KEY bulunamadı');
      return NextResponse.json(
        { error: 'API yapılandırması eksik' },
        { status: 500 }
      );
    }

    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Metin gereklidir' },
        { status: 400 }
      );
    }

    if (text.trim().length === 0) {
      return NextResponse.json({ correctedText: text });
    }

    // Mevcut projede kullanılan model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Aşağıdaki Türkçe metni SADECE yazım ve noktalama hatalarını düzelterek yeniden yaz. 
Metnin anlamını, üslubunu veya içeriğini KESİNLİKLE değiştirme. 
Sadece:
- Yazım hataları
- Noktalama işaretleri
- Büyük/küçük harf kullanımı
düzeltilmeli.

Düzeltilmiş metni direkt olarak yaz, başka hiçbir açıklama ekleme.

Metin:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const correctedText = response.text().trim();

    return NextResponse.json({ correctedText });
  } catch (error) {
    console.error('Text correction error:', error);
    return NextResponse.json(
      { error: 'Metin düzeltilirken hata oluştu' },
      { status: 500 }
    );
  }
}
