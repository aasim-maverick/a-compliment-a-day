import React from 'react';
import { Heart, Gift } from 'lucide-react';

interface ControlButtonsProps {
  onNextCompliment: () => void;
  onSurpriseMe: () => void;
  isNextDisabled: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
  onNextCompliment,
  onSurpriseMe,
  isNextDisabled
}) => {
  return (
    <div className="w-full flex flex-col md:flex-row justify-center gap-4 mt-6">
      <button
        onClick={onNextCompliment}
        disabled={isNextDisabled}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                   text-white font-medium transition-all duration-300
                   ${isNextDisabled 
                     ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-70' 
                     : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 shadow-md hover:shadow-lg'
                   }`}
      >
        <Heart size={18} />
        <span>Next Compliment</span>
      </button>
      
      <button
        onClick={onSurpriseMe}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full 
                 bg-secondary-500 hover:bg-secondary-600 dark:bg-secondary-700 dark:hover:bg-secondary-800
                 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Gift size={18} />
        <span>Surprise Me</span>
      </button>
    </div>
  );
};

export default ControlButtons;