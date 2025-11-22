import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';

        let type = 'manual';
        let soru = '';
        let cevap = '';
        let link = '';
        let fileName = '';

        // Form data (dosya yükleme) veya JSON
        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            type = formData.get('type') as string;

            if (type === 'file') {
                const file = formData.get('file') as File;
                if (!file) {
                    return NextResponse.json(
                        { error: 'Dosya gerekli' },
                        { status: 400 }
                    );
                }

                fileName = file.name;
                // Dosya içeriğini okuyabilirsiniz veya storage'a yükleyebilirsiniz
                // Şimdilik sadece dosya adını saklayacağız
                soru = `Dosya: ${fileName}`;
                cevap = `Dosya yüklendi: ${fileName} (${(file.size / 1024).toFixed(2)} KB)`;
            }
        } else {
            const body = await request.json();
            type = body.type || 'manual';

            if (type === 'manual') {
                soru = body.soru;
                cevap = body.cevap;

                if (!soru || !cevap) {
                    return NextResponse.json(
                        { error: 'Soru ve cevap gerekli' },
                        { status: 400 }
                    );
                }
            } else if (type === 'link') {
                link = body.link;

                if (!link) {
                    return NextResponse.json(
                        { error: 'Link gerekli' },
                        { status: 400 }
                    );
                }

                soru = `Link paylaşımı: ${link}`;
                cevap = `Eğitim verisi linki: ${link}`;
            }
        }

        const supabase = await createClient();

        // Eğitim verisini veritabanına kaydet
        const { error } = await supabase
            .from('ai_training_data')
            .insert({
                soru: soru.trim(),
                cevap: cevap.trim(),
                onaylandi_mi: false, // Admin onayı bekliyor
            });

        if (error) {
            console.error('Eğitim verisi kaydetme hatası:', error);
            return NextResponse.json(
                { error: 'Eğitim verisi kaydedilemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Eğitim veriniz başarıyla kaydedildi'
        });
    } catch (error) {
        console.error('POST /api/ai-training hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
