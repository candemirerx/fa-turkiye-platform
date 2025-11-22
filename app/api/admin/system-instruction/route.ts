import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Sistem talimatını getir
export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('ai_settings')
            .select('value')
            .eq('key', 'system_instruction')
            .single();

        if (error) {
            console.error('Sistem talimatı getirme hatası:', error);
            return NextResponse.json(
                { error: 'Sistem talimatı getirilemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            systemInstruction: data?.value || ''
        });
    } catch (error) {
        console.error('GET /api/admin/system-instruction hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

// Sistem talimatını güncelle
export async function PUT(request: NextRequest) {
    try {
        const { systemInstruction } = await request.json();

        if (!systemInstruction || typeof systemInstruction !== 'string') {
            return NextResponse.json(
                { error: 'Geçersiz sistem talimatı' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Önce kayıt var mı kontrol et
        const { data: existing } = await supabase
            .from('ai_settings')
            .select('key')
            .eq('key', 'system_instruction')
            .single();

        let result;
        if (existing) {
            // Güncelle
            result = await supabase
                .from('ai_settings')
                .update({ value: systemInstruction })
                .eq('key', 'system_instruction')
                .select()
                .single();
        } else {
            // Yeni ekle
            result = await supabase
                .from('ai_settings')
                .insert({
                    key: 'system_instruction',
                    value: systemInstruction,
                    description: 'Ana sistem talimatı - AI asistanın davranışını belirler'
                })
                .select()
                .single();
        }

        if (result.error) {
            console.error('Sistem talimatı güncelleme hatası:', result.error);
            return NextResponse.json(
                { error: 'Sistem talimatı güncellenemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            systemInstruction: result.data.value
        });
    } catch (error) {
        console.error('PUT /api/admin/system-instruction hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
