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
  const [canUnlock, setCanUnlock] = useState(false);

  const updateUnlockStatus = useCallback(() => {
    const canUnlockNow = canUnlockNextCompliment();
    const remaining = getTimeUntilNextCompliment();

    setCanUnlock(canUnlockNow);

    if (canUnlockNow) {
      setTimeRemaining('');
    } else {
      setTimeRemaining(formatTimeRemaining(remaining));
    }

    return canUnlockNow;
  }, []);

  // Initialize on mount
  useEffect(() => {
    const { currentDay, lastUnlockTime } = getStorageData();
    setDay(currentDay);
    setViewedToday(lastUnlockTime !== null);

    // Get current compliment
    const complimentIndex = (currentDay - 1) % compliments.length;
    setCurrentCompliment(compliments[complimentIndex]);

    // Check if today is a milestone day
    setIsMilestone(MILESTONE_DAYS.includes(currentDay));

    // Set initial unlock status
    updateUnlockStatus();
  }, [updateUnlockStatus]);

  // Update unlock status every second, but only if we can't unlock yet
  useEffect(() => {
    if (canUnlock) {
      return; // Stop timer if we can already unlock
    }

    const interval = setInterval(() => {
      updateUnlockStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [canUnlock, updateUnlockStatus]);

  const viewNextCompliment = () => {
    if (canUnlock) {
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

      // Update storage with new timestamp
      advanceToNextDay();

      // Update unlock status (will disable button and start timer)
      updateUnlockStatus();
    }
  };

  const viewTodayCompliment = () => {
    if (canUnlock) {
      setViewedToday(true);

      // Store timestamp for first view
      markComplimentAsViewed();

      if (isMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      // Update unlock status (will disable button and start timer)
      updateUnlockStatus();
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
    canUnlock,
    viewNextCompliment,
    viewTodayCompliment,
    getSurpriseCompliment,
    totalCompliments: compliments.length
  };
};