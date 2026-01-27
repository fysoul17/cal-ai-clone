# API & Component Contracts: Supabase Authentication

**Feature**: 004-supabase-auth
**Date**: 2026-01-27
**Status**: Complete

## Overview

This document defines the contracts for auth-related components and API interactions. Since authentication uses Supabase's client SDK rather than REST endpoints, this focuses on component interfaces and Supabase method contracts.

---

## Component Contracts

### 1. SignInForm

**Location**: `app/components/auth/SignInForm.tsx`

```typescript
interface SignInFormProps {
  /** Callback when sign-in succeeds */
  onSuccess?: () => void;
  /** URL to redirect after sign-in (default: /dashboard) */
  redirectTo?: string;
}

interface SignInFormState {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}
```

**Behavior**:
- Validates email format client-side
- Validates password minimum length (8 chars)
- Shows loading spinner on submit button when `isLoading`
- Displays error message below form on failure
- Redirects to `redirectTo` on success
- Includes link to sign-up page
- Includes link to forgot-password page

**Accessibility (FR-016)**:
- All inputs have associated labels
- Error messages linked via `aria-describedby`
- Form is keyboard navigable
- Focus management on error

---

### 2. SignUpForm

**Location**: `app/components/auth/SignUpForm.tsx`

```typescript
interface SignUpFormProps {
  /** Callback when sign-up succeeds (before email verification) */
  onSuccess?: () => void;
}

interface SignUpFormState {
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}
```

**Behavior**:
- Validates email format client-side
- Validates password minimum 8 characters (FR-003)
- Validates password confirmation matches
- Shows loading spinner on submit button when `isLoading`
- On success, displays "Check your email" message
- Does NOT redirect (user must verify email first)
- Includes link to sign-in page

**Error Handling**:
- "Email already in use" → Show message with link to sign-in
- Validation errors → Inline field errors

---

### 3. ForgotPasswordForm

**Location**: `app/components/auth/ForgotPasswordForm.tsx`

```typescript
interface ForgotPasswordFormProps {
  /** Optional callback after request sent */
  onSuccess?: () => void;
}

interface ForgotPasswordFormState {
  email: string;
  isLoading: boolean;
  error: string | null;
  isSubmitted: boolean;
}
```

**Behavior**:
- Single email input field
- Shows loading spinner on submit
- On success, shows confirmation message (regardless of email existence per FR-013)
- Message: "If an account exists for this email, you will receive a reset link."
- Includes link back to sign-in

---

### 4. ResetPasswordForm

**Location**: `app/components/auth/ResetPasswordForm.tsx`

```typescript
interface ResetPasswordFormProps {
  /** Callback on successful password update */
  onSuccess?: () => void;
}

interface ResetPasswordFormState {
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
}
```

**Behavior**:
- Two password inputs (new password + confirm)
- Validates minimum 8 characters
- Validates passwords match
- Shows loading spinner on submit
- On success, redirects to sign-in with success message
- Handles expired/invalid links gracefully (FR-008)

---

### 5. GoogleSignInButton

**Location**: `app/components/auth/GoogleSignInButton.tsx`

```typescript
interface GoogleSignInButtonProps {
  /** Visual variant */
  variant?: 'primary' | 'outline';
  /** Button text override */
  label?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}
```

**Behavior**:
- Initiates Google OAuth flow via `supabase.auth.signInWithOAuth`
- Shows loading state during redirect
- Google logo icon included

**Default Label**: "Sign in with Google"

---

### 6. AuthFormWrapper

**Location**: `app/components/auth/AuthFormWrapper.tsx`

```typescript
interface AuthFormWrapperProps {
  /** Form title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Form content */
  children: React.ReactNode;
}
```

**Behavior**:
- Provides consistent styling for auth pages
- Centered card layout
- Applies design system styles (gradient background, card surface)
- Responsive width (max-w-md on desktop)

---

## Supabase Auth Method Contracts

### Sign Up with Email/Password

```typescript
// Input
interface SignUpCredentials {
  email: string;
  password: string;
  options?: {
    emailRedirectTo?: string;
    data?: Record<string, unknown>;
  };
}

// Usage
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securepassword',
  options: {
    emailRedirectTo: `${origin}/auth/callback?next=/dashboard`
  }
});

// Success Response (email confirmation enabled)
{
  data: {
    user: User | null,      // User object
    session: null           // Null until email confirmed
  },
  error: null
}

// Error Response
{
  data: { user: null, session: null },
  error: {
    message: string,        // e.g., "User already registered"
    status: number
  }
}
```

---

### Sign In with Email/Password

