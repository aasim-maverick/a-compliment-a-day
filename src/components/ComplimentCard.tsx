import React, { useState } from 'react';
import { Compliment } from '../data/compliments';
import { Heart } from 'lucide-react';

interface ComplimentCardProps {
  compliment: Compliment | null;
  isSurprise?: boolean;
}

const ComplimentCard: React.FC<ComplimentCardProps> = ({ 
  compliment, 
  isSurprise = false 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!compliment) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="relative w-full max-w-md">
      <div 
        className={`relative w-full h-full transition-all duration-500 transform ${
          isFlipped ? 'rotate-y-180' : ''
        } cursor-pointer`}
        onClick={handleFlip}
      >
        <div className={`w-full p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-lg 
                        border-2 border-primary-200 dark:border-primary-800
                        ${isSurprise ? 'bg-secondary-50 dark:bg-secondary-900 border-secondary-200 dark:border-secondary-700' : ''}`}
        >
          <div className="absolute top-3 right-3 flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={16} 
                className={`text-primary-400 dark:text-primary-500 animate-float-${['slow', 'medium', 'fast'][i % 3]}`} 
                fill={i % 2 === 0 ? 'currentColor' : 'none'} 
              />
            ))}
          </div>
          
          {isSurprise && (
            <div className="absolute top-4 left-4 transform -rotate-12 bg-secondary-400 text-white text-xs font-bold px-2 py-1 rounded">
              Surprise!
            </div>
          )}
          
          <div className="text-4xl mb-4 text-center">{compliment.emoji}</div>
          
          <blockquote className="font-handwriting text-2xl md:text-3xl text-center text-gray-800 dark:text-gray-100 my-6">
            {compliment.text}
          </blockquote>
          
          <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>~ Tap to flip the card ~</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplimentCard;