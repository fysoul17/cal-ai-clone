export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
  mealType?: MealType;
}

export interface AddFoodFormData {
  name: string;
  calories: string;
  mealType: MealType | '';
}

export const initialFormData: AddFoodFormData = {
  name: '',
  calories: '',
  mealType: '',
};

export function getConsumedCalories(meals: MealEntry[]): number {
  return meals.reduce((sum, meal) => sum + meal.calories, 0);
}
