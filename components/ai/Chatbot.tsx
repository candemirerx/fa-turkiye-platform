'use client';

import { useState } from 'react';
import ChatbotButton from './ChatbotButton';
import ChatbotModal from './ChatbotModal';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatbotButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <ChatbotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
