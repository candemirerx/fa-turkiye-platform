'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Save, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function SystemInstructionEditor() {
    const [instruction, setInstruction] = useState('');
    const [originalInstruction, setOriginalInstruction] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Sistem talimatını yükle
    useEffect(() => {
        loadInstruction();
    }, []);

    const loadInstruction = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/system-instruction');
            if (!response.ok) throw new Error('Yükleme başarısız');

            const data = await response.json();
            setInstruction(data.systemInstruction || '');
            setOriginalInstruction(data.systemInstruction || '');
        } catch (error) {
            console.error('Sistem talimatı yükleme hatası:', error);
            setMessage({ type: 'error', text: 'Sistem talimatı yüklenemedi' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!instruction.trim()) {
            setMessage({ type: 'error', text: 'Sistem talimatı boş olamaz' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const response = await fetch('/api/admin/system-instruction', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ systemInstruction: instruction }),
            });

            if (!response.ok) throw new Error('Kaydetme başarısız');

            const data = await response.json();
            setOriginalInstruction(data.systemInstruction);
            setMessage({ type: 'success', text: 'Sistem talimatı başarıyla kaydedildi!' });

            // Başarı mesajını 3 saniye sonra kaldır
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Sistem talimatı kaydetme hatası:', error);
            setMessage({ type: 'error', text: 'Kaydetme başarısız oldu' });
        } finally {
            setIsSaving(false);
        }
    };

    const hasChanges = instruction !== originalInstruction;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <p className="text-gray-600">Sistem talimatı yükleniyor...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span>Sistem Talimatı (System Prompt)</span>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                    Bu talimat, yapay zeka asistanın tüm yanıtlarında nasıl davranacağını belirler.
                    Değişiklikler anında etkili olur.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Bilgilendirme Kutusu */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Önemli:</strong> Sistem talimatı, AI'nın kişiliğini, ton ve üslubunu,
                                yanıt formatını ve güvenlik kurallarını tanımlar. Dikkatli düzenleyin.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Mesaj Gösterimi */}
                {message && (
                    <div
                        className={`border-l-4 p-4 rounded-r-lg ${message.type === 'success'
                                ? 'bg-green-50 border-green-400'
                                : 'bg-red-50 border-red-400'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            )}
                            <p
                                className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'
                                    }`}
                            >
                                {message.text}
                            </p>
                        </div>
                    </div>
                )}

                {/* Textarea */}
                <div>
                    <label htmlFor="system-instruction" className="block text-sm font-medium text-gray-700 mb-2">
                        Talimat Metni
                    </label>
                    <textarea
                        id="system-instruction"
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        className="w-full min-h-[400px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
                        placeholder="Sistem talimatını buraya yazın..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Karakter sayısı: {instruction.length}
                    </p>
                </div>

                {/* Kaydet Butonu */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pt-4 border-t">
                    <div className="text-sm text-gray-600">
                        {hasChanges ? (
                            <span className="text-orange-600 font-medium">⚠️ Kaydedilmemiş değişiklikler var</span>
                        ) : (
                            <span className="text-green-600">✓ Tüm değişiklikler kaydedildi</span>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Kaydet
                            </>
                        )}
                    </button>
                </div>

                {/* Yardımcı Bilgiler */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm">💡 İpuçları:</h4>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                        <li>AI'nın rolünü ve uzmanlık alanını net bir şekilde tanımlayın</li>
                        <li>Güvenlik kurallarını ve sınırlamaları belirtin</li>
                        <li>Yanıt formatını ve ton/üslubu açıklayın</li>
                        <li>Kullanıcılarla nasıl etkileşime geçeceğini belirtin</li>
                        <li>Tıbbi tavsiye vermemesi gibi önemli uyarıları ekleyin</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
