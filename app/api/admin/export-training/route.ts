import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Eğitim verilerini JSON formatında indir
export async function GET() {
    try {
        const supabase = await createClient();

        // Onaylanmış eğitim verilerini al
        const { data: trainingData, error: trainingError } = await supabase
            .from('ai_training_data')
            .select('*')
            .eq('onaylandi_mi', true)
            .order('created_at', { ascending: false });

        if (trainingError) {
            console.error('Eğitim verileri getirme hatası:', trainingError);
            return NextResponse.json(
                { error: 'Eğitim verileri getirilemedi' },
                { status: 500 }
            );
        }

        // Sistem talimatlarını al
        const { data: instructions, error: instructionsError } = await supabase
            .from('ai_system_instructions')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: true });

        if (instructionsError) {
            console.error('Sistem talimatları getirme hatası:', instructionsError);
        }

        // Export formatı
        const exportData = {
            export_date: new Date().toISOString(),
            platform: 'FA Türkiye Platform',
            data: {
                system_instructions: instructions || [],
                training_data: trainingData || [],
                statistics: {
                    total_instructions: instructions?.length || 0,
                    total_training_data: trainingData?.length || 0,
                },
            },
        };

        // JSON dosyası olarak indir
        const fileName = `fa-ai-training-data-${new Date().toISOString().split('T')[0]}.json`;

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });
    } catch (error) {
        console.error('GET /api/admin/export-training hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}
