'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
    Download,
    Settings,
    Database,
    CheckCircle,
    Clock,
    Save,
    ToggleLeft,
    ToggleRight,
    Plus,
    FileText
} from 'lucide-react';
import { AITrainingData, AISystemInstruction } from '@/types/database';
import AIDataApproval from './AIDataApproval';
import SystemInstructionEditor from './SystemInstructionEditor';

interface AITrainingManagerProps {
    pendingData: AITrainingData[];
    approvedData: AITrainingData[];
    systemInstructions: AISystemInstruction[];
}

type TabType = 'instructions' | 'pending' | 'approved';

export default function AITrainingManager({
    pendingData: initialPendingData,
    approvedData: initialApprovedData,
    systemInstructions: initialInstructions,
}: AITrainingManagerProps) {
    const [activeTab, setActiveTab] = useState<TabType>('instructions');
    const [pendingData, setPendingData] = useState(initialPendingData);
    const [approvedData, setApprovedData] = useState(initialApprovedData);
    const [instructions, setInstructions] = useState(initialInstructions);
    const [isExporting, setIsExporting] = useState(false);

    // Eğitim verilerini dışa aktar
    const handleExport = async () => {
        setIsExporting(true);
        try {
            const response = await fetch('/api/admin/export-training');
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fa-ai-training-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export hatası:', error);
            alert('Dışa aktarma başarısız oldu');
        } finally {
            setIsExporting(false);
        }
    };

    // Veri onaylandığında state'i güncelle
    const handleDataApproved = (id: string) => {
        const approved = pendingData.find(d => d.id === id);
        if (approved) {
            setPendingData(prev => prev.filter(d => d.id !== id));
            setApprovedData(prev => [{ ...approved, onaylandi_mi: true }, ...prev]);
        }
    };

    // Veri reddedildiğinde state'i güncelle
    const handleDataRejected = (id: string) => {
        setPendingData(prev => prev.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Sistem Talimatları</p>
                                <p className="text-3xl font-bold mt-1">{instructions.length}</p>
                            </div>
                            <Settings className="w-10 h-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Bekleyen Veri</p>
                                <p className="text-3xl font-bold mt-1">{pendingData.length}</p>
                            </div>
                            <Clock className="w-10 h-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Onaylı Veri</p>
                                <p className="text-3xl font-bold mt-1">{approvedData.length}</p>
                            </div>
                            <CheckCircle className="w-10 h-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Toplam Veri</p>
                                <p className="text-3xl font-bold mt-1">
                                    {pendingData.length + approvedData.length}
                                </p>
                            </div>
                            <Database className="w-10 h-10 opacity-80" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Dışa Aktarma Butonu */}
            <div className="flex justify-end">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    <Download className="w-5 h-5" />
                    {isExporting ? 'Dışa Aktarılıyor...' : 'Tüm Verileri Dışa Aktar'}
                </button>
            </div>

            {/* Sekmeler */}
            <div className="border-b border-gray-200">
                <nav className="flex flex-wrap gap-2 -mb-px">
                    <button
                        onClick={() => setActiveTab('instructions')}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'instructions'
                                ? 'border-purple-500 text-purple-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Sistem Talimatları</span>
                        <span className="sm:hidden">Talimatlar</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'pending'
                                ? 'border-yellow-500 text-yellow-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        <span className="hidden sm:inline">Bekleyen Veriler</span>
                        <span className="sm:hidden">Bekleyen</span>
                        {pendingData.length > 0 && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                {pendingData.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${activeTab === 'approved'
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Onaylı Veriler</span>
                        <span className="sm:hidden">Onaylı</span>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                            {approvedData.length}
                        </span>
                    </button>
                </nav>
            </div>

            {/* Sekme İçerikleri */}
            <div className="mt-6">
                {activeTab === 'instructions' && (
                    <SystemInstructionEditor
                        instructions={instructions}
                        onUpdate={(updated) => {
                            setInstructions(prev =>
                                prev.map(inst => inst.id === updated.id ? updated : inst)
                            );
                        }}
                    />
                )}

                {activeTab === 'pending' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Bekleyen Eğitim Verileri ({pendingData.length})
                        </h2>
                        {pendingData.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <p className="text-gray-600 text-lg">
                                        Bekleyen veri bulunmuyor
                                    </p>
                                    <p className="text-gray-500 text-sm mt-2">
                                        Tüm eğitim verileri onaylanmış durumda
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <AIDataApproval
                                data={pendingData}
                                onApproved={handleDataApproved}
                                onRejected={handleDataRejected}
                            />
                        )}
                    </div>
                )}

                {activeTab === 'approved' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Onaylanmış Eğitim Verileri ({approvedData.length})
                        </h2>
                        {approvedData.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 text-lg">
                                        Henüz onaylanmış veri bulunmuyor
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {approvedData.map((item) => (
                                    <Card key={item.id} className="border-l-4 border-green-500">
                                        <CardContent className="pt-6">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Soru:</p>
                                                    <p className="text-gray-900">{item.soru}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500 mb-1">Cevap:</p>
                                                    <p className="text-gray-700">{item.cevap}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                    <span>Onaylandı</span>
                                                    <span>•</span>
                                                    <span>{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
