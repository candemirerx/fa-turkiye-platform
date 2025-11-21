'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md h-[100dvh] sm:h-[600px] sm:rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Mobilde Kompakt */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 sm:p-6 sm:rounded-t-2xl relative flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-base sm:text-lg truncate">
                AI Asistan
              </h3>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                FA hakkında sorularınızı yanıtlıyorum
              </p>
            </div>
          </div>

          {/* Close Button - Mobilde Daha Küçük */}
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 focus:ring-white flex-shrink-0 ml-2"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </button>
        </div>

        {/* Disclaimer - Mobilde Kompakt */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 sm:p-4 flex-shrink-0">
          <div className="flex gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
              <strong>Önemli:</strong> Ben bir doktor değilim ve tıbbi tavsiye
              veremem. Lütfen sağlık sorunlarınız için bir sağlık
              profesyoneline danışın.
            </p>
          </div>
        </div>

        {/* Messages - Mobilde Daha Fazla Alan */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 overscroll-contain">
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
                  'max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3',
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p
                  className={cn(
                    'text-xs mt-1.5 sm:mt-2',
                    message.role === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-500'
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
              <div className="bg-gray-100 rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input - Mobilde Daha Kullanışlı */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-gray-200 flex-shrink-0 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-900 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 min-h-[44px] disabled:text-gray-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-4 focus:ring-purple-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