```typescript
// Input
interface SignInCredentials {
  email: string;
  password: string;
}

// Usage
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'securepassword'
});

// Success Response
{
  data: {
    user: User,
    session: Session
  },
  error: null
}

// Error Responses
// - Invalid credentials
// - Email not confirmed
```

---

### Sign In with Google OAuth

```typescript
// Input
interface OAuthSignIn {
  provider: 'google';
  options?: {
    redirectTo?: string;
    scopes?: string;
  };
}

// Usage
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${origin}/auth/callback?next=/dashboard`
  }
});

// Response (initiates redirect, doesn't return session)
{
  data: {
    provider: 'google',
    url: string            // OAuth provider URL to redirect to
  },
  error: null
}
```

---

### Reset Password Request

```typescript
// Input
interface ResetPasswordRequest {
  email: string;
  options?: {
    redirectTo?: string;   // Where to redirect after clicking link
  };
}

// Usage
const { data, error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  {
    redirectTo: `${origin}/reset-password`
  }
);

// Response (always success-like for security)
{
  data: {},
  error: null              // Error only for invalid email format
}
```

---

### Update Password

```typescript
// Input
interface UpdatePassword {
  password: string;
}

// Usage (after user clicks reset link)
const { data, error } = await supabase.auth.updateUser({
  password: 'newpassword'
});

// Success Response
{
  data: {
    user: User
  },
  error: null
}

// Error Responses
// - Password too short
// - Invalid/expired recovery token
```

---

### Sign Out

```typescript
// Usage
const { error } = await supabase.auth.signOut();

// Success Response
{
  error: null
}
```

---

### Get Current Session

```typescript
// Usage (server-side)
const { data: { session }, error } = await supabase.auth.getSession();

// Usage (get user, recommended over getSession for security)
const { data: { user }, error } = await supabase.auth.getUser();
```

---

## Route Handler Contracts

### OAuth Callback Handler

**Endpoint**: `GET /auth/callback`

**Location**: `app/auth/callback/route.ts`

```typescript
// Query Parameters
interface CallbackParams {
  code: string;              // Authorization code from OAuth/email
  next?: string;             // Redirect destination (default: /dashboard)
  error?: string;            // Error from OAuth provider
  error_description?: string;
}

// Behavior
// 1. Extract code from query params
// 2. Exchange code for session: supabase.auth.exchangeCodeForSession(code)
// 3. On success: redirect to `next` param or /dashboard
// 4. On error: redirect to /auth/auth-code-error
```

---

## Middleware Contract

**Location**: `middleware.ts`

```typescript
// Protected Routes
const protectedRoutes = ['/dashboard'];

// Public-Only Routes (redirect authenticated users away)
const publicOnlyRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

// Note: (auth) route group is for organization only - URLs remain /sign-in, not /(auth)/sign-in

// Behavior
// 1. Create Supabase client with cookie handlers
// 2. Call getSession() to refresh session if needed
// 3. If accessing protected route without session → redirect to /sign-in
// 4. If accessing public-only route with session → redirect to /dashboard
// 5. Always return response with updated cookies
```

**Matcher Configuration**:
```typescript
export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    // Public-only routes (redirect authenticated users)
    // Note: (auth) route group means URLs are /sign-in, not /(auth)/sign-in
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
  ]
};
```

---

## Error Message Mapping

Per FR-013, error messages must not reveal sensitive information.

| Supabase Error Code | Internal Message | User-facing Message |
|---------------------|------------------|---------------------|
| `invalid_credentials` | Invalid login credentials | Invalid email or password |
| `email_not_confirmed` | Email not confirmed | Please verify your email address. Check your inbox. |
| `user_already_exists` | User already registered | An account with this email already exists. [Sign in instead?] |
| `weak_password` | Password should be at least 8 characters | Password must be at least 8 characters |
| `invalid_email` | Unable to validate email address | Please enter a valid email address |
| `over_request_rate_limit` | Too many requests | Too many attempts. Please try again in 15 minutes. |
| `expired_token` | Token has expired | This link has expired. Please request a new one. |

---

## Form Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| Email | Required, valid email format | "Please enter a valid email address" |
| Password | Required, min 8 characters | "Password must be at least 8 characters" |
| Confirm Password | Must match password | "Passwords do not match" |

---

## Design System Compliance

All auth components must adhere to `docs/design-system.md`:

| Element | Design Token |
|---------|--------------|
| Form background | `--color-surface` (#252541) |
| Primary button | Gradient `--gradient-primary` |
| Input fields | `--color-bg-darker`, `--radius-md` |
| Error text | `--color-error` (#EF4444) |
| Success text | `--color-success` (#22C55E) |
| Border radius (card) | `--radius-xl` (24px) |
| Border radius (button) | `--radius-full` (pill) |
| Border radius (input) | `--radius-md` (12px) |
