// lib/services/foodLogs.ts
// Service layer for food log CRUD operations

import { createClient } from '@/lib/supabase/client';
import type { FoodLogRow, FoodLogInsert } from '@/types/database';
import type { MealEntry } from '@/app/types/meal';

/**
 * Convert database row to MealEntry format
 */
export function foodLogRowToMealEntry(row: FoodLogRow): MealEntry {
  return {
    id: row.id,
    name: row.food_name,
    calories: row.calories,
    timestamp: new Date(row.logged_at),
    mealType: row.meal_type ?? undefined,
    protein: row.protein,
    carbs: row.carbs,
    fat: row.fat,
  };
}

/**
 * Convert MealEntry to database insert format
 */
export function mealEntryToFoodLogInsert(meal: Omit<MealEntry, 'id'>): FoodLogInsert {
  return {
    food_name: meal.name,
    calories: meal.calories,
    protein: meal.protein ?? 0,
    carbs: meal.carbs ?? 0,
    fat: meal.fat ?? 0,
    meal_type: meal.mealType ?? null,
    logged_at: meal.timestamp.toISOString(),
  };
}

/**
 * Fetch food logs for a specific date (user's local date)
 */
export async function getFoodLogsByDate(date: Date): Promise<MealEntry[]> {
  const supabase = createClient();

  // Get start and end of day in UTC
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('food_logs')
    .select('*')
    .gte('logged_at', startOfDay.toISOString())
    .lte('logged_at', endOfDay.toISOString())
    .order('logged_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch food logs: ${error.message}`);
  }

  return (data as FoodLogRow[]).map(foodLogRowToMealEntry);
}

/**
 * Create a new food log entry
 */
export async function createFoodLog(meal: Omit<MealEntry, 'id'>): Promise<MealEntry> {
  const supabase = createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const insertData = {
    ...mealEntryToFoodLogInsert(meal),
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from('food_logs')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create food log: ${error.message}`);
  }

  return foodLogRowToMealEntry(data as FoodLogRow);
}

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Delete a food log entry
 */
export async function deleteFoodLog(id: string): Promise<void> {
  if (!UUID_REGEX.test(id)) {
    throw new Error('Invalid food log ID');
  }

  const supabase = createClient();

  const { error } = await supabase
    .from('food_logs')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete food log: ${error.message}`);
  }
}
