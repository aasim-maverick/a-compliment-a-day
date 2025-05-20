import { useState, useEffect } from 'react';
import compliments, { Compliment, MILESTONE_DAYS, surpriseCompliments } from '../data/compliments';
import {
  getStorageData,
  isNewDay,
  advanceToNextDay,
  markComplimentAsViewed,
  addSurpriseCompliment,
  hasViewedSurpriseCompliment
} from '../utils/storageUtils';

export const useCompliments = () => {
  const [currentCompliment, setCurrentCompliment] = useState<Compliment | null>(null);
  const [day, setDay] = useState(1);
  const [viewedToday, setViewedToday] = useState(false);
  const [isMilestone, setIsMilestone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const { currentDay, viewedToday } = getStorageData();
    setDay(currentDay);
    setViewedToday(viewedToday);

    if (isNewDay() && viewedToday) {
      setViewedToday(false);
    }

    // Get today's compliment (now using modulo 365)
    const complimentIndex = (currentDay - 1) % 365;
    setCurrentCompliment(compliments[complimentIndex]);

    setIsMilestone(MILESTONE_DAYS.includes(currentDay));
  }, []);

  const viewNextCompliment = () => {
    if (!viewedToday) {
      const newDay = day + 1;
      const complimentIndex = (newDay - 1) % 365;

      setDay(newDay);
      setCurrentCompliment(compliments[complimentIndex]);
      setViewedToday(true);

      const isNewMilestone = MILESTONE_DAYS.includes(newDay);
      setIsMilestone(isNewMilestone);

      if (isNewMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      advanceToNextDay();
    }
  };

  const viewTodayCompliment = () => {
    if (!viewedToday) {
      setViewedToday(true);
      markComplimentAsViewed();

      if (isMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const getSurpriseCompliment = (): Compliment => {
    // Use surprise compliments pool instead of main compliments
    const availableCompliments = surpriseCompliments.filter(
        comp => !hasViewedSurpriseCompliment(comp.id)
    );

    const surprisePool = availableCompliments.length > 0
        ? availableCompliments
        : surpriseCompliments;

    const randomIndex = Math.floor(Math.random() * surprisePool.length);
    const surpriseCompliment = surprisePool[randomIndex];

    addSurpriseCompliment(surpriseCompliment.id);

    return surpriseCompliment;
  };

  return {
    currentCompliment,
    day,
    viewedToday,
    isMilestone,
    showConfetti,
    viewNextCompliment,
    viewTodayCompliment,
    getSurpriseCompliment,
    totalCompliments: 365 // Updated to reflect 365 days
  };
};