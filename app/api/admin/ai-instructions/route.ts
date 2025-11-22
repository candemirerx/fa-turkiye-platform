import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Sistem talimatlarını getir
export async function GET() {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('ai_system_instructions')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Sistem talimatları getirme hatası:', error);
            return NextResponse.json(
                { error: 'Sistem talimatları getirilemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({ instructions: data || [] });
    } catch (error) {
        console.error('GET /api/admin/ai-instructions hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

// Sistem talimatını güncelle
export async function PUT(request: NextRequest) {
    try {
        const { id, instruction_content, is_active } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'ID gerekli' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const updateData: any = {};
        if (instruction_content !== undefined) {
            updateData.instruction_content = instruction_content;
        }
        if (is_active !== undefined) {
            updateData.is_active = is_active;
        }

        const { data, error } = await supabase
            .from('ai_system_instructions')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Sistem talimatı güncelleme hatası:', error);
            return NextResponse.json(
                { error: 'Sistem talimatı güncellenemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({ instruction: data });
    } catch (error) {
        console.error('PUT /api/admin/ai-instructions hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

// Yeni sistem talimatı ekle
export async function POST(request: NextRequest) {
    try {
        const { instruction_key, instruction_title, instruction_content, is_active } = await request.json();

        if (!instruction_key || !instruction_title || !instruction_content) {
            return NextResponse.json(
                { error: 'Tüm alanlar gerekli' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('ai_system_instructions')
            .insert({
                instruction_key,
                instruction_title,
                instruction_content,
                is_active: is_active ?? true,
            })
            .select()
            .single();

        if (error) {
            console.error('Sistem talimatı ekleme hatası:', error);
            return NextResponse.json(
                { error: 'Sistem talimatı eklenemedi' },
                { status: 500 }
            );
        }

        return NextResponse.json({ instruction: data });
    } catch (error) {
        console.error('POST /api/admin/ai-instructions hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
