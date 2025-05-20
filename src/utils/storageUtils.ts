const STORAGE_KEY = 'compliment_a_day';

interface ComplimentStorage {
  lastViewedDate: string;
  currentDay: number;
  viewedToday: boolean;
  surpriseComplimentsViewed: number[];
}

export const getStorageData = (): ComplimentStorage => {
  const data = localStorage.getItem(STORAGE_KEY);
  
  if (!data) {
    return {
      lastViewedDate: '',
      currentDay: 1,
      viewedToday: false,
      surpriseComplimentsViewed: [],
    };
  }
  
  return JSON.parse(data);
};

export const setStorageData = (data: ComplimentStorage): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const isSameDay = (date1: string, date2: string): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const isNewDay = (): boolean => {
  const { lastViewedDate } = getStorageData();
  const today = new Date().toISOString().split('T')[0];
  
  if (!lastViewedDate) return true;
  
  return !isSameDay(lastViewedDate, today);
};

export const markComplimentAsViewed = (): void => {
  const data = getStorageData();
  const today = new Date().toISOString().split('T')[0];
  
  setStorageData({
    ...data,
    lastViewedDate: today,
    viewedToday: true,
  });
};

export const resetViewedStatus = (): void => {
  const data = getStorageData();
  
  setStorageData({
    ...data,
    viewedToday: false,
  });
};

export const advanceToNextDay = (): void => {
  const data = getStorageData();
  const today = new Date().toISOString().split('T')[0];
  
  setStorageData({
    ...data,
    lastViewedDate: today,
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