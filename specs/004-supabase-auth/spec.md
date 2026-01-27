# Feature Specification: Supabase Authentication

**Feature Branch**: `004-supabase-auth`
**Created**: 2026-01-27
**Status**: Draft
**Input**: User description: "Supabase authentication with email/password and Google OAuth"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email/Password Sign Up (Priority: P1)

A new user visits the CalAI application and wants to create an account to track their meals and calories. They prefer using their email address to sign up rather than social login.

**Why this priority**: Account creation is the gateway to all app functionality. Without the ability to create accounts, users cannot access the core meal tracking features. This is the foundational user journey.

**Independent Test**: Can be fully tested by completing the sign-up flow with a valid email and password, verifying the user receives a confirmation email, and confirming their account to access the dashboard.

**Acceptance Scenarios**:

1. **Given** a user is on the sign-up page, **When** they enter a valid email and password (minimum 8 characters) and submit, **Then** they receive an email confirmation message and a verification email is sent to their address.

2. **Given** a user has received a verification email, **When** they click the confirmation link, **Then** they are redirected to the dashboard as an authenticated user.

3. **Given** a user enters an email that is already registered, **When** they submit the sign-up form, **Then** they see an error message indicating the email is already in use with a link to sign in instead.

4. **Given** a user enters a password shorter than 8 characters, **When** they submit the form, **Then** they see a validation error requiring a stronger password.

---

### User Story 2 - Email/Password Sign In (Priority: P1)

A returning user wants to sign in to their existing account using their email and password to continue tracking their meals.

**Why this priority**: Sign-in is equally critical as sign-up for returning users. Without reliable sign-in, users lose access to their historical meal data and cannot continue using the app.

**Independent Test**: Can be fully tested by signing in with valid credentials and verifying access to the protected dashboard with the correct user session.

**Acceptance Scenarios**:

1. **Given** a user with a verified account is on the sign-in page, **When** they enter correct email and password, **Then** they are redirected to the dashboard as an authenticated user.

2. **Given** a user enters incorrect credentials, **When** they submit the sign-in form, **Then** they see an error message indicating invalid email or password without revealing which is incorrect.

3. **Given** a user with an unverified email tries to sign in, **When** they submit correct credentials, **Then** they see a message prompting them to verify their email with an option to resend the verification email.

---

### User Story 3 - Google OAuth Sign In/Sign Up (Priority: P2)

A user prefers the convenience of signing in with their Google account rather than creating a separate password for the CalAI app.

**Why this priority**: Google OAuth reduces friction for users who prefer social login. It simplifies onboarding but is not essential for core functionality since email/password provides the same access.

**Independent Test**: Can be fully tested by clicking "Sign in with Google", completing Google's OAuth flow, and verifying the user is authenticated and redirected to the dashboard.

**Acceptance Scenarios**:

1. **Given** a new user is on the sign-in page, **When** they click "Sign in with Google" and authorize the app, **Then** a new account is created and they are redirected to the dashboard.

2. **Given** an existing user who previously signed up with Google, **When** they click "Sign in with Google", **Then** they are signed into their existing account and redirected to the dashboard.

3. **Given** a user clicks "Sign in with Google", **When** they cancel or deny authorization on Google's screen, **Then** they are returned to the sign-in page with an informational message.

4. **Given** a user has an existing email/password account, **When** they try to sign in with Google using the same email, **Then** the accounts are linked and they can use either method going forward.

---

### User Story 4 - Password Reset (Priority: P2)

A user has forgotten their password and needs to regain access to their account.

**Why this priority**: Essential for account recovery and user retention. Users who cannot recover their accounts will abandon the app. However, it's less frequently used than sign-in/sign-up flows.

**Independent Test**: Can be fully tested by requesting a password reset, receiving the email, clicking the reset link, and successfully setting a new password.

**Acceptance Scenarios**:

1. **Given** a user is on the forgot password page, **When** they enter their registered email and submit, **Then** they see a confirmation message that a reset email has been sent (regardless of whether the email exists).

2. **Given** a user received a password reset email, **When** they click the reset link within the valid time window, **Then** they are taken to a page where they can enter a new password.

3. **Given** a user clicks an expired or already-used reset link, **When** the page loads, **Then** they see an error message with an option to request a new reset email.

4. **Given** a user has set a new password, **When** they try to sign in with the old password, **Then** authentication fails and only the new password works.

---

### User Story 5 - Protected Dashboard Access (Priority: P1)

The dashboard page containing meal data should only be accessible to authenticated users.

**Why this priority**: Core to the authentication feature. Without route protection, authentication serves no purpose. Users' meal data must be protected from unauthorized access.

**Independent Test**: Can be fully tested by attempting to access the dashboard URL directly without authentication and verifying redirection to the sign-in page.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user, **When** they navigate directly to `/dashboard`, **Then** they are redirected to the sign-in page.

2. **Given** an authenticated user, **When** they navigate to `/dashboard`, **Then** they see their personalized dashboard with their meal data.

