export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

// T003: Extended MealEntry with optional macros
export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
  mealType?: MealType;
  protein?: number;  // grams, 1 decimal precision
  carbs?: number;    // grams, 1 decimal precision
  fat?: number;      // grams, 1 decimal precision
}

// T002: NutritionAnalysis - response from AI webhook
export interface NutritionAnalysis {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// T002: FoodImage - transient image during analysis
export interface FoodImage {
  file: File;
  previewUrl: string;  // URL.createObjectURL() result
}

// T002: AnalysisStatus - current state of analysis
export type AnalysisStatus =
  | 'idle'       // No image selected
  | 'ready'      // Image selected, ready to analyze
  | 'analyzing'  // Analysis in progress
  | 'success'    // Analysis complete
  | 'error';     // Analysis failed

// T002: AnalysisState - full analysis state
export interface AnalysisState {
  status: AnalysisStatus;
  error: string | null;
  retryCount: number;
}

export const initialAnalysisState: AnalysisState = {
  status: 'idle',
  error: null,
  retryCount: 0,
};

// T004: Extended AddFoodFormData with macros
export interface AddFoodFormData {
  name: string;
  calories: string;
  mealType: MealType | '';
  protein: string;
  carbs: string;
  fat: string;
}

export const initialFormData: AddFoodFormData = {
  name: '',
  calories: '',
  mealType: '',
  protein: '',
  carbs: '',
  fat: '',
};

// T005: Format macro value to 1 decimal place
export function formatMacro(value: number | undefined): string {
  if (value === undefined || value === null) return '';
  return `${value.toFixed(1)}g`;
}

// T005: Parse macro input string to number
export function parseMacro(input: string): number | undefined {
  if (!input.trim()) return undefined;
  const num = parseFloat(input);
  if (isNaN(num) || num < 0) return undefined;
  return Math.round(num * 10) / 10; // Round to 1 decimal
}

// T006: Convert NutritionAnalysis to form data for pre-filling
export function analysisToFormData(analysis: NutritionAnalysis): AddFoodFormData {
  return {
    name: analysis.food_name,
    calories: analysis.calories.toString(),
    mealType: '',
    protein: analysis.protein.toFixed(1),
    carbs: analysis.carbs.toFixed(1),
    fat: analysis.fat.toFixed(1),
  };
}

export function getConsumedCalories(meals: MealEntry[]): number {
  return meals.reduce((sum, meal) => sum + meal.calories, 0);
}
