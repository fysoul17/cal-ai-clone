# Research: Daily Dashboard

**Feature**: 002-daily-dashboard
**Date**: 2025-12-24

## Overview

Research findings for implementing the daily dashboard feature. Focus on UI/UX patterns, design system alignment, and React state management for mock data.

---

## 1. Progress Bar Implementation

### Decision
Use horizontal progress bar with TailwindCSS styling following the design system's progress bar component.

### Rationale
- Design system (docs/design-system.md Section 8.5) defines `.progress-bar` component
- Horizontal bar matches FR-001 requirement ("horizontal progress bar")
- Linear gradient background aligns with brand visual identity

### Alternatives Considered
1. **Circular progress ring** - Rejected because spec explicitly requires horizontal bar
2. **Segmented progress** - Over-engineering for simple percentage display

### Implementation Notes
- Use `--gradient-primary` for fill: `linear-gradient(90deg, #FF6B35, #FF3366)`
- Background: `--color-bg-darker` (#0F0F1A)
- Border radius: `--radius-full` (9999px)
- Height: 8px per design system

---

## 2. Over-Limit Progress Display

### Decision
Show 100%+ with distinct visual treatment when exceeding calorie target.

### Rationale
- FR-002 requires showing excess calories when over target
- Spec explicitly states "without being judgmental" (Edge Cases)
- Design system uses `--color-warning` (#F7C94B) for warning states

### Alternatives Considered
1. **Red error color** - Rejected per spec requirement to be non-judgmental
2. **Cap at 100%** - Does not meet FR-002 requirement to show excess

### Implementation Notes
- Use warning color gradient when over 100%: `linear-gradient(90deg, #F7C94B, #FF6B35)`
- Display text like "Over by X cal" in secondary text color
- Progress bar visually capped at 100% width, but shows percentage > 100%

---

## 3. Meal Timeline Component

### Decision
Vertical chronological list with meal cards showing time, name, calories, and optional meal type.

### Rationale
- FR-003: Chronological timeline for current day
- FR-004: Each entry shows name, time, calories, meal type
- Design system card pattern fits meal entries well

### Alternatives Considered
1. **Horizontal scrolling timeline** - Harder on mobile, less scannable
2. **Table layout** - Less visually engaging, doesn't fit design aesthetic

### Implementation Notes
- Sort meals by timestamp (newest first or oldest first - oldest matches "timeline" concept)
- Use `.card` styles from design system with reduced padding
- Display meal type as badge using design system badge styles
- Time format: 12-hour (e.g., "8:30 AM") for readability

---

## 4. Add Food Form Pattern

### Decision
Inline expandable form triggered by primary button.

### Rationale
- FR-005: Prominently visible "Add Food" button
- FR-006: Simple inline form (not modal)
- Spec clarification: "Show a simple inline form"

### Alternatives Considered
1. **Modal dialog** - Rejected per spec clarification requiring inline form
2. **Full page navigation** - Over-engineering for simple 3-field form
3. **Always-visible form** - Takes up space when not needed

### Implementation Notes
- Use `useState` to toggle form visibility
- Form fields: food name (text), calories (number), meal type (select)
- Primary button style from design system
- Form appears below button with fadeIn animation

---

## 5. Empty State Design

### Decision
Encouraging message with CTA button following design system voice and tone.

### Rationale
- FR-010: Display encouraging empty state
- Design system Section 14 (Voice & Tone): "Encouraging" and "Ready to track your first meal?"

### Alternatives Considered
1. **Illustration-heavy empty state** - No illustrations in current design system
2. **Plain text only** - Misses opportunity to guide user

### Implementation Notes
- Center-aligned text with emoji (📝 or 🍽️)
- Copy: "Ready to track your first meal?" (per design system)
- Include "Add Food" CTA button

---

## 6. State Management

### Decision
React `useState` at page level with prop drilling to child components.

### Rationale
- No database (per spec FR-007)
- Constitution Principle II: No over-engineering
- Only 3-5 mock meals, no complex state needs

### Alternatives Considered
1. **React Context** - Over-engineering for single page with few components
2. **Redux/Zustand** - Massive over-engineering
3. **localStorage** - Spec says session only, but adds complexity

### Implementation Notes
- Initial state: Mock meals array
- `addMeal` function passed to AddFoodForm
- Total calories computed from meals array
- Target calories as constant (2000 per spec assumption)

---

## 7. Mock Data Structure

### Decision
TypeScript interface with 3-5 pre-populated sample meals.

### Rationale
- FR-007: Use mock/fake data
- Spec assumption: "3-5 sample entries to demonstrate timeline"
- Key entities defined in spec

### Implementation Notes
```typescript
interface MealEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: Date;
  mealType?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

interface DailySummary {
  targetCalories: number;  // 2000
  date: Date;
}
```

Sample meals should span different times of day and meal types.

---

## 8. Responsive Design

### Decision
Mobile-first design with breakpoints from design system.

### Rationale
- FR-009: Responsive 320px - 1920px
- SC-005: Correct display from 320px to 1920px
- Design system Section 10 defines breakpoints

### Implementation Notes
- Mobile (default): Single column layout
- Tablet (768px+): Progress section more prominent
- Desktop (1024px+): Consider two-column layout (progress + timeline)
- All touch targets minimum 44px

---

## Summary

All technical decisions align with:
- Feature spec requirements (FR-001 through FR-010)
- Constitution principles (no over-engineering, evidence-based)
- Design system compliance (colors, components, typography)

No NEEDS CLARIFICATION items remain. Ready for Phase 1.
