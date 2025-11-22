'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Sparkles, X, Settings, BookOpen, Brain, Info } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import ChatSettings from './ChatSettings';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotModal({ isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Merhaba! Ben FA Türkiye Platformu AI asistanıyım. Friedrich Ataksi hakkında sorularınızı yanıtlamak için buradayım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Bir hata oluştu');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Ayarlar ekranı açıksa onu göster
  if (showSettings) {
    return (
      <ChatSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg h-[100dvh] sm:h-[700px] sm:rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Modern ve Ferah */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-4 sm:p-5 sm:rounded-t-2xl relative flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-lg truncate">
                AI Asistan
              </h3>
              <p className="text-white/90 text-sm truncate">
                Friedrich Ataksi Uzmanı
              </p>
            </div>
          </div>

          {/* Header Butonları */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <button
              onClick={() => setShowSettings(true)}
              className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Ayarlar"
              title="Ayarlar"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Kapat"
            >
              <X className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        </div>

        {/* Messages - Ferah ve Temiz */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 overscroll-contain bg-gradient-to-b from-gray-50 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-purple-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                )}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p
                  className={cn(
                    'text-xs mt-2',
                    message.role === 'user'
                      ? 'text-purple-100'
                      : 'text-gray-400'
                  )}
                >
                  {message.timestamp.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - Modern ve Kullanışlı */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 border-t border-gray-200 flex-shrink-0 bg-white sm:rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              className="flex-1 px-4 py-3 text-sm sm:text-base text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all min-h-[48px] disabled:text-gray-500 disabled:bg-gray-100"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl hover:from-purple-700 hover:to-purple-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 min-h-[48px] min-w-[48px] flex items-center justify-center shadow-lg shadow-purple-500/30"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
