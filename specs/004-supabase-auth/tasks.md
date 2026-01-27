# Tasks: Supabase Authentication

**Input**: Design documents from `/specs/004-supabase-auth/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included - manual testing via quickstart.md checklist as specified in plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Type**: Next.js App Router with `app/` directory structure
- **Components**: `app/components/auth/`
- **Supabase Clients**: `lib/supabase/`
- **Auth Pages**: `app/(auth)/` route group

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and Supabase dependency installation

- [X] T001 Install Supabase dependencies: `pnpm add @supabase/ssr @supabase/supabase-js`
- [X] T002 Create environment variables in `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [X] T003 [P] Update `.env.example` with placeholder Supabase variables for team reference
- [X] T004 [P] Create auth types file in `types/auth.ts` with interfaces matching data-model.md: `AuthProvider` (union type), `AuthUser` (with id, email, emailConfirmedAt, providers, metadata, createdAt), `AuthState` (user, isLoading, isAuthenticated), and `AuthEventType` (union of SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY, TOKEN_REFRESHED, USER_UPDATED)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Supabase client factories and middleware that MUST be complete before ANY auth feature can work

**WARNING**: No user story work can begin until this phase is complete

- [X] T005 Create browser Supabase client factory in `lib/supabase/client.ts` using `createBrowserClient`
- [X] T006 [P] Create server Supabase client factory in `lib/supabase/server.ts` using `createServerClient` with cookie handling
- [X] T007 Create middleware Supabase client factory in `lib/supabase/middleware.ts` with request/response cookie sync
- [X] T008 Create root middleware in `middleware.ts` with session refresh and route protection for `/dashboard` and auth pages
- [X] T009 Create OAuth callback route handler in `app/auth/callback/route.ts` to exchange code for session
- [X] T010 [P] Create AuthFormWrapper component in `app/components/auth/AuthFormWrapper.tsx` with design system styling

**Checkpoint**: Foundation ready - auth pages and components can now be implemented

---

## Phase 3: User Story 1 - Email/Password Sign Up (Priority: P1) MVP

**Goal**: Allow new users to create accounts using email and password with email verification

**Independent Test**: Complete sign-up with valid email/password, receive confirmation email, click link, verify redirect to dashboard

### Implementation for User Story 1

- [X] T011 [P] [US1] Create SignUpForm component in `app/components/auth/SignUpForm.tsx` with email, password, confirmPassword fields
- [X] T012 [US1] Add client-side validation to SignUpForm: email format, password min 8 chars, password confirmation match
- [X] T013 [US1] Implement sign-up submission in SignUpForm using `supabase.auth.signUp()` with email redirect to `/auth/callback`
- [X] T014 [US1] Add loading state (disabled button with spinner) and error display to SignUpForm per FR-017
- [X] T015 [US1] Add success state to SignUpForm showing "Check your email for verification link" message
- [X] T016 [US1] Create sign-up page in `app/(auth)/sign-up/page.tsx` rendering SignUpForm with AuthFormWrapper
- [X] T017 [US1] Add link to sign-in page from sign-up page
- [X] T018 [US1] Handle "email already in use" error with link to sign-in instead (FR-013)

**Checkpoint**: Email/password sign-up functional - users can create accounts and verify via email

---

## Phase 4: User Story 2 - Email/Password Sign In (Priority: P1)

**Goal**: Allow returning users to sign in with email and password to access the dashboard

**Independent Test**: Sign in with valid credentials, verify redirect to dashboard with correct user session

### Implementation for User Story 2

- [X] T019 [P] [US2] Create SignInForm component in `app/components/auth/SignInForm.tsx` with email, password fields
- [X] T020 [US2] Add client-side validation to SignInForm: email format, password required
- [X] T021 [US2] Implement sign-in submission in SignInForm using `supabase.auth.signInWithPassword()`
- [X] T022 [US2] Add loading state (disabled button with spinner) and error display to SignInForm per FR-017
- [X] T023 [US2] Create sign-in page in `app/(auth)/sign-in/page.tsx` rendering SignInForm with AuthFormWrapper
- [X] T024 [US2] Add link to sign-up page from sign-in page
- [X] T025 [US2] Add link to forgot-password page from sign-in page
- [X] T026 [US2] Handle "invalid credentials" error with generic message per FR-013
- [X] T027 [US2] Handle "email not confirmed" error with prompt to verify email and resend option
- [X] T027.1 [US2] Verify Supabase rate limiting handles brute force attempts per FR-014 (test 6+ rapid failed logins, confirm lockout message)

