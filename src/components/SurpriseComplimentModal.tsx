import React, { useEffect, useRef } from 'react';
import { Compliment } from '../data/compliments';
import { X } from 'lucide-react';
import ComplimentCard from './ComplimentCard';

interface SurpriseComplimentModalProps {
  compliment: Compliment | null;
  onClose: () => void;
}

const SurpriseComplimentModal: React.FC<SurpriseComplimentModalProps> = ({
  compliment,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!compliment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg transform transition-all ease-in-out duration-300 animate-scale-in"
      >
        <div className="flex justify-end mb-2">
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <ComplimentCard compliment={compliment} isSurprise={true} />
        
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary-500 hover:bg-secondary-600 text-white rounded-full transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurpriseComplimentModal;