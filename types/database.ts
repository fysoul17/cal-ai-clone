// types/database.ts
// TypeScript types for Supabase database tables

import type { MealType } from '@/app/types/meal';

/**
 * Database row shape for food_logs table
 */
export interface FoodLogRow {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meal_type: MealType | null;
  logged_at: string;
  created_at: string;
}

/**
 * Insert payload for food_logs (user_id auto-set from auth)
 */
export interface FoodLogInsert {
  food_name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  meal_type?: MealType | null;
  logged_at?: string;
}
