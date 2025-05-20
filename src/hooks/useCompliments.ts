import { useState, useEffect } from 'react';
import compliments, { Compliment, MILESTONE_DAYS } from '../data/compliments';
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

  // Initialize on mount
  useEffect(() => {
    const { currentDay, viewedToday } = getStorageData();
    setDay(currentDay);
    setViewedToday(viewedToday);
    
    // Check if it's a new day
    if (isNewDay() && viewedToday) {
      // Reset viewed status for a new day
      setViewedToday(false);
    }
    
    // Get today's compliment
    const complimentIndex = (currentDay - 1) % compliments.length;
    setCurrentCompliment(compliments[complimentIndex]);
    
    // Check if today is a milestone day
    setIsMilestone(MILESTONE_DAYS.includes(currentDay));
  }, []);

  const viewNextCompliment = () => {
    // Only advance if not viewed today
    if (!viewedToday) {
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
    // Filter out already seen compliments and the current compliment
    const availableCompliments = compliments.filter(
      comp => !hasViewedSurpriseCompliment(comp.id) && comp.id !== currentCompliment?.id
    );
    
    // If all compliments have been viewed, reset and use all compliments
    const surprisePool = availableCompliments.length > 0 
      ? availableCompliments 
      : compliments.filter(comp => comp.id !== currentCompliment?.id);
    
    // Get random compliment
    const randomIndex = Math.floor(Math.random() * surprisePool.length);
    const surpriseCompliment = surprisePool[randomIndex];
    
    // Mark as viewed
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
    totalCompliments: compliments.length
  };
};