<!--
Sync Impact Report
==================
Version change: 1.1.0 → 1.2.0
Modified principles: None
Added sections:
  - Principle VI: Design System Compliance (UI/UX work must reference docs/design-system.md)
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes needed (generic)
  - .specify/templates/spec-template.md ✅ no changes needed (generic)
  - .specify/templates/tasks-template.md ✅ no changes needed (generic)
Follow-up TODOs: None
-->

# Cal AI Web Clone Constitution

## Core Principles

### I. Evidence-Based Implementation
All implementation decisions MUST be grounded in documented requirements (PRD, spec.md).
No speculative features or "nice-to-haves" without explicit user approval.
When requirements are unclear, ASK before implementing - do not guess.
Every code change MUST trace back to a specific requirement or bug report.

### II. No Over-Engineering
Start with the simplest solution that meets requirements.
Avoid abstractions until they are needed at least twice (Rule of Three).
No premature optimization - measure first, optimize when evidence shows need.
Reject patterns that add complexity without documented benefit:
  - No unnecessary wrapper functions
  - No feature flags for MVP features
  - No backward-compatibility shims when direct changes suffice

### III. Dead Code Elimination
Remove unused code immediately upon discovery.
No commented-out code in commits - use version control for history.
Delete unused imports, variables, functions, and files.
After each feature completion, audit for orphaned code paths.

### IV. Next.js/Supabase Standard Patterns
Follow established conventions from official documentation:
  - Next.js App Router patterns for routing and Server Components
  - Server Actions for data mutations (not custom API routes unless necessary)
  - Supabase client patterns for auth and database operations
  - TailwindCSS utility-first approach (no custom CSS unless required)

### V. Incremental Delivery
Each feature MUST be independently deployable and testable.
MVP first: implement the critical path before edge cases.
User-facing value with each commit - avoid large "work in progress" branches.

### VI. Design System Compliance
All UI/UX work MUST reference `docs/design-system.md` before implementation.
Visual components MUST adhere to documented:
  - Color system (primary, secondary, semantic, gradients)
  - Typography (font families, type scale, text styles)
  - Spacing system (4px base unit scale)
  - Border radius and shadows
  - Component patterns (buttons, cards, inputs, badges)
  - Motion and animation guidelines
  - Responsive breakpoints
Deviations from the design system require explicit justification and approval.

## Technology Stack

**Mandated by PRD - do not deviate without explicit approval:**

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | Next.js (App Router) | PRD Section 3 |
| Language | TypeScript | PRD Section 3 |
| Styling | TailwindCSS | PRD Section 3 |
| State | React Server Components / Server Actions | PRD Section 3 |
| Backend Logic | n8n Webhooks (AI processing) | PRD Section 3 |
| Database | Supabase Postgres | PRD Section 3 |
| Auth | Supabase Auth | PRD Section 3 |
| Storage | Supabase Storage | PRD Section 3 |
| AI Vision Model | Gemini Image Pro (나노바나나 프로) | User specification (2025-12-22) |

## Development Workflow

### Before Implementation
1. Verify requirement exists in PRD or approved spec
2. Check if similar code already exists (avoid duplication)
3. Identify the minimal change needed

### During Implementation
1. Write only what is explicitly required
2. Use existing patterns from the codebase
3. Keep changes focused and atomic

### After Implementation
1. Run dead code analysis
2. Remove any unused imports/variables/functions
3. Verify no temporary or debug code remains
4. Confirm feature traces back to documented requirement

## Governance

This constitution supersedes personal preferences and external "best practices" when they conflict with documented project requirements.

**Amendment Process:**
1. Propose change with rationale linked to project needs
2. Document impact on existing code
3. Update this file with new version number
4. Propagate changes to dependent templates if affected

**Compliance:**
- All PRs MUST reference the requirement being implemented
- Reviewers MUST verify no over-engineering or speculative code
- Dead code MUST be removed before merge

**Version**: 1.2.0 | **Ratified**: 2025-12-22 | **Last Amended**: 2025-12-24
