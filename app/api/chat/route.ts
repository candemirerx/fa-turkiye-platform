import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAIResponse } from '@/lib/gemini/client';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Geçersiz mesaj' },
        { status: 400 }
      );
    }

    // Supabase'den context verilerini çek
    const supabase = await createClient();

    // Knowledge base verilerini çek
    const { data: knowledgeData, error: knowledgeError } = await supabase
      .from('knowledge_base')
      .select('baslik, icerik, kategori')
      .limit(20);

    if (knowledgeError) {
      console.error('Knowledge base error:', knowledgeError);
    }

    // AI training data verilerini çek (sadece onaylanmış)
    const { data: trainingData, error: trainingError } = await supabase
      .from('ai_training_data')
      .select('soru, cevap')
      .eq('onaylandi_mi', true)
      .limit(50);

    if (trainingError) {
      console.error('Training data error:', trainingError);
    }

    // Context oluştur
    let context = '';

    if (knowledgeData && knowledgeData.length > 0) {
      context += '\n\n=== BİLGİ BANKASI ===\n';
      knowledgeData.forEach((item) => {
        context += `\nKategori: ${item.kategori}\nBaşlık: ${item.baslik}\nİçerik: ${item.icerik}\n---\n`;
      });
    }

    if (trainingData && trainingData.length > 0) {
      context += '\n\n=== EĞİTİM VERİLERİ (SSS) ===\n';
      trainingData.forEach((item) => {
        context += `\nSoru: ${item.soru}\nCevap: ${item.cevap}\n---\n`;
      });
    }

    if (!context) {
      context = 'Henüz bilgi bankasında veri bulunmamaktadır.';
    }

    // AI yanıtı oluştur (5 saniye timeout)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const responsePromise = generateAIResponse(message, context);

    const aiResponse = await Promise.race([responsePromise, timeoutPromise]);

    return NextResponse.json({
      response: aiResponse,
      disclaimer:
        'Ben bir doktor değilim ve tıbbi tavsiye veremem. Lütfen sağlık sorunlarınız için bir sağlık profesyoneline danışın.',
    });
  } catch (error) {
    console.error('Chat API Error:', error);

    if (error instanceof Error && error.message === 'Timeout') {
      return NextResponse.json(
        {
          error:
            'Yanıt süresi aşıldı. Lütfen daha kısa bir soru deneyin.',
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        error:
          'Şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
      },
      { status: 500 }
    );
  }
}
