import React from 'react';
import { Heart, Gift } from 'lucide-react';

interface ControlButtonsProps {
    onNextCompliment: () => void;
    onSurpriseMe: () => void;
    isNextDisabled: boolean;
    timeRemaining?: string;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({
                                                           onNextCompliment,
                                                           onSurpriseMe,
                                                           isNextDisabled,
                                                           timeRemaining
                                                       }) => {
    return (
        <div className="w-full flex flex-col items-center gap-4 mt-6">
            <div className="flex flex-col items-center">
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
                {isNextDisabled && timeRemaining && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Next compliment available in {timeRemaining}
                    </p>
                )}
            </div>

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

export default ControlButtons