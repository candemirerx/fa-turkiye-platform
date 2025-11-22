import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { oneri } = await request.json();

        if (!oneri || typeof oneri !== 'string' || !oneri.trim()) {
            return NextResponse.json(
                { error: 'Öneri metni gerekli' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        // Öneriyi veritabanına kaydet
        const { error } = await supabase
            .from('knowledge_suggestions')
            .insert({
                oneri: oneri.trim(),
            });

        if (error) {
            console.error('Öneri kaydetme hatası:', error);
            return NextResponse.json(
                { error: 'Öneri kaydedilemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Öneriniz başarıyla kaydedildi'
        });
    } catch (error) {
        console.error('POST /api/knowledge-suggestions hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
