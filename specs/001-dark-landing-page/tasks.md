# Tasks: Dark Mode Landing Page

**Input**: Design documents from `/specs/001-dark-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Test tasks omitted for MVP.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Next.js App Router (app/ directory structure)
- Paths: `app/`, `app/components/landing/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and configuration for landing page

- [x] T001 Configure dark mode class on html element in app/layout.tsx
- [x] T002 [P] Add custom animation keyframes (fadeInUp) in app/globals.css
- [x] T003 [P] Create app/components/landing/ directory structure

---

## Phase 2: Foundational (Reusable Components)

**Purpose**: Build reusable UI components that ALL user stories depend on

**CRITICAL**: No user story implementation can begin until these components exist

- [x] T004 [P] Create CTAButton component in app/components/landing/CTAButton.tsx per contracts/components.ts
- [x] T005 [P] Create FeatureCard component in app/components/landing/FeatureCard.tsx per contracts/components.ts
- [x] T006 [P] Create StepIndicator component in app/components/landing/StepIndicator.tsx per contracts/components.ts
- [x] T007 [P] Create PhoneMockup component in app/components/landing/PhoneMockup.tsx per research.md CSS-only design
- [x] T008 Create useScrollAnimation hook in app/hooks/useScrollAnimation.ts per research.md implementation

**Checkpoint**: All reusable components ready - user story implementation can now begin

---

## Phase 3: User Story 1 - First Impression & Value Understanding (Priority: P1)

**Goal**: Display hero section with core value proposition, app mockup, and CTA so visitors immediately understand the product

**Independent Test**: Load page at http://localhost:3000, verify dark theme, headline "사진 한 장으로 칼로리 추적", CTA button, and phone mockup are visible. Animations play on load.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create Header component with logo and CTA in app/components/landing/Header.tsx
- [x] T010 [P] [US1] Create HeroSection component with headline, subtext, CTA, mockup in app/components/landing/HeroSection.tsx
- [x] T011 [US1] Update app/page.tsx to render Header and HeroSection with dark slate-950 background
- [x] T012 [US1] Add fade-in animations to HeroSection elements with motion-safe and prefers-reduced-motion support
- [x] T013 [US1] Test responsive layout from 320px to 1920px for hero section

**Checkpoint**: User Story 1 complete - Hero section delivers MVP value proposition independently

---

## Phase 4: User Story 2 - Feature Discovery (Priority: P2)

**Goal**: Display feature cards that explain AI food analysis, nutrient calculation, and daily tracking

**Independent Test**: Scroll below hero section, verify 3 feature cards appear with icons, titles, descriptions. Cards animate on scroll into viewport.

### Implementation for User Story 2

- [x] T014 [P] [US2] Create FeaturesSection component in app/components/landing/FeaturesSection.tsx with 3-column grid
- [x] T015 [US2] Add feature data (AI 음식 분석, 자동 영양소 계산, 일일 추적) to FeaturesSection per data-model.md
- [x] T016 [US2] Update app/page.tsx to render FeaturesSection below HeroSection
- [x] T017 [US2] Apply scroll-triggered animations to FeatureCard components using useScrollAnimation hook
- [x] T018 [US2] Test responsive layout (single column mobile, 3-column desktop) for features section

**Checkpoint**: User Story 2 complete - Visitors can discover product features independently

---

## Phase 5: User Story 3 - How It Works Flow (Priority: P2)

**Goal**: Display 3-step process (사진 촬영 → AI 분석 → 결과 저장) to show service simplicity

**Independent Test**: Scroll to "How It Works" section, verify 3 steps displayed with numbers, titles, descriptions. Sequential animation on scroll.

### Implementation for User Story 3

- [x] T019 [P] [US3] Create HowItWorksSection component in app/components/landing/HowItWorksSection.tsx
- [x] T020 [US3] Add step data (3 steps per data-model.md) to HowItWorksSection
- [x] T021 [US3] Update app/page.tsx to render HowItWorksSection below FeaturesSection
- [x] T022 [US3] Apply staggered scroll animations to StepIndicator components
- [x] T023 [US3] Test responsive layout and step visualization from mobile to desktop

**Checkpoint**: User Story 3 complete - Visitors understand how simple the service is

---

## Phase 6: User Story 4 - Trust Building & CTA (Priority: P3)

**Goal**: Display final CTA section and footer to convert visitors to signup/login

**Independent Test**: Scroll to bottom, verify prominent CTA button and footer with copyright. CTA links to /signup.

### Implementation for User Story 4

- [x] T024 [P] [US4] Create Footer component with final CTA section in app/components/landing/Footer.tsx
- [x] T025 [US4] Add compelling CTA headline and button per spec.md requirements
- [x] T026 [US4] Update app/page.tsx to render Footer at bottom of page
- [x] T027 [US4] Add copyright information and any footer links to Footer component
- [x] T028 [US4] Ensure CTA button has proper hover states and links to /signup

**Checkpoint**: User Story 4 complete - Full landing page conversion funnel is ready

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories and final validation

- [x] T029 [P] Update app/layout.tsx metadata with page title, description for SEO
- [x] T030 [P] Add alt text to all images per FR-012 accessibility requirement
- [x] T031 Verify prefers-reduced-motion support across all animated sections (FR-011)
- [x] T032 Run npm run build and fix any TypeScript/lint errors
- [x] T033 Run npm run lint and fix any linting issues
- [x] T034 Test full page scroll performance (target: 30+ fps per SC-006)
- [x] T035 Run Lighthouse accessibility audit and address any WCAG 2.1 AA violations
- [x] T036 Run quickstart.md success criteria checklist validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in priority order (P1 → P2 → P3)
  - US2 and US3 are both P2, can run in parallel if desired
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Independently testable

### Within Each User Story

- Create section component first
- Add data/content
- Integrate into app/page.tsx
- Add animations
- Test responsiveness

### Parallel Opportunities

**Phase 1**: T002 and T003 can run in parallel
**Phase 2**: T004, T005, T006, T007 can run in parallel (different component files)
**Phase 3**: T009 and T010 can run in parallel (Header and HeroSection)
**Phase 4**: T014 is independent
**Phase 5**: T019 is independent
**Phase 6**: T024 is independent
**Phase 7**: T029 and T030 can run in parallel

---

## Parallel Example: Phase 2 Foundational

```bash
# Launch all reusable components together:
Task: "Create CTAButton component in app/components/landing/CTAButton.tsx"
Task: "Create FeatureCard component in app/components/landing/FeatureCard.tsx"
Task: "Create StepIndicator component in app/components/landing/StepIndicator.tsx"
Task: "Create PhoneMockup component in app/components/landing/PhoneMockup.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Hero Section)
4. **STOP and VALIDATE**: Test hero section independently at http://localhost:3000
5. Deploy/demo if ready - MVP delivers core value proposition

### Incremental Delivery

1. Complete Setup + Foundational → Components ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Feature discovery added
4. Add User Story 3 → Test independently → How it works added
5. Add User Story 4 → Test independently → Full funnel complete
6. Complete Polish → Production ready

### Single Developer Strategy

1. Setup: T001-T003 (configure project)
2. Foundational: T004-T008 (build reusable components)
3. User Story 1: T009-T013 (hero section - MVP)
4. User Story 2: T014-T018 (features section)
5. User Story 3: T019-T023 (how it works section)
6. User Story 4: T024-T028 (footer section)
7. Polish: T029-T036 (final validation)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story can be independently completed and tested
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- CTA links point to /signup and /login (routes not part of this feature, will 404)
- All content is in Korean (한국어)
- Dark mode is fixed (no toggle needed)
