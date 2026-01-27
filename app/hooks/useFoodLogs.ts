// app/hooks/useFoodLogs.ts
// React hook for managing food logs with Supabase persistence

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MealEntry } from '@/app/types/meal';
import { getFoodLogsByDate, createFoodLog, deleteFoodLog } from '@/lib/services/foodLogs';

interface UseFoodLogsResult {
  meals: MealEntry[];
  isLoading: boolean;
  error: string | null;
  addMeal: (meal: Omit<MealEntry, 'id'>) => Promise<void>;
  removeMeal: (id: string) => Promise<void>;
  refreshMeals: () => Promise<void>;
}

/**
 * Hook for managing food logs with database persistence
 * @param date - The date to fetch logs for (defaults to today)
 */
export function useFoodLogs(date?: Date): UseFoodLogsResult {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize date string to prevent unnecessary re-renders
  const dateKey = useMemo(() => {
    const d = date ?? new Date();
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }, [date]);

  // Fetch meals for the specified date
  const refreshMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchDate = date ?? new Date();
      const fetchedMeals = await getFoodLogsByDate(fetchDate);
      setMeals(fetchedMeals);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load meals';
      setError(message);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  // Initial fetch on mount and when date changes
  useEffect(() => {
    refreshMeals();
  }, [refreshMeals]);

  // Add a new meal
  const addMeal = useCallback(async (meal: Omit<MealEntry, 'id'>) => {
    setError(null);

    try {
      const newMeal = await createFoodLog(meal);
      setMeals((prev) => [...prev, newMeal]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add meal';
      setError(message);
      throw err; // Re-throw so caller can handle
    }
  }, []);

  // Remove a meal
  const removeMeal = useCallback(async (id: string) => {
    setError(null);

    try {
      await deleteFoodLog(id);
      setMeals((prev) => prev.filter((meal) => meal.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove meal';
      setError(message);
      throw err;
    }
  }, []);

  return {
    meals,
    isLoading,
    error,
    addMeal,
    removeMeal,
    refreshMeals,
  };
}