**Checkpoint**: Email/password sign-in functional - returning users can access their accounts

---

## Phase 5: User Story 5 - Protected Dashboard Access (Priority: P1)

**Goal**: Ensure dashboard is only accessible to authenticated users with proper redirects

**Independent Test**: Access `/dashboard` without auth - verify redirect to sign-in; access with auth - verify dashboard loads

### Implementation for User Story 5

- [X] T028 [US5] Verify middleware redirects unauthenticated users from `/dashboard` to `/sign-in` (FR-009, FR-010)
- [X] T029 [US5] Verify middleware redirects authenticated users from `/sign-in` and `/sign-up` to `/dashboard` (FR-015)
- [X] T030 [US5] Update dashboard page in `app/dashboard/page.tsx` to get user from session and display personalized content
- [X] T031 [US5] Add session expiration handling - middleware should redirect to sign-in on expired session

**Checkpoint**: Protected routes functional - dashboard access properly gated by authentication

---

## Phase 6: User Story 6 - Sign Out (Priority: P2)

**Goal**: Allow authenticated users to sign out and end their session

**Independent Test**: Sign out from dashboard, verify redirect to landing page, verify cannot access dashboard without signing in again

### Implementation for User Story 6

- [X] T032 [P] [US6] Create sign out action or API route to call `supabase.auth.signOut()`
- [X] T033 [US6] Add sign out button to dashboard header/navigation
- [X] T034 [US6] Implement sign out click handler to call sign out and redirect to landing page (FR-011)
- [X] T035 [US6] Verify user session is terminated and protected routes redirect to sign-in after sign out

**Checkpoint**: Sign out functional - users can end their sessions securely

---

## Phase 7: User Story 3 - Google OAuth Sign In/Sign Up (Priority: P2)

**Goal**: Allow users to sign in or create accounts using their Google account

**Independent Test**: Click "Sign in with Google", complete OAuth flow, verify redirect to dashboard as authenticated user

### Implementation for User Story 3

- [X] T036 [P] [US3] Create GoogleSignInButton component in `app/components/auth/GoogleSignInButton.tsx` with Google logo icon
- [X] T037 [US3] Implement OAuth initiation in GoogleSignInButton using `supabase.auth.signInWithOAuth({ provider: 'google' })`
- [X] T038 [US3] Configure redirect URL in OAuth call to `/auth/callback?next=/dashboard`
- [X] T039 [US3] Add loading state to GoogleSignInButton during OAuth redirect
- [X] T040 [US3] Integrate GoogleSignInButton into sign-in page below email/password form
- [X] T041 [US3] Integrate GoogleSignInButton into sign-up page as alternative sign-up method
- [X] T042 [US3] Verify OAuth callback handler in `app/auth/callback/route.ts` handles Google OAuth code exchange
- [X] T043 [US3] Handle OAuth cancellation - return to sign-in page with informational message
- [X] T044 [US3] Verify account linking works when Google email matches existing email/password account (FR-006)

**Checkpoint**: Google OAuth functional - users can sign in/up with Google accounts

---

## Phase 8: User Story 4 - Password Reset (Priority: P2)

**Goal**: Allow users who forgot their password to reset it via email

**Independent Test**: Request reset, receive email, click link, set new password, verify can sign in with new password

### Implementation for User Story 4

