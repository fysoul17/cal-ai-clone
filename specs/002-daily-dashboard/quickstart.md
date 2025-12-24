# Quickstart: Daily Dashboard

**Feature**: 002-daily-dashboard
**Date**: 2025-12-24

## Prerequisites

- Node.js 18+ installed
- Git repository cloned
- Dependencies installed (`npm install`)

## Quick Start

```bash
# 1. Switch to feature branch
git checkout 002-daily-dashboard

# 2. Install dependencies (if not already done)
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:3000/dashboard
```

## File Creation Order

Based on dependencies, create files in this order:

### Step 1: Types (no dependencies)
```
app/types/meal.ts
```

### Step 2: Mock Data (depends on types)
```
app/data/mockMeals.ts
```

### Step 3: UI Components (depends on types)
```
app/components/dashboard/EmptyState.tsx
app/components/dashboard/MealEntry.tsx
app/components/dashboard/CalorieProgress.tsx
app/components/dashboard/MealTimeline.tsx
app/components/dashboard/AddFoodForm.tsx
```

### Step 4: Page (depends on components + data)
```
app/dashboard/page.tsx
```

## Key Implementation Notes

### Design System Reference
All UI must follow `docs/design-system.md`:
- Colors: `--color-primary` (#FF6B35), `--color-bg-dark` (#1A1A2E)
- Progress bar gradient: `linear-gradient(90deg, #FF6B35, #FF3366)`
- Border radius: `--radius-xl` (24px) for cards
- Font: Outfit for headings, system font stack for body

### Client Component Requirement
The dashboard page must be a Client Component due to:
- `useState` for meals and form visibility
- Event handlers for form submission

Add `'use client'` directive at top of:
- `app/dashboard/page.tsx`
- All components using hooks or event handlers

### TailwindCSS Classes
Use utility classes matching design system tokens:
```
bg-[#1A1A2E]      → --color-bg-dark
bg-[#252541]      → --color-surface
text-white        → --color-text
text-[#A0A0B8]    → --color-text-secondary
```

## Verification Checklist

After implementation, verify:

- [ ] Dashboard loads at `/dashboard`
- [ ] Progress bar shows correct percentage
- [ ] Meal timeline displays mock meals
- [ ] Add Food button opens inline form
- [ ] Form submission adds meal to timeline
- [ ] Progress bar updates when meal added
- [ ] Empty state shows when no meals
- [ ] Responsive from 320px to 1920px

## Development Commands

```bash
# Run dev server
npm run dev

# Check for lint errors
npm run lint

# Build for production
npm run build
```

## Troubleshooting

### "React Server Component" error
Add `'use client'` to components using hooks or event handlers.

### Styles not applying
Ensure TailwindCSS is properly configured in `app/globals.css`.

### Page not found at /dashboard
Check that `app/dashboard/page.tsx` exists and exports a default component.
