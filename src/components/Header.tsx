import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { getTodayDateFormatted } from '../utils/storageUtils';

interface HeaderProps {
  day: number;
  totalDays: number;
}

const Header: React.FC<HeaderProps> = ({ day, totalDays }) => {
  const { theme, toggleTheme } = useTheme();
  const todayDate = getTodayDateFormatted();

  return (
    <header className="w-full p-4 flex flex-col items-center text-center">
      <div className="flex w-full justify-between items-center mb-2">
        <div className="tracking-wide font-handwriting text-lg text-primary-600 dark:text-primary-400">
          {todayDate}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-primary-700" />
          ) : (
            <Sun size={20} className="text-primary-400" />
          )}
        </button>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-handwriting font-bold text-primary-700 dark:text-primary-400 mb-2">
        A Compliment A Day
      </h1>
      
      <div className="text-sm md:text-base text-gray-600 dark:text-gray-300 flex items-center gap-2">
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 rounded-full">
          Day {day} of {totalDays}
        </span>
      </div>
    </header>
  );
};

export default Header;