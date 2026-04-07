import { useState, useEffect } from 'react';

const INITIAL_CREDITS = 10;
const STORAGE_KEY = 'convertly_credits';

export function useCredits() {
  const [credits, setCredits] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? parseInt(saved, 10) : INITIAL_CREDITS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, credits.toString());
  }, [credits]);

  const spendCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    return false;
  };

  const addCredits = (amount: number) => {
    setCredits(prev => prev + amount);
  };

  return { credits, spendCredit, addCredits };
}
