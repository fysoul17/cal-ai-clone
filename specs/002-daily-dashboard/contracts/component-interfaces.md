# Component Interfaces: Daily Dashboard

**Feature**: 002-daily-dashboard
**Date**: 2025-12-24

## Overview

Since this feature has no backend API (FR-007: mock data only, FR-008: no auth), this document defines React component interfaces (props) instead of REST/GraphQL contracts.

---

## Component Props Interfaces

### CalorieProgress

Displays the horizontal progress bar showing daily calorie progress.

```typescript
// app/components/dashboard/CalorieProgress.tsx

interface CalorieProgressProps {
  /** Total calories consumed today */
  consumed: number;
  /** Daily calorie target */
  target: number;
}

// Usage:
// <CalorieProgress consumed={1550} target={2000} />
```

**Behavior:**
- Displays progress bar with fill percentage = (consumed / target) × 100
- Shows "X / Y cal" text
- Shows remaining or excess calories
- When consumed > target: shows warning state, displays "Over by X cal"

---

### MealTimeline

Displays the chronological list of meals for the day.

```typescript
// app/components/dashboard/MealTimeline.tsx

import { MealEntry } from '@/app/types/meal';

interface MealTimelineProps {
  /** Array of meals to display, sorted by timestamp */
  meals: MealEntry[];
}

// Usage:
// <MealTimeline meals={meals} />
```

**Behavior:**
- Renders empty state when `meals.length === 0`
- Sorts meals by timestamp (oldest first for chronological display)
- Each meal rendered as MealEntry component

---

### MealEntry

Displays a single meal entry in the timeline.

```typescript
// app/components/dashboard/MealEntry.tsx

import { MealEntry as MealEntryType } from '@/app/types/meal';

interface MealEntryProps {
  /** The meal data to display */
  meal: MealEntryType;
}

// Usage:
// <MealEntry meal={meal} />
```

**Display:**
- Time (formatted as "8:30 AM")
- Meal name
- Calorie count
- Meal type badge (if present)

---

### AddFoodForm

Inline form for adding new food entries.

```typescript
// app/components/dashboard/AddFoodForm.tsx

import { MealEntry, MealType } from '@/app/types/meal';

interface AddFoodFormProps {
  /** Callback when a new meal is submitted */
  onSubmit: (meal: Omit<MealEntry, 'id' | 'timestamp'>) => void;
  /** Callback to close/hide the form */
  onCancel: () => void;
}

// Usage:
// <AddFoodForm onSubmit={handleAddMeal} onCancel={() => setIsFormOpen(false)} />
```

**Form Fields:**
- Food name (text input, required)
- Calories (number input, required, min=1)
- Meal type (select dropdown, optional)

**Behavior:**
- Validates required fields before submit
- Calls `onSubmit` with meal data (id and timestamp added by parent)
- Calls `onCancel` when user dismisses form

---

### EmptyState

Displays encouraging message when no meals are logged.

```typescript
// app/components/dashboard/EmptyState.tsx

interface EmptyStateProps {
  /** Callback when CTA button is clicked */
  onAddClick: () => void;
}

// Usage:
// <EmptyState onAddClick={() => setIsFormOpen(true)} />
```

**Display:**
- Emoji icon (🍽️)
- Message: "Ready to track your first meal?"
- "Add Food" CTA button

---

### Dashboard Page

Main dashboard page component orchestrating all sub-components.

```typescript
// app/dashboard/page.tsx

// No props - page component uses internal state

// Internal State:
interface DashboardState {
  meals: MealEntry[];
  isFormOpen: boolean;
}

// Handlers:
// - handleAddMeal(meal): adds new meal to state
// - handleOpenForm(): sets isFormOpen = true
// - handleCloseForm(): sets isFormOpen = false
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────┐
│                  Dashboard Page                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │ State: { meals, isFormOpen }                  │  │
│  └───────────────────────────────────────────────┘  │
│         │              │              │             │
│         ▼              ▼              ▼             │
│  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │
│  │ CalorieProgress │ │ MealTimeline │ │ AddFoodForm │  │
│  │                  │ │              │ │ (conditional) │  │
│  │ consumed, target │ │ meals        │ │ onSubmit     │  │
│  └────────────┘ └────────────┘ │ onCancel      │  │
│                         │       └────────────────┘  │
│                         ▼                           │
│                  ┌────────────┐                    │
│                  │ MealEntry  │ (mapped)           │
│                  │ meal       │                    │
│                  └────────────┘                    │
│                         │                           │
│                         ▼                           │
│                  ┌────────────┐                    │
│                  │ EmptyState │ (if meals empty)   │
│                  │ onAddClick │                    │
│                  └────────────┘                    │
└─────────────────────────────────────────────────────┘
```

---

## Future API Contracts (Placeholder)

When database integration is added, these endpoints would be needed:

```yaml
# Not implemented for this feature - for reference only

GET /api/meals?date={YYYY-MM-DD}
  Response: { meals: MealEntry[], summary: DailySummary }

POST /api/meals
  Body: { name: string, calories: number, mealType?: MealType }
  Response: { meal: MealEntry }

DELETE /api/meals/{id}
  Response: { success: boolean }
```
