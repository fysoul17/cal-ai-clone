# Tasks: Image-Based Food Input with AI Analysis

**Input**: Design documents from `/specs/003-image-food-webhook/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual testing via quickstart.md checklist.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `app/` directory (Next.js App Router structure)
- Components: `app/components/dashboard/`
- Services: `app/services/`
- Types: `app/types/`

---

## Phase 1: Setup

**Purpose**: Environment configuration and shared type definitions

- [x] T001 Create `.env.local` with `NEXT_PUBLIC_WEBHOOK_URL` for test webhook endpoint
- [x] T001a [P] Create `.env.example` documenting both test and production webhook URLs (per FR-014)
- [x] T002 Add `NutritionAnalysis`, `FoodImage`, `AnalysisState`, and `AnalysisStatus` types to `app/types/meal.ts`
- [x] T003 Extend `MealEntry` interface with optional `protein`, `carbs`, `fat` fields in `app/types/meal.ts`
- [x] T004 Extend `AddFoodFormData` interface with `protein`, `carbs`, `fat` string fields in `app/types/meal.ts`
- [x] T005 [P] Add `formatMacro()` and `parseMacro()` helper functions to `app/types/meal.ts`
- [x] T006 [P] Add `analysisToFormData()` conversion function to `app/types/meal.ts`

**Checkpoint**: Types and environment ready for feature implementation

---

## Phase 2: Foundational (Webhook Service)

**Purpose**: Core webhook integration service that ALL user stories depend on

**⚠️ CRITICAL**: User Story 2 (AI Analysis) cannot function without this service

- [x] T007 Create `app/services/foodAnalysis.ts` with `resizeImage()` function using Canvas API (max 1280px longest edge, JPEG 85% quality)
- [x] T008 Add `withRetry()` helper function with exponential backoff (1s, 2s, 4s delays) to `app/services/foodAnalysis.ts`
- [x] T009 Implement `analyzeFood()` function with FormData POST to webhook in `app/services/foodAnalysis.ts`
- [x] T010 Add supported image format validation (JPEG, PNG, WebP, HEIC) to `app/services/foodAnalysis.ts`
- [x] T010a Add HEIC-to-JPEG conversion using `heic2any` library or Canvas fallback in `app/services/foodAnalysis.ts` (browsers lack native HEIC support)

**Checkpoint**: Webhook service ready - User Stories can now be implemented

---

## Phase 3: User Story 1 - Capture Food Photo (Priority: P1) 🎯 MVP

**Goal**: Allow users to upload or capture a photo of food with preview and manual entry fallback

**Independent Test**: Upload an image, verify preview displays. Click "Enter manually" to see empty form.

### Implementation for User Story 1

- [x] T011 [US1] Create `app/components/dashboard/ImageUpload.tsx` with drag-and-drop zone container
- [x] T012 [US1] Add hidden file input with `accept="image/jpeg,image/png,image/webp,image/heic"` to `ImageUpload.tsx`
- [x] T013 [US1] Implement `onDragOver`, `onDragLeave`, `onDrop` handlers with visual feedback in `ImageUpload.tsx`
- [x] T014 [US1] Add click-to-browse functionality triggering file input in `ImageUpload.tsx`
- [x] T015 [US1] Display image preview using `URL.createObjectURL()` in `ImageUpload.tsx`
- [x] T016 [US1] Add "Change image" and "Remove" buttons when preview is shown in `ImageUpload.tsx`
- [x] T017 [US1] Add "Enter manually" text link below upload area in `ImageUpload.tsx`
- [x] T018 [US1] Implement `URL.revokeObjectURL()` cleanup on unmount/image change in `ImageUpload.tsx`

**Checkpoint**: Image upload component complete with preview, change, remove, and manual entry link

---

## Phase 4: User Story 2 - Analyze Food via AI (Priority: P1) 🎯 MVP

**Goal**: Send uploaded image to AI webhook and display analysis results or errors

**Independent Test**: Upload image, click "Analyze", verify loading state shows, then results or error displays.

### Implementation for User Story 2

- [x] T019 [US2] Create `app/components/dashboard/AnalysisStatus.tsx` with loading spinner state
- [x] T020 [US2] Add "Analyzing your meal..." status text during analysis in `AnalysisStatus.tsx`
- [x] T021 [US2] Implement error state display with error message in `AnalysisStatus.tsx`
- [x] T022 [US2] Add "Try again" retry button (hidden after 3 retries) in `AnalysisStatus.tsx`
- [x] T023 [US2] Add "Enter manually instead" link shown after 3 failed retries in `AnalysisStatus.tsx`
- [x] T024 [US2] Display retry count indicator (e.g., "Retry 2 of 3") in `AnalysisStatus.tsx`

**Checkpoint**: Analysis status component complete with loading, error, retry, and manual entry fallback

---

## Phase 5: User Story 3 - Review and Save Analyzed Food (Priority: P2)

**Goal**: Pre-fill food entry form with AI results, allow editing, and save to meal log

**Independent Test**: After successful analysis, verify form is pre-filled. Edit values, save, verify entry appears in timeline with macros.

### Implementation for User Story 3

- [x] T025 [P] [US3] Add protein, carbs, fat input fields to `app/components/dashboard/AddFoodForm.tsx`
- [x] T026 [P] [US3] Update `app/components/dashboard/MealEntry.tsx` to display macro pills when present
- [x] T027 [US3] Add `initialData` prop to `AddFoodForm` to support pre-filling from analysis
- [x] T028 [US3] Add numeric validation for macro fields (non-negative, 1 decimal) in `AddFoodForm.tsx`
- [x] T029 [US3] Update form submission to include protein, carbs, fat in `MealEntry` creation in `AddFoodForm.tsx`
- [x] T030 [US3] Format macro display values using `formatMacro()` helper in `MealEntry.tsx`

**Checkpoint**: Form accepts and displays macros, pre-fill works, saved entries show macros

---

## Phase 6: User Story 4 - Meal Type Selection (Priority: P3)

**Goal**: Allow users to optionally categorize food by meal type when saving

**Independent Test**: Select a meal type during food entry, save, verify meal type appears in the log.

### Implementation for User Story 4

- [x] T031 [US4] Verify meal type dropdown exists and is optional in `AddFoodForm.tsx`
- [x] T032 [US4] Ensure meal type is passed through to saved `MealEntry` from form submission

**Checkpoint**: Meal type selection available and persisted (if existing implementation, may be no-op)

---

## Phase 7: Integration & Orchestration

**Purpose**: Wire all components together in the dashboard page

- [x] T033 Add `formMode` state (`'image-upload' | 'manual-entry' | 'analyzing' | 'results'`) to `app/dashboard/page.tsx`
- [x] T034 Add `selectedImage` (FoodImage | null) state to `app/dashboard/page.tsx`
- [x] T035 Add `analysisState` (AnalysisState) state to `app/dashboard/page.tsx`
- [x] T036 Add `analysisResult` (NutritionAnalysis | null) state to `app/dashboard/page.tsx`
- [x] T037 Implement `handleImageSelect` callback that sets image and transitions to 'ready' state in `app/dashboard/page.tsx`
- [x] T038 Implement `handleAnalyze` callback that calls `analyzeFood()` service with state transitions in `app/dashboard/page.tsx`
- [x] T039 Implement `handleRetry` callback that resets error and re-triggers analysis in `app/dashboard/page.tsx`
- [x] T040 Implement `handleManualEntry` callback that switches to manual form mode in `app/dashboard/page.tsx`
- [x] T041 Update modal/form rendering to show `ImageUpload` by default, `AnalysisStatus` during analysis, `AddFoodForm` for results/manual in `app/dashboard/page.tsx`
- [x] T042 Pass `analysisToFormData(result)` as `initialData` to `AddFoodForm` when showing results in `app/dashboard/page.tsx`
- [x] T043 Add "Analyze" button that triggers `handleAnalyze` when image is selected but not yet analyzed in `app/dashboard/page.tsx`

**Checkpoint**: Full flow working: upload → analyze → review → save

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final refinements and validation

- [x] T044 Apply design system styles (colors, rounded corners, gradients) to `ImageUpload.tsx`
- [x] T045 Apply design system styles to `AnalysisStatus.tsx` (loading spinner animation, error colors)
- [x] T046 Add `fadeInUp` animation to new elements per design system
- [x] T047 Ensure mobile responsiveness for drag-drop area and form inputs
- [x] T048 Validate all error messages are user-friendly (per FR-012, SC-004)
- [ ] T049 Run `quickstart.md` testing checklist and verify all items pass
- [ ] T050 Update mock data in `app/data/mockMeals.ts` to include sample macros for existing entries (optional)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T002-T006 for types) - BLOCKS User Story 2
- **User Story 1 (Phase 3)**: Depends on Setup only - can start after Phase 1
- **User Story 2 (Phase 4)**: Depends on Foundational (needs `analyzeFood()` service)
- **User Story 3 (Phase 5)**: Depends on Setup only - form changes can be done independently
- **User Story 4 (Phase 6)**: No new dependencies - may already be implemented
- **Integration (Phase 7)**: Depends on all User Story phases being complete
- **Polish (Phase 8)**: Depends on Integration being complete

### User Story Independence

- **User Story 1 (P1)**: Fully independent - image upload UI only
- **User Story 2 (P1)**: Depends on Foundational service, but UI is independent
- **User Story 3 (P2)**: Form enhancements are independent, integration needs US1+US2
- **User Story 4 (P3)**: Fully independent - may already exist

### Within Each User Story

- UI components before integration
- Props/interfaces before implementation
- Core functionality before polish

### Parallel Opportunities

**Phase 1 (Setup):**
```
Task T005 + T006 can run in parallel (different helper functions)
```

**Phase 3 (US1) - Sequential due to component dependencies:**
```
T011 → T012-T014 → T015-T16 → T017 → T018
```

**Phase 5 (US3):**
```
Task T025 + T026 can run in parallel (different files)
```

---

## Parallel Example: Phase 5 Tasks

```bash
# Launch independent tasks together:
Task: "Add protein, carbs, fat input fields to app/components/dashboard/AddFoodForm.tsx"
Task: "Update app/components/dashboard/MealEntry.tsx to display macro pills when present"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Setup (types and env)
2. Complete Phase 2: Foundational (webhook service)
3. Complete Phase 3: User Story 1 (image upload)
4. Complete Phase 4: User Story 2 (analysis status)
5. Complete Phase 7: Integration (wire together)
6. **STOP and VALIDATE**: Test full flow: upload → analyze → see results
7. MVP delivers: image upload with AI analysis

### Incremental Delivery

1. MVP (US1 + US2) → Test image upload and analysis → Demo
2. Add US3 (form with macros) → Test pre-fill and save → Demo
3. Add US4 (meal types) → Test categorization → Demo
4. Polish → Apply design system → Final Demo

### Single Developer Strategy

Recommended order for solo development:
1. T001-T010 (Setup + Foundational) - Get types and service ready
2. T011-T018 (US1) - Build image upload component
3. T019-T024 (US2) - Build analysis status component
4. T025-T030 (US3) - Enhance form with macros
5. T033-T043 (Integration) - Wire everything together
6. T044-T049 (Polish) - Final touches

---

## Notes

- No automated tests - manual testing via quickstart.md checklist
- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- Total tasks: 52
- US1 tasks: 8 (T011-T018)
- US2 tasks: 6 (T019-T024)
- US3 tasks: 6 (T025-T030)
- US4 tasks: 2 (T031-T032)
- Setup: 7 (T001-T006, T001a)
- Foundational: 5 (T007-T010, T010a)
- Integration: 11 (T033-T043)
- Polish: 7 (T044-T050)
