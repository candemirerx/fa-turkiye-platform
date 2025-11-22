'use client';

import { useState } from 'react';
import { X, AlertCircle, BookOpen, Brain, Send, ArrowLeft } from 'lucide-react';

interface ChatSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'info' | 'training' | 'suggestions';
type TrainingType = 'manual' | 'link' | 'file';

export default function ChatSettings({ isOpen, onClose }: ChatSettingsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [trainingType, setTrainingType] = useState<TrainingType>('manual');

    // Manuel eğitim
    const [trainingQuestion, setTrainingQuestion] = useState('');
    const [trainingAnswer, setTrainingAnswer] = useState('');

    // Link paylaşma
    const [trainingLink, setTrainingLink] = useState('');

    // Dosya gönderme
    const [trainingFile, setTrainingFile] = useState<File | null>(null);

    // Öneri
    const [suggestion, setSuggestion] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form validasyonu
    const isTrainingFormValid = () => {
        if (trainingType === 'manual') {
            return trainingQuestion.trim() && trainingAnswer.trim();
        } else if (trainingType === 'link') {
            return trainingLink.trim();
        } else if (trainingType === 'file') {
            return trainingFile !== null;
        }
        return false;
    };

    // Eğitim verisi gönder
    const handleTrainingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isTrainingFormValid()) {
            setSubmitMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            let body: any = {};

            if (trainingType === 'manual') {
                body = {
                    type: 'manual',
                    soru: trainingQuestion.trim(),
                    cevap: trainingAnswer.trim(),
                };
            } else if (trainingType === 'link') {
                body = {
                    type: 'link',
                    link: trainingLink.trim(),
                };
            } else if (trainingType === 'file' && trainingFile) {
                // Dosya için FormData kullan
                const formData = new FormData();
                formData.append('type', 'file');
                formData.append('file', trainingFile);

                const response = await fetch('/api/ai-training', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Gönderim başarısız');

                setSubmitMessage({
                    type: 'success',
                    text: 'Dosyanız başarıyla gönderildi! Admin incelemesinden sonra sisteme eklenecektir.'
                });
                setTrainingFile(null);
                setTimeout(() => setSubmitMessage(null), 5000);
                setIsSubmitting(false);
                return;
            }

            const response = await fetch('/api/ai-training', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error('Gönderim başarısız');

            setSubmitMessage({
                type: 'success',
                text: 'Eğitim veriniz başarıyla gönderildi! Admin incelemesinden sonra sisteme eklenecektir.'
            });

            // Formu temizle
            setTrainingQuestion('');
            setTrainingAnswer('');
            setTrainingLink('');

            setTimeout(() => setSubmitMessage(null), 5000);
        } catch (error) {
            setSubmitMessage({ type: 'error', text: 'Gönderim başarısız oldu. Lütfen tekrar deneyin.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Bilgi bankası önerisi gönder
    const handleSuggestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!suggestion.trim()) {
            setSubmitMessage({ type: 'error', text: 'Lütfen önerinizi yazın' });
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const response = await fetch('/api/knowledge-suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    oneri: suggestion.trim(),
                }),
            });

            if (!response.ok) throw new Error('Gönderim başarısız');

            setSubmitMessage({
                type: 'success',
                text: 'Öneriniz başarıyla gönderildi! Teşekkür ederiz.'
            });
            setSuggestion('');

            setTimeout(() => setSubmitMessage(null), 5000);
        } catch (error) {
            setSubmitMessage({ type: 'error', text: 'Gönderim başarısız oldu. Lütfen tekrar deneyin.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full sm:max-w-lg h-[100dvh] sm:h-[700px] sm:rounded-2xl bg-white shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-4 sm:p-5 sm:rounded-t-2xl relative flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Geri"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                        <div className="min-w-0">
                            <h3 className="text-white font-bold text-lg truncate">
                                Ayarlar
                            </h3>
                            <p className="text-white/90 text-sm truncate">
                                Katkıda bulunun
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-white flex-shrink-0 ml-2"
                        aria-label="Kapat"
                    >
                        <X className="w-5 h-5 text-purple-600" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-white flex-shrink-0">
                    <div className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Bilgilendirme</span>
                                <span className="sm:hidden">Bilgi</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('training')}
                            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'training'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Brain className="w-4 h-4" />
                                <span className="hidden sm:inline">AI Eğitimi</span>
                                <span className="sm:hidden">Eğitim</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('suggestions')}
                            className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'suggestions'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span className="hidden sm:inline">Öneriler</span>
                                <span className="sm:hidden">Öneri</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-white">
                    {/* Bilgilendirme Sekmesi */}
                    {activeTab === 'info' && (
                        <div className="space-y-4">
                            {/* Önemli Uyarı - Sarı Kutucuk */}
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg shadow-sm">
                                <div className="flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-amber-900 mb-1">Önemli Uyarı</h4>
                                        <p className="text-sm text-amber-800 leading-relaxed">
                                            Ben bir doktor değilim ve tıbbi tavsiye veremem. Lütfen sağlık sorunlarınız için mutlaka bir sağlık profesyoneline danışın.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Hakkında */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-purple-600" />
                                    AI Asistan Hakkında
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Friedrich Ataksi konusunda uzmanlaşmış yapay zeka asistanıyım. Bilgi bankasındaki veriler ve onaylanmış eğitim verileri ile size yardımcı olmaya çalışıyorum.
                                </p>
                            </div>

                            {/* Nasıl Kullanılır */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-3">Nasıl Kullanılır?</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span>FA hakkında sorularınızı doğal dille sorun</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span>Bilgi bankasından en güncel bilgileri alın</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span>Eğitim verisi göndererek sistemi geliştirin</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-purple-600 font-bold">•</span>
                                        <span>Bilgi bankası için önerilerde bulunun</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* AI Eğitimi Sekmesi */}
                    {activeTab === 'training' && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg shadow-sm">
                                <div className="flex gap-3">
                                    <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900 mb-1">AI Eğitim Verisi</h4>
                                        <p className="text-sm text-blue-800 leading-relaxed">
                                            Sık sorulan sorular, linkler veya dosyalar paylaşarak AI asistanın daha iyi yanıtlar vermesine yardımcı olun.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {submitMessage && activeTab === 'training' && (
                                <div
                                    className={`border-l-4 p-4 rounded-r-lg shadow-sm ${submitMessage.type === 'success'
                                            ? 'bg-green-50 border-green-400'
                                            : 'bg-red-50 border-red-400'
                                        }`}
                                >
                                    <p
                                        className={`text-sm ${submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                                            }`}
                                    >
                                        {submitMessage.text}
                                    </p>
                                </div>
                            )}

                            {/* Eğitim Tipi Seçimi */}
                            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Eğitim Verisi Türü
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setTrainingType('manual')}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${trainingType === 'manual'
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        📝 Manuel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTrainingType('link')}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${trainingType === 'link'
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        🔗 Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTrainingType('file')}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${trainingType === 'file'
                                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        📎 Dosya
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleTrainingSubmit} className="space-y-4">
                                {/* Manuel Eğitim */}
                                {trainingType === 'manual' && (
                                    <>
                                        <div>
                                            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                                                Soru
                                            </label>
                                            <textarea
                                                id="question"
                                                value={trainingQuestion}
                                                onChange={(e) => setTrainingQuestion(e.target.value)}
                                                placeholder="Örn: Friedrich Ataksi nedir?"
                                                className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                                rows={3}
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                                                Cevap
                                            </label>
                                            <textarea
                                                id="answer"
                                                value={trainingAnswer}
                                                onChange={(e) => setTrainingAnswer(e.target.value)}
                                                placeholder="Sorunun detaylı cevabını yazın..."
                                                className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                                rows={5}
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Link Paylaşma */}
                                {trainingType === 'link' && (
                                    <div>
                                        <label htmlFor="training-link" className="block text-sm font-medium text-gray-700 mb-2">
                                            Eğitim Verisi Linki
                                        </label>
                                        <input
                                            type="url"
                                            id="training-link"
                                            value={trainingLink}
                                            onChange={(e) => setTrainingLink(e.target.value)}
                                            placeholder="https://example.com/egitim-verisi"
                                            className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">
                                            Eğitim verisi içeren bir web sayfası, PDF veya doküman linki paylaşabilirsiniz.
                                        </p>
                                    </div>
                                )}

                                {/* Dosya Gönderme */}
                                {trainingType === 'file' && (
                                    <div>
                                        <label htmlFor="training-file" className="block text-sm font-medium text-gray-700 mb-2">
                                            Eğitim Verisi Dosyası
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                id="training-file"
                                                onChange={(e) => setTrainingFile(e.target.files?.[0] || null)}
                                                accept=".pdf,.doc,.docx,.txt,.json,.xls,.xlsx,.csv"
                                                className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Desteklenen formatlar: PDF, Word, Excel, TXT, JSON, CSV (Maks. 10MB)
                                        </p>
                                        {trainingFile && (
                                            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                                <p className="text-sm text-purple-800">
                                                    📎 <strong>{trainingFile.name}</strong> ({(trainingFile.size / 1024).toFixed(2)} KB)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* İncelemeye Gönder Butonu */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !isTrainingFormValid()}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-700 hover:to-purple-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 font-medium"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            İncelemeye Gönder
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Öneriler Sekmesi */}
                    {activeTab === 'suggestions' && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg shadow-sm">
                                <div className="flex gap-3">
                                    <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-green-900 mb-1">Bilgi Bankası Önerileri</h4>
                                        <p className="text-sm text-green-800 leading-relaxed">
                                            Bilgi bankasına eklenmesini istediğiniz konuları ve kaynakları önerebilirsiniz.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {submitMessage && activeTab === 'suggestions' && (
                                <div
                                    className={`border-l-4 p-4 rounded-r-lg shadow-sm ${submitMessage.type === 'success'
                                            ? 'bg-green-50 border-green-400'
                                            : 'bg-red-50 border-red-400'
                                        }`}
                                >
                                    <p
                                        className={`text-sm ${submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                                            }`}
                                    >
                                        {submitMessage.text}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="suggestion" className="block text-sm font-medium text-gray-700 mb-2">
                                        Öneriniz
                                    </label>
                                    <textarea
                                        id="suggestion"
                                        value={suggestion}
                                        onChange={(e) => setSuggestion(e.target.value)}
                                        placeholder="Bilgi bankasına eklenmesini istediğiniz konuları, kaynakları veya iyileştirme önerilerinizi yazın..."
                                        className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                        rows={8}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !suggestion.trim()}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:from-green-700 hover:to-green-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30 font-medium"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Gönderiliyor...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Öneri Gönder
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
