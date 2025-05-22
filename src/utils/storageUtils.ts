const STORAGE_KEY = 'compliment_a_day';
const UNLOCK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds


interface ComplimentStorage {
  lastUnlockTime: number | null;
  currentDay: number;
  viewedToday: boolean;
  surpriseComplimentsViewed: number[];
}


export const getStorageData = (): ComplimentStorage => {
  const data = localStorage.getItem(STORAGE_KEY);


  if (!data) {
    const initialData = {
      lastUnlockTime: null,
      currentDay: 1,
      viewedToday: false,
      surpriseComplimentsViewed: [],
    };
    setStorageData(initialData);
    return initialData;
  }


  return JSON.parse(data);
};


export const setStorageData = (data: ComplimentStorage): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};


export const getTimeUntilNextCompliment = (): number => {
  const { lastUnlockTime } = getStorageData();
  if (!lastUnlockTime) return 0;


  const now = Date.now();
  const timePassed = now - lastUnlockTime;
  return Math.max(UNLOCK_INTERVAL - timePassed, 0);
};


export const canUnlockNextCompliment = (): boolean => {
  const { lastUnlockTime } = getStorageData();
  if (!lastUnlockTime) return true;


  const now = Date.now();
  const timePassed = now - lastUnlockTime;
  return timePassed >= UNLOCK_INTERVAL;
};


export const markComplimentAsViewed = (): void => {
  const data = getStorageData();


  setStorageData({
    ...data,
    lastUnlockTime: Date.now(),
    viewedToday: true,
  });
};


export const advanceToNextDay = (): void => {
  const data = getStorageData();


  setStorageData({
    ...data,
    lastUnlockTime: Date.now(),
    currentDay: data.currentDay + 1,
    viewedToday: true,
  });
};


export const addSurpriseCompliment = (id: number): void => {
  const data = getStorageData();


  setStorageData({
    ...data,
    surpriseComplimentsViewed: [...data.surpriseComplimentsViewed, id],
  });
};


export const hasViewedSurpriseCompliment = (id: number): boolean => {
  const { surpriseComplimentsViewed } = getStorageData();
  return surpriseComplimentsViewed.includes(id);
};


export const getTodayDateFormatted = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };


  return new Date().toLocaleDateString('en-US', options);
};


export const formatTimeRemaining = (ms: number): string => {
  if (!ms || isNaN(ms)) return '';


  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);


  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};