3. **Given** an authenticated user on the dashboard, **When** their session expires, **Then** they are redirected to the sign-in page on their next action with a message about the expired session.

---

### User Story 6 - Sign Out (Priority: P2)

An authenticated user wants to sign out of their account, especially when using a shared device.

**Why this priority**: Important for security and privacy. Users must be able to end their session. However, it's a simple, low-risk feature compared to sign-in flows.

**Independent Test**: Can be fully tested by signing out from the dashboard and verifying the user can no longer access protected pages without signing in again.

**Acceptance Scenarios**:

1. **Given** an authenticated user on any page, **When** they click the sign out button, **Then** their session is terminated and they are redirected to the landing page.

2. **Given** a user has signed out, **When** they try to access the dashboard, **Then** they are redirected to the sign-in page.

---

### Edge Cases

- What happens when a user's email provider is temporarily unavailable? The system shows a message to try again later and allows them to use Google OAuth as an alternative.
- How does the system handle concurrent sign-ins from multiple devices? Users can be signed in on multiple devices simultaneously; each session is independent.
- What happens if Google OAuth service is unavailable? The sign-in page displays an error for Google sign-in while email/password remains functional.
- What happens when a user tries to sign up with a disposable email address? The system accepts all valid email formats; domain restrictions are not enforced.
- How does the system handle rapid repeated sign-in attempts? After 5 failed attempts, the user must wait 15 minutes before trying again (rate limiting).
- What happens when a Google OAuth user tries to sign up with email/password using the same email? The system blocks the sign-up and prompts the user to sign in with their existing Google account instead.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create accounts using email and password
- **FR-002**: System MUST require email verification before granting full account access
- **FR-003**: System MUST enforce minimum password length of 8 characters
- **FR-004**: System MUST allow users to sign in using email and password
- **FR-005**: System MUST allow users to sign in or sign up using Google OAuth
- **FR-006**: System MUST link Google OAuth accounts with existing email accounts using the same email address
- **FR-007**: System MUST allow users to reset their password via email
- **FR-008**: System MUST expire password reset links after 1 hour
- **FR-009**: System MUST protect the `/dashboard` route from unauthenticated access
- **FR-010**: System MUST redirect unauthenticated users to the sign-in page when accessing protected routes
- **FR-011**: System MUST allow authenticated users to sign out
- **FR-012**: System MUST persist user sessions across browser refreshes
- **FR-013**: System MUST display appropriate error messages for authentication failures without revealing sensitive information
- **FR-014**: System MUST implement rate limiting to prevent brute force attacks (max 5 failed attempts, then 15-minute lockout)
- **FR-015**: System MUST redirect authenticated users away from sign-in/sign-up pages to the dashboard
- **FR-016**: Authentication pages MUST meet WCAG 2.1 AA accessibility standards (keyboard navigation, screen reader support, sufficient color contrast, visible focus states, descriptive error messages)
- **FR-017**: During authentication operations, the submit button MUST be disabled with an inline spinner while preserving form content for error recovery

### Key Entities

- **User**: Represents a registered user with attributes including unique identifier, email address, authentication method(s), email verification status, and account creation timestamp
- **Session**: Represents an active authentication session with user reference, expiration time, and refresh token capability
- **Authentication Event**: Represents sign-in attempts including success/failure status, method used, timestamp, and IP address (for security logging)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the email/password sign-up process in under 60 seconds (excluding email verification time)
- **SC-002**: Users can complete the sign-in process in under 30 seconds
- **SC-003**: 95% of password reset emails are delivered within 2 minutes
- **SC-004**: Google OAuth sign-in completes in under 10 seconds (excluding time on Google's pages)
- **SC-005**: Authentication pages load within 2 seconds on standard connections
- **SC-006**: Zero unauthorized access to protected routes (100% protection rate)
- **SC-007**: Session persistence works correctly across browser refreshes with 100% reliability
- **SC-008**: Error messages are displayed within 1 second of form submission

## Clarifications

### Session 2025-01-27
- Q: What should the session expiration duration be? → A: 7-day session with 30-day refresh token
- Q: How should authentication state be stored on the client? → A: Supabase default (httpOnly cookies)
- Q: What level of accessibility compliance is required? → A: WCAG 2.1 AA compliance
- Q: What happens when a Google OAuth user tries email/password sign-up with same email? → A: Block sign-up, prompt to use Google
- Q: What UI feedback during auth operations? → A: Disable button with inline spinner, preserve form content

## Assumptions

- User sessions expire after 7 days of inactivity, with refresh tokens valid for 30 days to enable seamless re-authentication
- Supabase will be used as the authentication provider (as specified in the feature request)
- The existing landing page (`/`) should remain publicly accessible
- Email delivery is handled by Supabase's built-in email service
- Google OAuth credentials will be configured in the Supabase dashboard
- The app will use Supabase's default httpOnly cookie-based session storage for maximum security (prevents XSS token theft)
- Users signing up with Google OAuth consent to sharing their email address with the application
- The existing design system (colors, typography, component patterns) will be applied to auth pages
- The redirect URL after OAuth is the application's `/auth/callback` route
