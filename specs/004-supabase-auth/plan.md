# Implementation Plan: Supabase Authentication

**Branch**: `004-supabase-auth` | **Date**: 2026-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-supabase-auth/spec.md`

## Summary

Implement Supabase authentication for Cal AI with email/password sign up/in, Google OAuth, password reset, and protected route access. Uses `@supabase/ssr` package with Next.js App Router patterns for cookie-based session management via middleware.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16.1.0
**Primary Dependencies**: `@supabase/ssr`, `@supabase/supabase-js`, React 19
**Storage**: Supabase Postgres (user data managed by Supabase Auth)
**Testing**: Manual testing (no test framework currently configured)
**Target Platform**: Web (desktop/mobile responsive)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Auth pages load < 2s, sign-in < 30s, OAuth < 10s (per spec SC-001-005)
**Constraints**: WCAG 2.1 AA accessibility, httpOnly cookies for sessions
**Scale/Scope**: Single tenant, MVP user authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Evidence-Based Implementation | PASS | All features trace to spec.md requirements FR-001 through FR-017 |
| II. No Over-Engineering | PASS | Using Supabase's built-in auth (no custom auth server), standard SSR patterns |
| III. Dead Code Elimination | PASS | No existing auth code to remove; fresh implementation |
| IV. Next.js/Supabase Standard Patterns | PASS | Using official @supabase/ssr with App Router middleware pattern |
| V. Incremental Delivery | PASS | Email/password (P1) first, then OAuth (P2), then password reset (P2) |
| VI. Design System Compliance | PASS | Auth pages will use documented design system from docs/design-system.md |

**Pre-design Gate**: PASS - No violations requiring justification.

**Post-design Gate**: PASS - After Phase 1 design review:
- Data model uses Supabase Auth built-in tables (no custom tables needed for MVP)
- API contracts use standard Supabase SDK methods (no custom API routes for auth operations)
- Component contracts follow design system patterns exactly
- No additional complexity introduced during design phase

## Project Structure

### Documentation (this feature)

```text
specs/004-supabase-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output - Supabase SSR patterns research
├── data-model.md        # Phase 1 output - Auth entities
├── quickstart.md        # Phase 1 output - Implementation quickstart
├── contracts/           # Phase 1 output - Component & API contracts
│   └── auth-contracts.md
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (auth)/                    # Auth route group (public pages)
│   ├── sign-in/
│   │   └── page.tsx           # Sign-in page
│   ├── sign-up/
│   │   └── page.tsx           # Sign-up page
│   ├── forgot-password/
│   │   └── page.tsx           # Password reset request page
│   └── reset-password/
│       └── page.tsx           # New password form page
├── auth/
│   └── callback/
│       └── route.ts           # OAuth callback handler
├── components/
│   └── auth/                  # Auth-specific components
│       ├── SignInForm.tsx
│       ├── SignUpForm.tsx
│       ├── ForgotPasswordForm.tsx
│       ├── ResetPasswordForm.tsx
│       ├── GoogleSignInButton.tsx
│       └── AuthFormWrapper.tsx
├── dashboard/
│   └── page.tsx               # Protected dashboard (existing, needs protection)
├── layout.tsx                 # Root layout (existing)
├── page.tsx                   # Landing page (existing, public)
└── middleware.ts              # NEW: Auth middleware for session refresh & route protection

lib/
└── supabase/
    ├── client.ts              # Browser client factory
    ├── server.ts              # Server client factory
    └── middleware.ts          # Middleware client factory
```

**Structure Decision**: Next.js App Router with route groups. Auth pages in `(auth)` group for shared layout potential. Supabase clients factored into `lib/supabase/` for reusability.

## Complexity Tracking

> No complexity violations. Implementation uses standard Supabase SSR patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |
