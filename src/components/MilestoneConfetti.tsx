import React, { useEffect, useState } from 'react';

interface MilestoneConfettiProps {
  show: boolean;
  day: number;
}

const MilestoneConfetti: React.FC<MilestoneConfettiProps> = ({ show, day }) => {
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (show) {
      generateConfetti();
    } else {
      setConfetti([]);
    }
  }, [show]);

  const generateConfetti = () => {
    const confettiCount = 100;
    const elements: JSX.Element[] = [];

    for (let i = 0; i < confettiCount; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const initialDelay = Math.random() * 0.5;
      const rotation = Math.random() * 360;
      const color = getRandomColor();
      const size = Math.floor(Math.random() * 10) + 5;
      const duration = Math.random() * 3 + 2;

      elements.push(
        <div
          key={i}
          className="absolute"
          style={{
            left: `${left}%`,
            top: '-20px',
            transform: `rotate(${rotation}deg)`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: i % 2 === 0 ? '50%' : '0%',
            animation: `fall ${duration}s forwards`,
            animationDelay: `${initialDelay + animationDelay}s`,
            opacity: 0,
          }}
        />
      );
    }

    setConfetti(elements);
  };

  const getRandomColor = () => {
    const colors = [
      '#ec4899', // primary-500
      '#8b5cf6', // secondary-500
      '#6366f1', // accent-500
      '#f472b6', // primary-400
      '#a78bfa', // secondary-400
      '#818cf8', // accent-400
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
      
      {confetti}
      
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-xl shadow-xl text-center border-2 border-primary-400 animate-bounce">
          <h2 className="text-2xl md:text-3xl font-handwriting font-bold text-primary-600 dark:text-primary-400">
            🎉 Milestone Day {day}! 🎉
          </h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {day} days of compliments shared with love!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MilestoneConfetti;