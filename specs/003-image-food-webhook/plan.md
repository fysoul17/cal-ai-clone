# Implementation Plan: Image-Based Food Input with AI Analysis

**Branch**: `003-image-food-webhook` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-image-food-webhook/spec.md`

## Summary

Add image upload functionality to the food input flow, allowing users to photograph their meals for AI-powered nutritional analysis via n8n webhook. The uploaded image is sent to an external service that returns food identification and nutritional data (calories, protein, carbs, fat), which pre-fills the existing food entry form for user review and saving.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16.1.0, React 19.2.3, TailwindCSS 4.x
**Storage**: N/A (mock data in React state only - database integration deferred)
**Testing**: Manual testing (no test framework configured)
**Target Platform**: Web (desktop and mobile browsers)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Image analysis < 30 seconds (per SC-001), full flow < 60 seconds (per SC-003)
**Constraints**: Client-side image resizing before upload, 3 retries with exponential backoff on failure
**Scale/Scope**: Single-page enhancement to existing dashboard

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Design Check (Phase 0)

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Evidence-Based Implementation | PASS | All requirements traced to spec.md FR-001 through FR-014 |
| II. No Over-Engineering | PASS | Minimal approach: single component for image upload, client-side fetch for webhook |
| III. Dead Code Elimination | PASS | No existing code to remove; new code only |
| IV. Next.js/Supabase Standard Patterns | PASS | Using standard Next.js client components, native fetch API |
| V. Incremental Delivery | PASS | Feature broken into 4 user stories with P1/P2/P3 prioritization |
| VI. Design System Compliance | PASS | Will reference docs/design-system.md for all UI components |

### Post-Design Check (Phase 1) - 2026-01-27

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Evidence-Based Implementation | PASS | Data model extends existing MealEntry, adds only required types (NutritionAnalysis, FoodImage) |
| II. No Over-Engineering | PASS | No external libraries for image handling, uses native Canvas/FormData APIs |
| III. Dead Code Elimination | PASS | No unused code introduced; transient FoodImage properly managed with cleanup |
| IV. Next.js/Supabase Standard Patterns | PASS | Client components only, no Server Actions needed for external webhook |
| V. Incremental Delivery | PASS | UI flow designed to allow incremental testing (upload → analyze → save) |
| VI. Design System Compliance | PASS | research.md references design system for colors, inputs, buttons, animations |

## Project Structure

### Documentation (this feature)

```text
specs/003-image-food-webhook/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api-contracts.md # Webhook request/response formats
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── components/
│   └── dashboard/
│       ├── AddFoodForm.tsx        # MODIFY: Add image upload state, integrate with webhook results
│       ├── ImageUpload.tsx        # NEW: Drag-drop/click-to-browse image upload component
│       └── AnalysisStatus.tsx     # NEW: Loading/error/retry states for AI analysis
├── dashboard/
│   └── page.tsx                   # MODIFY: Handle new form mode (image vs manual)
├── services/
│   └── foodAnalysis.ts            # NEW: Webhook integration service
└── types/
    └── meal.ts                    # MODIFY: Add NutritionAnalysis type, extend MealEntry with macros
```

**Structure Decision**: Web application with Next.js App Router. Components organized by feature (dashboard). New service layer for webhook communication.

## Complexity Tracking

> No violations requiring justification.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
