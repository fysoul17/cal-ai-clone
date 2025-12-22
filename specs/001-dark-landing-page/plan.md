# Implementation Plan: Dark Mode Landing Page

**Branch**: `001-dark-landing-page` | **Date**: 2025-12-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dark-landing-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a dark-themed, conversion-focused landing page for Cal AI Web Clone that communicates the core value proposition ("사진 한 장으로 칼로리 추적") with premium aesthetics, smooth animations, and mobile-first responsive design. The page includes hero section with app mockup, feature cards, how-it-works steps, and CTA sections.

## Technical Context

**Language/Version**: TypeScript 5.x (existing project setup)
**Primary Dependencies**: Next.js 16.1.0, React 19.2.3, TailwindCSS 4.x
**Storage**: N/A (landing page is static, no data persistence)
**Testing**: N/A for MVP (visual testing via browser, accessibility via Lighthouse)
**Target Platform**: Web (responsive: 320px mobile to 1920px+ desktop)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Initial load < 3s, animations complete within 3s, 30+ fps scroll performance
**Constraints**: prefers-reduced-motion support, WCAG 2.1 AA accessibility, dark mode fixed (no toggle)
**Scale/Scope**: Single landing page with 5 sections (header, hero, features, how-it-works, footer with CTA)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Evidence-Based Implementation ✅
- Requirement source: User description + PRD Section 6 (Landing page flow), Section 8 (Design Guidelines)
- All functional requirements (FR-001 to FR-012) trace to spec.md
- No speculative features included

### II. No Over-Engineering ✅
- Simple component structure without unnecessary abstractions
- Direct TailwindCSS utility classes (no custom CSS framework)
- No state management needed (static content)
- No unnecessary wrapper components

### III. Dead Code Elimination ✅
- Will replace default Next.js starter page content entirely
- No commented-out code or unused imports

### IV. Next.js/Supabase Standard Patterns ✅
- Using Next.js App Router conventions
- Server Components (no client interactivity needed except animations)
- TailwindCSS utility-first approach
- Inter font family (or Geist already configured)

### V. Incremental Delivery ✅
- MVP-first: Hero section delivers core value immediately
- Each section independently deployable and testable
- Single page can be deployed and reviewed incrementally

**GATE STATUS: PASS** - No violations detected

## Project Structure

### Documentation (this feature)

```text
specs/001-dark-landing-page/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── page.tsx             # Landing page (replace existing starter content)
├── layout.tsx           # Root layout (update metadata, dark mode class)
├── globals.css          # Global styles (TailwindCSS imports, custom animations)
└── components/
    └── landing/
        ├── Header.tsx           # Navigation with logo and CTA
        ├── HeroSection.tsx      # Hero with headline, subtext, CTA, mockup
        ├── FeaturesSection.tsx  # Feature cards grid
        ├── HowItWorksSection.tsx # 3-step process visualization
        └── Footer.tsx           # Final CTA + copyright
```

**Structure Decision**: Using Next.js App Router flat structure under `app/`. Components organized in `app/components/landing/` to keep landing page concerns grouped. No separate `src/` directory as the project already follows Next.js default `app/` structure.

## Complexity Tracking

> No violations - table intentionally empty

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| - | - | - |

---

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion (2025-12-22)*

### I. Evidence-Based Implementation ✅
- All design artifacts (research.md, data-model.md, contracts/) trace directly to spec.md requirements
- Component contracts match FR-001 through FR-012
- No speculative features added during planning

### II. No Over-Engineering ✅
- 5 simple section components + 4 reusable UI components
- No abstraction layers beyond what's needed
- Single custom hook for animations (useScrollAnimation)
- Direct TailwindCSS classes, no custom theme system

### III. Dead Code Elimination ✅
- Contracts define only what's needed for implementation
- No placeholder or future-proofing code in design

### IV. Next.js/Supabase Standard Patterns ✅
- Server Components for all static sections
- Single Client Component for animation hook only
- Standard Next.js App Router file structure

### V. Incremental Delivery ✅
- Each component independently implementable
- Hero section provides immediate value
- Clear dependency order in quickstart.md

**POST-DESIGN GATE STATUS: PASS** - Ready for task generation
