'use client';

import { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import SuggestionModal from './SuggestionModal';

export default function BilgiBankasiHeader() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Bilgi Bankası</span>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            Friedrich Ataksi Hakkında Bilgiler
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30"
            title="Öneride Bulun"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Öneride Bulun</span>
          </button>
        </div>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          FA hakkında detaylı bilgiler, tedavi seçenekleri ve araştırmalar
        </p>
      </div>

      <SuggestionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
