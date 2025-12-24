# Tasks: Daily Dashboard

**Input**: Design documents from `/specs/002-daily-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No tests explicitly requested in the feature specification. Tests are NOT included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (Next.js)**: `app/` directory structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure - types and mock data that all user stories depend on

- [X] T001 [P] Create TypeScript types for MealEntry, MealType, DailySummary, and AddFoodFormData in app/types/meal.ts
- [X] T002 [P] Create mock meal data and daily summary constants in app/data/mockMeals.ts
- [X] T003 Create dashboard directory structure at app/dashboard/ and app/components/dashboard/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components that MUST be complete before user story components can be implemented

**Note**: For this feature, the types and mock data in Phase 1 are the foundational prerequisites. All user stories can begin immediately after Phase 1.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Daily Calorie Progress (Priority: P1)

**Goal**: Display a horizontal progress bar showing consumed vs target calories with percentage and remaining/excess calories

**Independent Test**: Load dashboard at `/dashboard`, verify progress bar displays mock calorie data (1550/2000 = 77.5%), remaining calories shown

**Acceptance Criteria**:
1. Horizontal progress bar showing consumed vs target calories with percentage
2. Remaining calories displayed alongside the bar
3. Over-limit state shows 100%+ with warning visual treatment (non-judgmental)

### Implementation for User Story 1

- [X] T004 [P] [US1] Create CalorieProgress component with progress bar, percentage, and remaining/excess display in app/components/dashboard/CalorieProgress.tsx
- [X] T005 [US1] Integrate CalorieProgress into dashboard page with mock data in app/dashboard/page.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - progress bar visible with mock data

---

## Phase 4: User Story 2 - View Meal Timeline (Priority: P2)

**Goal**: Display a chronological list of meals showing name, time, calories, and meal type for each entry

**Independent Test**: Load dashboard, verify timeline shows 4 mock meals in chronological order with all details visible, verify empty state displays when meals array is empty

**Acceptance Criteria**:
1. All meals listed in chronological order
2. Each entry shows meal name, time (12-hour format), calorie count, meal type badge (if provided)
3. Empty state with encouraging message when no meals logged

### Implementation for User Story 2

- [X] T006 [P] [US2] Create EmptyState component with emoji, message, and CTA button in app/components/dashboard/EmptyState.tsx
- [X] T007 [P] [US2] Create MealEntry component displaying time, name, calories, and meal type badge in app/components/dashboard/MealEntry.tsx
- [X] T008 [US2] Create MealTimeline component that sorts and renders meals, handles empty state in app/components/dashboard/MealTimeline.tsx
- [X] T009 [US2] Integrate MealTimeline into dashboard page below CalorieProgress in app/dashboard/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - progress bar + meal timeline visible

---

## Phase 5: User Story 3 - Add Food Entry (Priority: P3)

**Goal**: Allow users to add food entries via inline form, updating timeline and progress bar immediately

**Independent Test**: Click "Add Food" button, verify inline form appears, submit form with valid data, verify new meal appears in timeline and progress bar updates

**Acceptance Criteria**:
1. "Add Food" button opens simple inline form
2. Form has food name (required), calories (required), meal type dropdown (optional)
3. Submission adds meal to timeline and updates calorie progress immediately

### Implementation for User Story 3

- [X] T010 [P] [US3] Create AddFoodForm component with name, calories, meal type fields and submit/cancel handlers in app/components/dashboard/AddFoodForm.tsx
- [X] T011 [US3] Add form visibility state and "Add Food" button to dashboard page in app/dashboard/page.tsx
- [X] T012 [US3] Implement handleAddMeal function to add new meal to state with generated id and timestamp in app/dashboard/page.tsx
- [X] T013 [US3] Wire AddFoodForm onSubmit to handleAddMeal, onCancel to close form in app/dashboard/page.tsx

**Checkpoint**: All user stories should now be independently functional - complete add food flow working

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsive design verification and final polish

- [X] T014 Verify responsive layout at 320px, 768px, 1024px, and 1920px viewport widths; confirm page loads within 2 seconds (SC-001, SC-005) in app/dashboard/page.tsx
- [X] T015 Ensure all components follow design system (colors, typography, spacing) per docs/design-system.md
- [X] T016 Run lint check (npm run lint) and fix any errors
- [X] T017 Run quickstart.md verification checklist manually

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: N/A for this feature (types/mock data in Phase 1 serve as foundation)
- **User Stories (Phase 3-5)**: All depend on Phase 1 completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 -> P2 -> P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 1 - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 1 - No dependencies on US1 (uses same mock data)
- **User Story 3 (P3)**: Can start after Phase 1 - Requires dashboard page (created in US1 T005)
  - Recommended: Complete US1 first to establish dashboard page structure

### Within Each User Story

- Components before page integration
- Parent components before child components
- Core implementation before wiring

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T004 can run in parallel with T006, T007 (different component files)
- T006 and T007 can run in parallel (different component files)
- T010 can run in parallel with any other component task

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all setup tasks together:
Task: "Create TypeScript types in app/types/meal.ts" (T001)
Task: "Create mock meal data in app/data/mockMeals.ts" (T002)
```

## Parallel Example: User Story Components

```bash
# After Phase 1, launch these in parallel:
Task: "Create CalorieProgress component" (T004 - US1)
Task: "Create EmptyState component" (T006 - US2)
Task: "Create MealEntry component" (T007 - US2)
Task: "Create AddFoodForm component" (T010 - US3)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types + mock data)
2. Complete Phase 3: User Story 1 (CalorieProgress)
3. **STOP and VALIDATE**: Test progress bar independently
4. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup (Phase 1) -> Foundation ready
2. Add User Story 1 -> Test independently -> Deploy/Demo (MVP!)
3. Add User Story 2 -> Test independently -> Deploy/Demo (timeline visible)
4. Add User Story 3 -> Test independently -> Deploy/Demo (full functionality)
5. Each story adds value without breaking previous stories

### Recommended Execution Order

For single developer:
1. T001, T002, T003 (Setup)
2. T004, T005 (US1 - Progress bar)
3. T006, T007, T008, T009 (US2 - Timeline)
4. T010, T011, T012, T013 (US3 - Add form)
5. T014, T015, T016, T017 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All components must include `'use client'` directive (per quickstart.md)
- Reference docs/design-system.md for colors, typography, and component styles
