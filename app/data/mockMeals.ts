import { MealEntry } from '@/app/types/meal';

export const DAILY_CALORIE_TARGET = 2000;

export const mockMeals: MealEntry[] = [
  {
    id: '1',
    name: 'Oatmeal with Berries',
    calories: 350,
    timestamp: new Date(new Date().setHours(8, 30, 0, 0)),
    mealType: 'Breakfast',
  },
  {
    id: '2',
    name: 'Grilled Chicken Salad',
    calories: 450,
    timestamp: new Date(new Date().setHours(12, 30, 0, 0)),
    mealType: 'Lunch',
  },
  {
    id: '3',
    name: 'Protein Bar',
    calories: 200,
    timestamp: new Date(new Date().setHours(15, 0, 0, 0)),
    mealType: 'Snack',
  },
  {
    id: '4',
    name: 'Salmon with Vegetables',
    calories: 550,
    timestamp: new Date(new Date().setHours(19, 0, 0, 0)),
    mealType: 'Dinner',
  },
];

// Total: 1550 calories (77.5% of 2000 target)
