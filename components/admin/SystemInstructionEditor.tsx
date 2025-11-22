'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Save, ToggleLeft, ToggleRight, Edit2, Check, X } from 'lucide-react';
import { AISystemInstruction } from '@/types/database';

interface SystemInstructionEditorProps {
    instructions: AISystemInstruction[];
    onUpdate: (instruction: AISystemInstruction) => void;
}

export default function SystemInstructionEditor({
    instructions,
    onUpdate,
}: SystemInstructionEditorProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = (instruction: AISystemInstruction) => {
        setEditingId(instruction.id);
        setEditContent(instruction.instruction_content);
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleSave = async (id: string) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/ai-instructions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    instruction_content: editContent,
                }),
            });

            if (!response.ok) throw new Error('Update failed');

            const { instruction } = await response.json();
            onUpdate(instruction);
            setEditingId(null);
            setEditContent('');
        } catch (error) {
            console.error('Güncelleme hatası:', error);
            alert('Güncelleme başarısız oldu');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (instruction: AISystemInstruction) => {
        try {
            const response = await fetch('/api/admin/ai-instructions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: instruction.id,
                    is_active: !instruction.is_active,
                }),
            });

            if (!response.ok) throw new Error('Toggle failed');

            const { instruction: updated } = await response.json();
            onUpdate(updated);
        } catch (error) {
            console.error('Aktiflik değiştirme hatası:', error);
            alert('İşlem başarısız oldu');
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Sistem Talimatları:</strong> Bu talimatlar yapay zekanın davranışını ve yanıt stilini belirler.
                            Değişiklikler anında etkili olur ve tüm kullanıcı etkileşimlerini etkiler.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {instructions.map((instruction) => {
                    const isEditing = editingId === instruction.id;

                    return (
                        <Card
                            key={instruction.id}
                            className={`transition-all ${instruction.is_active
                                ? 'border-l-4 border-green-500'
                                : 'border-l-4 border-gray-300 opacity-60'
                                }`}
                        >
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {instruction.instruction_title}
                                            {instruction.is_active && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-normal">
                                                    Aktif
                                                </span>
                                            )}
                                        </CardTitle>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Anahtar: <code className="bg-gray-100 px-2 py-0.5 rounded">{instruction.instruction_key}</code>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleActive(instruction)}
                                            className={`p-2 rounded-lg transition-colors ${instruction.is_active
                                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            title={instruction.is_active ? 'Devre Dışı Bırak' : 'Aktif Et'}
                                        >
                                            {instruction.is_active ? (
                                                <ToggleRight className="w-5 h-5" />
                                            ) : (
                                                <ToggleLeft className="w-5 h-5" />
                                            )}
                                        </button>
                                        {!isEditing && (
                                            <button
                                                onClick={() => handleEdit(instruction)}
                                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                title="Düzenle"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-mono text-sm"
                                            placeholder="Sistem talimatını buraya yazın..."
                                        />
                                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                                            <button
                                                onClick={handleCancel}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <X className="w-4 h-4" />
                                                İptal
                                            </button>
                                            <button
                                                onClick={() => handleSave(instruction.id)}
                                                disabled={isSaving || editContent === instruction.instruction_content}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Kaydediliyor...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Kaydet
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                                            {instruction.instruction_content}
                                        </pre>
                                    </div>
                                )}
                                <div className="mt-4 text-xs text-gray-500 flex flex-wrap gap-2">
                                    <span>Oluşturulma: {new Date(instruction.created_at).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                    {instruction.updated_at !== instruction.created_at && (
                                        <>
                                            <span>•</span>
                                            <span>Son Güncelleme: {new Date(instruction.updated_at).toLocaleDateString('tr-TR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}</span>
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {instructions.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Edit2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">
                            Henüz sistem talimatı bulunmuyor
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            Veritabanı migration&apos;ını çalıştırarak varsayılan talimatları ekleyin
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
