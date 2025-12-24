# Data Model: Daily Dashboard

**Feature**: 002-daily-dashboard
**Date**: 2025-12-24

## Overview

Data model for the daily dashboard feature. Since database integration is deferred (FR-007), all entities are TypeScript interfaces used with React state.

---

## Entities

### MealEntry

Represents a single food/meal logged by the user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (UUID) |
| `name` | `string` | Yes | Food/meal name |
| `calories` | `number` | Yes | Calorie count (positive integer) |
| `timestamp` | `Date` | Yes | When the meal was consumed |
| `mealType` | `MealType \| undefined` | No | Optional category |

**TypeScript Definition:**
```typescript
// app/types/meal.ts

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
  mealType?: MealType;
}
```

**Validation Rules:**
- `name`: Non-empty string, trimmed
- `calories`: Positive integer (> 0)
- `timestamp`: Valid Date, defaults to current time if not provided
- `mealType`: One of enum values or undefined

---

### DailySummary

Represents the user's daily calorie tracking summary.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | `Date` | Yes | The date being tracked |
| `targetCalories` | `number` | Yes | Daily calorie goal |
| `consumedCalories` | `number` | Computed | Sum of all meal calories |

**TypeScript Definition:**
```typescript
// app/types/meal.ts

export interface DailySummary {
  date: Date;
  targetCalories: number;
}

// Computed helper
export function getConsumedCalories(meals: MealEntry[]): number {
  return meals.reduce((sum, meal) => sum + meal.calories, 0);
}

export function getRemainingCalories(summary: DailySummary, meals: MealEntry[]): number {
  const consumed = getConsumedCalories(meals);
  return summary.targetCalories - consumed;
}

export function getProgressPercentage(summary: DailySummary, meals: MealEntry[]): number {
  const consumed = getConsumedCalories(meals);
  return Math.round((consumed / summary.targetCalories) * 100);
}
```

---

### AddFoodFormData

Form input data for adding a new meal entry.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Food name input |
| `calories` | `string` | Yes | Calories as string (from input) |
| `mealType` | `MealType \| ''` | No | Selected meal type or empty |

**TypeScript Definition:**
```typescript
// app/types/meal.ts

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
```

---

## State Transitions

### Dashboard State

```
Initial Load
    │
    ▼
┌─────────────────────────────────┐
│  State: {                       │
│    meals: MealEntry[],          │
│    summary: DailySummary,       │
│    isFormOpen: boolean          │
│  }                              │
└─────────────────────────────────┘
    │
    │ User clicks "Add Food"
    ▼
┌─────────────────────────────────┐
│  isFormOpen: true               │
│  Form displayed inline          │
└─────────────────────────────────┘
    │
    │ User submits valid form
    ▼
┌─────────────────────────────────┐
│  meals: [...meals, newMeal]     │
│  isFormOpen: false              │
│  Progress recalculated          │
└─────────────────────────────────┘
```

---

## Mock Data

### Sample Meals (app/data/mockMeals.ts)

```typescript
import { MealEntry, DailySummary } from '@/app/types/meal';

export const DAILY_CALORIE_TARGET = 2000;

export const mockDailySummary: DailySummary = {
  date: new Date(),
  targetCalories: DAILY_CALORIE_TARGET,
};

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
```

---

## Relationships

```
DailySummary (1) ─────────────► (0..*) MealEntry
     │                                    │
     │ date                               │ timestamp
     │ targetCalories                     │ (same day)
     │                                    │
     └────────────────────────────────────┘
           filtered by date match
```

---

## Notes

- No database persistence (FR-007)
- All data lives in React state
- Page refresh resets to mock data
- Future database integration should be straightforward with these interfaces
