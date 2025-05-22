import { useState, useEffect, useCallback } from 'react';
import compliments, { Compliment, MILESTONE_DAYS } from '../data/compliments';
import {
  getStorageData,
  canUnlockNextCompliment,
  getTimeUntilNextCompliment,
  advanceToNextDay,
  markComplimentAsViewed,
  addSurpriseCompliment,
  hasViewedSurpriseCompliment,
  formatTimeRemaining
} from '../utils/storageUtils';

export const useCompliments = () => {
  const [currentCompliment, setCurrentCompliment] = useState<Compliment | null>(null);
  const [day, setDay] = useState(1);
  const [viewedToday, setViewedToday] = useState(false);
  const [isMilestone, setIsMilestone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const updateTimeRemaining = useCallback(() => {
    if (viewedToday) {
      const remaining = getTimeUntilNextCompliment();
      setTimeRemaining(formatTimeRemaining(remaining));
      return remaining > 0;
    }
    return false;
  }, [viewedToday]);

  // Initialize on mount
  useEffect(() => {
    const { currentDay, viewedToday } = getStorageData();
    setDay(currentDay);

    // Check if 24 hours have passed
    const isLocked = !canUnlockNextCompliment();
    setViewedToday(isLocked);

    // Get current compliment
    const complimentIndex = (currentDay - 1) % compliments.length;
    setCurrentCompliment(compliments[complimentIndex]);

    // Check if today is a milestone day
    setIsMilestone(MILESTONE_DAYS.includes(currentDay));

    // Initial time remaining update
    if (isLocked) {
      updateTimeRemaining();
    }
  }, [updateTimeRemaining]);

  // Update time remaining every minute
  useEffect(() => {
    if (!viewedToday) return;

    const interval = setInterval(() => {
      const stillLocked = updateTimeRemaining();
      if (!stillLocked) {
        setViewedToday(false);
        clearInterval(interval);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [viewedToday, updateTimeRemaining]);

  const viewNextCompliment = () => {
    if (!viewedToday && canUnlockNextCompliment()) {
      const newDay = day + 1;
      const complimentIndex = (newDay - 1) % compliments.length;

      setDay(newDay);
      setCurrentCompliment(compliments[complimentIndex]);
      setViewedToday(true);

      // Check if milestone day
      const isNewMilestone = MILESTONE_DAYS.includes(newDay);
      setIsMilestone(isNewMilestone);

      if (isNewMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      // Update storage
      advanceToNextDay();
      updateTimeRemaining();
    }
  };

  const viewTodayCompliment = () => {
    if (!viewedToday && canUnlockNextCompliment()) {
      setViewedToday(true);
      markComplimentAsViewed();
      updateTimeRemaining();

      if (isMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const getSurpriseCompliment = (): Compliment => {
    const availableCompliments = compliments.filter(
        comp => !hasViewedSurpriseCompliment(comp.id) && comp.id !== currentCompliment?.id
    );

    const surprisePool = availableCompliments.length > 0
        ? availableCompliments
        : compliments.filter(comp => comp.id !== currentCompliment?.id);

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
    timeRemaining,
    viewNextCompliment,
    viewTodayCompliment,
    getSurpriseCompliment,
    totalCompliments: compliments.length
  };
};