# Data Model: Image-Based Food Input with AI Analysis

**Feature**: 003-image-food-webhook
**Date**: 2026-01-27

## Overview

Extends the existing meal data model to support image upload, AI analysis results, and macronutrient tracking. Since database integration is still deferred, all entities remain as TypeScript interfaces used with React state.

---

## Entity Changes

### MealEntry (MODIFIED)

Extended to include macronutrient data returned from AI analysis.

| Field | Type | Required | Description | Change |
|-------|------|----------|-------------|--------|
| `id` | `string` | Yes | Unique identifier (UUID) | Existing |
| `name` | `string` | Yes | Food/meal name | Existing |
| `calories` | `number` | Yes | Calorie count (positive integer) | Existing |
| `timestamp` | `Date` | Yes | When the meal was consumed | Existing |
| `mealType` | `MealType \| undefined` | No | Optional category | Existing |
| `protein` | `number \| undefined` | No | Protein in grams (1 decimal) | **NEW** |
| `carbs` | `number \| undefined` | No | Carbohydrates in grams (1 decimal) | **NEW** |
| `fat` | `number \| undefined` | No | Fat in grams (1 decimal) | **NEW** |

**TypeScript Definition:**
```typescript
// app/types/meal.ts (modified)

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
  mealType?: MealType;
  // NEW: macronutrient fields
  protein?: number;  // grams, 1 decimal precision
  carbs?: number;    // grams, 1 decimal precision
  fat?: number;      // grams, 1 decimal precision
}
```

**Validation Rules:**
- `protein`: Non-negative number, displayed with 1 decimal place
- `carbs`: Non-negative number, displayed with 1 decimal place
- `fat`: Non-negative number, displayed with 1 decimal place
- All macro fields are optional (manual entry may not include them)

---

### NutritionAnalysis (NEW)

Represents the response from the AI webhook analysis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `food_name` | `string` | Yes | AI-identified food name |
| `calories` | `number` | Yes | Calorie count (integer) |
| `protein` | `number` | Yes | Protein in grams (float) |
| `carbs` | `number` | Yes | Carbohydrates in grams (float) |
| `fat` | `number` | Yes | Fat in grams (float) |

**TypeScript Definition:**
```typescript
// app/types/meal.ts

export interface NutritionAnalysis {
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
```

**Validation Rules:**
- All fields required in webhook response
- Missing fields treated as 0 (per edge case spec)
- `food_name` may be a description like "Unknown food item"

---

### FoodImage (NEW - Transient)

Represents the uploaded image during analysis. Not persisted after analysis completes (per spec: "discarded after analysis").

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | `File` | Yes | The image file object |
| `previewUrl` | `string` | Yes | Object URL for preview display |

**TypeScript Definition:**
```typescript
// app/types/meal.ts

export interface FoodImage {
  file: File;
  previewUrl: string;  // URL.createObjectURL() result
}
```

**Lifecycle:**
1. Created when user selects/drops image
2. Preview URL displayed in UI
3. File sent to webhook for analysis
4. Both discarded after analysis completes (or on cancel)
5. `URL.revokeObjectURL()` called to free memory

---

### AnalysisState (NEW)

Represents the current state of the image analysis process.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | `AnalysisStatus` | Yes | Current state of analysis |
| `error` | `string \| null` | No | Error message if failed |
| `retryCount` | `number` | Yes | Number of retry attempts (0-3) |

**TypeScript Definition:**
```typescript
// app/types/meal.ts

export type AnalysisStatus =
  | 'idle'       // No image selected
  | 'ready'      // Image selected, ready to analyze
  | 'analyzing'  // Analysis in progress
  | 'success'    // Analysis complete
  | 'error';     // Analysis failed

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
```

---

### AddFoodFormData (MODIFIED)

Extended to include macronutrient fields for AI-analyzed data.

| Field | Type | Required | Description | Change |
|-------|------|----------|-------------|--------|
| `name` | `string` | Yes | Food name input | Existing |
| `calories` | `string` | Yes | Calories as string | Existing |
| `mealType` | `MealType \| ''` | No | Selected meal type | Existing |
| `protein` | `string` | No | Protein as string | **NEW** |
| `carbs` | `string` | No | Carbs as string | **NEW** |
| `fat` | `string` | No | Fat as string | **NEW** |

**TypeScript Definition:**
```typescript
// app/types/meal.ts (modified)

export interface AddFoodFormData {
  name: string;
  calories: string;
  mealType: MealType | '';
  // NEW: macronutrient fields
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
```

---

## State Transitions

### Image Upload & Analysis Flow

```
User clicks "+ Add"
    │
    ▼
┌─────────────────────────────────┐
│  AddFoodModal: 'image-upload'   │
│  - ImageUpload component shown  │
│  - "Enter manually" link        │
└─────────────────────────────────┘
    │                      │
    │ User selects image   │ User clicks "Enter manually"
    ▼                      ▼
┌───────────────────┐   ┌─────────────────────────────────┐
│ FoodImage created │   │  AddFoodModal: 'manual-entry'   │
│ Preview displayed │   │  - AddFoodForm shown (empty)    │
└───────────────────┘   └─────────────────────────────────┘
    │
    │ User clicks "Analyze"
    ▼
┌─────────────────────────────────┐
│  AnalysisState: 'analyzing'    │
│  - Loading spinner shown        │
│  - "Analyzing your meal..."     │
└─────────────────────────────────┘
    │
    │ Webhook response received
    ├─────────────────────────────┐
    │ Success                     │ Failure (after 3 retries)
    ▼                             ▼
┌───────────────────────────┐  ┌─────────────────────────────────┐
│ NutritionAnalysis stored  │  │  AnalysisState: 'error'        │
│ Form pre-filled           │  │  - Error message shown          │
│ User can edit & save      │  │  - "Try again" or "Manual entry"│
└───────────────────────────┘  └─────────────────────────────────┘
    │
    │ User clicks "Add Food"
    ▼
┌─────────────────────────────────┐
│  MealEntry created with macros  │
│  Added to meals state           │
│  Modal closes                   │
└─────────────────────────────────┘
```

---

## Helper Functions

### Formatting Macros

```typescript
// app/types/meal.ts

/**
 * Format macro value to 1 decimal place
 * @param value - The numeric value (may be undefined)
 * @returns Formatted string like "25.5g" or empty string
 */
export function formatMacro(value: number | undefined): string {
  if (value === undefined || value === null) return '';
  return `${value.toFixed(1)}g`;
}

/**
 * Parse macro input string to number
 * @param input - String from form input
 * @returns Number or undefined if invalid/empty
 */
export function parseMacro(input: string): number | undefined {
  if (!input.trim()) return undefined;
  const num = parseFloat(input);
  if (isNaN(num) || num < 0) return undefined;
  return Math.round(num * 10) / 10; // Round to 1 decimal
}
```

### Converting Analysis to Form Data

```typescript
// app/types/meal.ts

/**
 * Convert NutritionAnalysis to form data for pre-filling
 */
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
```

---

## Relationships

```
FoodImage (transient)
    │
    │ analyzed by webhook
    ▼
NutritionAnalysis ─────────► AddFoodFormData (pre-fills)
                                    │
                                    │ user submits
                                    ▼
                              MealEntry (persisted in state)
                                    │
                                    │ aggregated by
                                    ▼
                              DailySummary
```

---

## Notes

- No database persistence (continues from 002-daily-dashboard)
- FoodImage is purely transient - never persisted
- NutritionAnalysis only exists between webhook response and form submission
- MealEntry macros (protein, carbs, fat) are optional for backward compatibility
- Mock data can be updated to include macros for UI testing
