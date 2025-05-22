import React, { useState, useEffect } from 'react';
import { useCompliments } from './hooks/useCompliments';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import ComplimentCard from './components/ComplimentCard';
import ControlButtons from './components/ControlButtons';
import MilestoneConfetti from './components/MilestoneConfetti';
import FloatingHearts from './components/FloatingHearts';
import SurpriseComplimentModal from './components/SurpriseComplimentModal';
import { Compliment } from './data/compliments';

function App() {
  const {
    currentCompliment,
    day,
    viewedToday,
    isMilestone,
    showConfetti,
    timeRemaining,
    viewNextCompliment,
    viewTodayCompliment,
    getSurpriseCompliment,
    totalCompliments
  } = useCompliments();

  const [isLoading, setIsLoading] = useState(true);
  const [surpriseCompliment, setSurpriseCompliment] = useState<Compliment | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      if (!viewedToday && currentCompliment) {
        viewTodayCompliment();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentCompliment, viewedToday, viewTodayCompliment]);

  const handleNextCompliment = () => {
    if (!viewedToday) {
      viewNextCompliment();
    }
  };

  const handleSurpriseMe = () => {
    const surprise = getSurpriseCompliment();
    setSurpriseCompliment(surprise);
  };

  const closeSurpriseModal = () => {
    setSurpriseCompliment(null);
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-24 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
    );
  }

  return (
      <ThemeProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
          <FloatingHearts />

          <div className="container mx-auto max-w-2xl px-4 py-8 flex flex-col items-center min-h-screen relative z-10">
            <Header day={day} totalDays={totalCompliments} />

            <main className="flex-1 w-full flex flex-col items-center justify-center py-8">
              <ComplimentCard compliment={currentCompliment} />

              <ControlButtons
                  onNextCompliment={handleNextCompliment}
                  onSurpriseMe={handleSurpriseMe}
                  isNextDisabled={viewedToday}
                  timeRemaining={timeRemaining}
              />
            </main>

            <footer className="w-full py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Made with ❤️ for the one I love</p>
            </footer>
          </div>

          {showConfetti && <MilestoneConfetti show={showConfetti} day={day} />}

          {surpriseCompliment && (
              <SurpriseComplimentModal
                  compliment={surpriseCompliment}
                  onClose={closeSurpriseModal}
              />
          )}
        </div>
      </ThemeProvider>
  );
}

export default App;