import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const FloatingHearts: React.FC = () => {
  const [hearts, setHearts] = useState<JSX.Element[]>([]);

  useEffect(() => {
    generateHearts();
  }, []);

  const generateHearts = () => {
    const heartCount = 12;
    const elements: JSX.Element[] = [];

    for (let i = 0; i < heartCount; i++) {
      const left = Math.random() * 100;
      const size = Math.floor(Math.random() * 16) + 12;
      const delay = Math.random() * 10;
      const duration = Math.random() * 10 + 15;
      const opacity = Math.random() * 0.5 + 0.1;

      elements.push(
        <div
          key={i}
          className="absolute z-0"
          style={{
            left: `${left}%`,
            bottom: `-${size}px`,
            animation: `float ${duration}s infinite ease-in-out`,
            animationDelay: `${delay}s`,
            opacity,
          }}
        >
          <Heart 
            size={size} 
            className="text-primary-300 dark:text-primary-800" 
            fill="currentColor" 
          />
        </div>
      );
    }

    setHearts(elements);
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100px) rotate(20deg);
          }
        }
      `}</style>
      {hearts}
    </div>
  );
};

export default FloatingHearts;