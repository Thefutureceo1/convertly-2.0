import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';

export function useCredits() {
  const [credits, setCredits] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken, isSignedIn } = useAuth();

  const fetchCredits = useCallback(async () => {
    if (!isSignedIn) return;
    
    try {
      const token = await getToken();
      const response = await fetch('/api/credits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.credits !== undefined) {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error('Failed to fetch credits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      fetchCredits();
    } else {
      setIsLoading(false);
    }
  }, [isSignedIn, fetchCredits]);

  const spendCredit = async () => {
    if (!isSignedIn) return false;
    
    try {
      const token = await getToken();
      const response = await fetch('/api/credits/spend', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setCredits(data.credits);
        return true;
      }
    } catch (err) {
      console.error('Failed to spend credit:', err);
    }
    return false;
  };

  const addCredits = async (amount: number) => {
    if (!isSignedIn) return;
    
    try {
      const token = await getToken();
      const response = await fetch('/api/credits/add', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount })
      });
      const data = await response.json();
      if (data.success) {
        setCredits(data.credits);
      }
    } catch (err) {
      console.error('Failed to add credits:', err);
    }
  };

  return { credits, spendCredit, addCredits, isLoading };
}
