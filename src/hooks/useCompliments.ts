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
  const [canUnlockNext, setCanUnlockNext] = useState(false);

  const updateTimeRemaining = useCallback(() => {
    const remaining = getTimeUntilNextCompliment();
    const formattedTime = formatTimeRemaining(remaining);
    setTimeRemaining(formattedTime);

    // Update whether we can unlock the next compliment
    const canUnlock = canUnlockNextCompliment();
    setCanUnlockNext(canUnlock);

    return remaining > 0;
  }, []);

  // Initialize on mount
  useEffect(() => {
    const { currentDay, lastUnlockTime, viewedToday: hasViewedToday } = getStorageData();
    setDay(currentDay);
    setViewedToday(hasViewedToday);

    // Get current compliment
    const complimentIndex = (currentDay - 1) % compliments.length;
    setCurrentCompliment(compliments[complimentIndex]);

    // Check if today is a milestone day
    setIsMilestone(MILESTONE_DAYS.includes(currentDay));

    // Update time remaining and unlock status
    updateTimeRemaining();
  }, [updateTimeRemaining]);

  // Update time remaining every second when there's a timer running
  useEffect(() => {
    // Only run timer if we have viewed today's compliment and can't unlock next yet
    if (!viewedToday || canUnlockNext) {
      setTimeRemaining('');
      return;
    }

    const interval = setInterval(() => {
      updateTimeRemaining();
    }, 1000);

    return () => clearInterval(interval);
  }, [viewedToday, canUnlockNext, updateTimeRemaining]);

  const viewNextCompliment = () => {
    if (canUnlockNext) {
      const newDay = day + 1;
      const complimentIndex = (newDay - 1) % compliments.length;

      setDay(newDay);
      setCurrentCompliment(compliments[complimentIndex]);
      setViewedToday(true);
      setCanUnlockNext(false);

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
    if (!viewedToday) {
      setViewedToday(true);
      setCanUnlockNext(false);
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
    canUnlockNext,
    viewNextCompliment,
    viewTodayCompliment,
    getSurpriseCompliment,
    totalCompliments: compliments.length
  };
};