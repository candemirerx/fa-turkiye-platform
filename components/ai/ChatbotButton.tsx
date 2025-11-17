'use client';

import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatbotButton({ onClick, isOpen }: ChatbotButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'fixed bottom-6 right-6 z-40',
        'w-16 h-16 rounded-full shadow-2xl',
        'flex items-center justify-center',
        'transition-all duration-300 ease-in-out',
        'focus:outline-none focus:ring-4 focus:ring-purple-500',
        'hover:scale-110',
        isOpen
          ? 'bg-gray-700 hover:bg-gray-800'
          : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      )}
      aria-label={isOpen ? 'Sohbeti Kapat' : 'AI Asistan'}
    >
      {isOpen ? (
        <X className="w-8 h-8 text-white" />
      ) : (
        <MessageCircle className="w-8 h-8 text-white" />
      )}
    </button>
  );
}
