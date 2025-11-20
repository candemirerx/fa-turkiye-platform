import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAIResponse } from '@/lib/gemini/client';

export async function POST(request: NextRequest) {
  try {
    // API Key kontrolü ve loglama
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('=== GEMINI API KEY KONTROLÜ ===');
    console.log('API Key mevcut mu?', !!apiKey);
    console.log('API Key uzunluğu:', apiKey?.length || 0);
    console.log('API Key ilk 10 karakter:', apiKey?.substring(0, 10) + '...' || 'YOK');
    console.log('================================');

    if (!apiKey) {
      console.error('❌ HATA: GEMINI_API_KEY environment variable bulunamadı!');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is missing in environment variables' },
        { status: 500 }
      );
    }

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

    console.log('📝 AI yanıtı oluşturuluyor...');
    console.log('Mesaj uzunluğu:', message.length);
    console.log('Context uzunluğu:', context.length);

    // AI yanıtı oluştur (30 saniye timeout)
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 30000)
    );

    const responsePromise = generateAIResponse(message, context);

    const aiResponse = await Promise.race([responsePromise, timeoutPromise]);

    console.log('✅ AI yanıtı başarıyla oluşturuldu');

    return NextResponse.json({
      response: aiResponse,
      disclaimer:
        'Ben bir doktor değilim ve tıbbi tavsiye veremem. Lütfen sağlık sorunlarınız için bir sağlık profesyoneline danışın.',
    });
  } catch (error) {
    console.error('\n❌ ============ CHAT API HATASI ============ ❌');
    console.error('Hata tipi:', typeof error);
    console.error('Hata sınıfı:', error?.constructor?.name);

    if (error instanceof Error) {
      console.error('Hata mesajı:', error.message);
      console.error('Hata stack:', error.stack);
      console.error('Hata name:', error.name);
    } else {
      console.error('Bilinmeyen hata:', error);
    }

    // Eğer Gemini API hatası varsa detayları göster
    if (error && typeof error === 'object') {
      console.error('Hata objesinin tüm anahtarları:', Object.keys(error));
      try {
        console.error('Hata objesi (JSON):', JSON.stringify(error, null, 2));
      } catch {
        console.error('Hata objesi JSON olarak serialize edilemedi');
      }
    }
    console.error('❌ ========================================== ❌\n');

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
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
