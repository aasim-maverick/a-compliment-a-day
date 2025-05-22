import { useState, useEffect, useCallback } from 'react';
import compliments, { Compliment, MILESTONE_DAYS, surpriseCompliments } from '../data/compliments';
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
  const [isLocked, setIsLocked] = useState(false);

  const updateTimeRemaining = useCallback(() => {
    const remaining = getTimeUntilNextCompliment();
    const formattedTime = formatTimeRemaining(remaining);
    setTimeRemaining(formattedTime);
    return remaining > 0;
  }, []);

  // Initialize on mount
  useEffect(() => {
    const { currentDay, lastUnlockTime } = getStorageData();
    setDay(currentDay);

    // Check if compliment is locked
    const locked = lastUnlockTime !== null && !canUnlockNextCompliment();
    setIsLocked(locked);
    setViewedToday(locked);

    // Get current compliment
    const complimentIndex = (currentDay - 1) % compliments.length;
    setCurrentCompliment(compliments[complimentIndex]);

    // Check if today is a milestone day
    setIsMilestone(MILESTONE_DAYS.includes(currentDay));

    // Initial time remaining update
    if (locked) {
      updateTimeRemaining();
    }
  }, [updateTimeRemaining]);

  // Update time remaining every second when locked
  useEffect(() => {
    if (!isLocked) {
      setTimeRemaining('');
      return;
    }

    const interval = setInterval(() => {
      const stillLocked = updateTimeRemaining();
      if (!stillLocked) {
        setIsLocked(false);
        // Don't reset viewedToday here - this was the bug!
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLocked, updateTimeRemaining]);

  const viewNextCompliment = () => {
    if (!isLocked && canUnlockNextCompliment()) {
      const newDay = day + 1;
      const complimentIndex = (newDay - 1) % compliments.length;

      setDay(newDay);
      setCurrentCompliment(compliments[complimentIndex]);
      setViewedToday(true);
      setIsLocked(true);

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
    if (!isLocked && canUnlockNextCompliment()) {
      setViewedToday(true);
      setIsLocked(true);
      markComplimentAsViewed();
      updateTimeRemaining();

      if (isMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  const getSurpriseCompliment = (): Compliment => {
    const availableCompliments = surpriseCompliments.filter(
        comp => !hasViewedSurpriseCompliment(comp.id) && comp.id !== currentCompliment?.id
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
    timeRemaining,
    viewNextCompliment,
    viewTodayCompliment,
    getSurpriseCompliment,
    totalCompliments: compliments.length
  };
};