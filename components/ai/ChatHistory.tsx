'use client';

import { useState, useEffect } from 'react';
import { History, Trash2, MessageCircle, ArrowLeft, Clock } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (session: ChatSession) => void;
  currentSessionId?: string;
}

const STORAGE_KEY = 'fa-chat-history';

export function getChatHistory(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const sessions = JSON.parse(stored);
    return sessions.map((s: ChatSession) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

export function saveChatSession(session: ChatSession): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getChatHistory();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session);
    }
    // Son 20 sohbeti sakla
    const trimmed = sessions.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    console.error('Sohbet geçmişi kaydedilemedi');
  }
}

export function deleteChatSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getChatHistory();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch {
    console.error('Sohbet silinemedi');
  }
}

export function clearAllChatHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export default function ChatHistory({
  isOpen,
  onClose,
  onSelectSession,
  currentSessionId,
}: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSessions(getChatHistory());
    }
  }, [isOpen]);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    deleteChatSession(sessionId);
    setSessions(getChatHistory());
  };

  const handleClearAll = () => {
    if (confirm('Tüm sohbet geçmişini silmek istediğinize emin misiniz?')) {
      clearAllChatHistory();
      setSessions([]);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Bugün ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Dün ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-6 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg h-[100dvh] sm:h-[min(700px,90vh)] sm:rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 p-4 sm:p-5 sm:rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Geri"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h3 className="text-white font-bold text-lg">Sohbet Geçmişi</h3>
              <p className="text-white/90 text-sm">{sessions.length} sohbet</p>
            </div>
          </div>
          {sessions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 text-sm bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-white"
            >
              Tümünü Sil
            </button>
          )}
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gradient-to-b from-gray-50 to-white">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <History className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Henüz sohbet geçmişi yok</p>
              <p className="text-sm text-gray-400 mt-1">Yeni bir sohbet başlatın</p>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left hover:border-purple-300 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  currentSessionId === session.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate">
                        {session.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(session.updatedAt)}</span>
                      <span className="mx-1">•</span>
                      <span>{session.messages.length} mesaj</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, session.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Sohbeti sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
