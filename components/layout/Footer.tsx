import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-sm text-gray-600 flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span>
            2025 FA Türkiye Platformu. Tüm hakları saklıdır.
          </span>
        </p>
      </div>
    </footer>
  );
}