- [X] T045 [P] [US4] Create ForgotPasswordForm component in `app/components/auth/ForgotPasswordForm.tsx` with email field
- [X] T046 [US4] Implement reset request in ForgotPasswordForm using `supabase.auth.resetPasswordForEmail()` with redirect to `/reset-password`
- [X] T047 [US4] Add loading state and generic success message to ForgotPasswordForm (FR-013 - don't reveal if email exists)
- [X] T048 [US4] Create forgot-password page in `app/(auth)/forgot-password/page.tsx` rendering ForgotPasswordForm with AuthFormWrapper
- [X] T049 [US4] Add link back to sign-in page from forgot-password page
- [X] T050 [P] [US4] Create ResetPasswordForm component in `app/components/auth/ResetPasswordForm.tsx` with password, confirmPassword fields
- [X] T051 [US4] Add validation to ResetPasswordForm: password min 8 chars, passwords match
- [X] T052 [US4] Implement password update in ResetPasswordForm using `supabase.auth.updateUser({ password })`
- [X] T053 [US4] Handle expired/invalid reset link with error message and option to request new link (FR-008)
- [X] T054 [US4] Create reset-password page in `app/(auth)/reset-password/page.tsx` rendering ResetPasswordForm with AuthFormWrapper
- [X] T055 [US4] Redirect to sign-in with success message after password update

**Checkpoint**: Password reset functional - users can recover accounts via email

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, error handling, and final polish across all auth features

- [X] T056 Ensure all form inputs have associated labels with `htmlFor` and `id` attributes (FR-016)
- [X] T057 Add `aria-describedby` linking error messages to form inputs for screen readers (FR-016)
- [X] T058 Verify keyboard navigation works for all auth forms - tab order, enter to submit (FR-016)
- [X] T059 [P] Add visible focus states to all interactive elements using design system focus ring
- [X] T060 Verify color contrast meets WCAG 2.1 AA standards for all auth page text
- [X] T061 [P] Create auth error page in `app/auth/auth-code-error/page.tsx` for OAuth/callback failures
- [X] T062 Add error boundary or fallback for unexpected auth errors
- [X] T063 Verify all error messages follow error mapping from contracts (generic, non-revealing)
- [ ] T064 Run quickstart.md manual testing checklist to verify all acceptance scenarios

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - P1 stories (US1, US2, US5) should be completed first for MVP
  - P2 stories (US3, US4, US6) can follow in any order
- **Polish (Phase 9)**: Depends on all user story phases being complete

### User Story Dependencies

- **User Story 1 (Sign Up) - P1**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (Sign In) - P1**: Can start after Foundational - No dependencies on other stories
- **User Story 5 (Protected Dashboard) - P1**: Can start after Foundational - Benefits from US1/US2 to test with real users
- **User Story 6 (Sign Out) - P2**: Requires dashboard to have sign out button - Benefits from US2 to have users to sign out
- **User Story 3 (Google OAuth) - P2**: Can start after Foundational - Independent of email/password flows
- **User Story 4 (Password Reset) - P2**: Can start after Foundational - Independent of sign-in/sign-up

### Within Each User Story

- Components before pages
- Core implementation before integration
- Error handling after happy path
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes:
  - T011 (SignUpForm) and T019 (SignInForm) can run in parallel
  - T045 (ForgotPasswordForm) and T050 (ResetPasswordForm) can run in parallel
  - T036 (GoogleSignInButton) can run in parallel with email/password forms
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1 & 2 (P1 Stories)

```bash
# After Phase 2 (Foundational) completes, launch P1 component tasks together:
Task: T011 "Create SignUpForm component in app/components/auth/SignUpForm.tsx"
Task: T019 "Create SignInForm component in app/components/auth/SignInForm.tsx"

# These work on different files and have no dependencies on each other
```

---

## Implementation Strategy

### MVP First (P1 User Stories Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Sign Up)
4. Complete Phase 4: User Story 2 (Sign In)
5. Complete Phase 5: User Story 5 (Protected Dashboard)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready - users can now create accounts, sign in, and access protected content

### Incremental Delivery

1. Complete Setup + Foundational -> Foundation ready
2. Add User Story 1 (Sign Up) -> Deploy/Demo (users can register!)
3. Add User Story 2 (Sign In) + Story 5 (Protected) -> Deploy/Demo (full auth MVP!)
4. Add User Story 6 (Sign Out) -> Deploy/Demo (complete session management)
5. Add User Story 3 (Google OAuth) -> Deploy/Demo (social login available)
6. Add User Story 4 (Password Reset) -> Deploy/Demo (full auth feature complete)
7. Complete Polish -> Production ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Manual testing via quickstart.md checklist - no automated tests in scope
- Supabase Dashboard configuration (Google OAuth, email settings) must be done separately
