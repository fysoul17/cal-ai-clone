# Quickstart: Supabase Authentication Implementation

**Feature**: 004-supabase-auth
**Date**: 2026-01-27
**Estimated Implementation**: See tasks.md for detailed breakdown

## Prerequisites

### 1. Supabase Project Setup

1. Create a Supabase project at [supabase.com](https://supabase.com) (if not already done)
2. Note your project URL and anon key from Project Settings → API

### 2. Google OAuth Setup (for Google Sign-In)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://[your-project-id].supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret

### 3. Supabase Dashboard Configuration

**Authentication → Providers → Email**:
- Enable Email provider: ON
- Confirm email: ON
- Minimum password length: 8

**Authentication → Providers → Google**:
- Enable Google provider: ON
- Add Google Client ID and Client Secret

**Authentication → URL Configuration**:
- Site URL: `http://localhost:3000` (dev) / your production URL
- Redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

---

## Installation

```bash
pnpm add @supabase/ssr @supabase/supabase-js
```

---

## Environment Variables

Create/update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]

# Optional: Production site URL for redirects
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

Add to `.env.example` for team reference (without real values).

---

## Implementation Order

### Phase 1: Core Infrastructure (P1 - Required for auth to work)

1. **Supabase Client Factories**
   - `lib/supabase/client.ts` - Browser client
   - `lib/supabase/server.ts` - Server client
   - `lib/supabase/middleware.ts` - Middleware client

2. **Middleware Setup**
   - `middleware.ts` - Session refresh + route protection

3. **Auth Callback Handler**
   - `app/auth/callback/route.ts` - OAuth/email verification handler

### Phase 2: Email/Password Authentication (P1)

4. **Sign-Up Flow**
   - `app/(auth)/sign-up/page.tsx`
   - `app/components/auth/SignUpForm.tsx`

5. **Sign-In Flow**
   - `app/(auth)/sign-in/page.tsx`
   - `app/components/auth/SignInForm.tsx`

6. **Sign-Out**
   - Add sign-out button to dashboard header

### Phase 3: Google OAuth (P2)

7. **Google Sign-In Button**
   - `app/components/auth/GoogleSignInButton.tsx`
   - Integrate into sign-in and sign-up pages

### Phase 4: Password Reset (P2)

8. **Forgot Password**
   - `app/(auth)/forgot-password/page.tsx`
   - `app/components/auth/ForgotPasswordForm.tsx`

9. **Reset Password**
   - `app/(auth)/reset-password/page.tsx`
   - `app/components/auth/ResetPasswordForm.tsx`

### Phase 5: Polish & Edge Cases

10. **Error Handling**
    - Auth error page
    - Session expiration handling

11. **UI Polish**
    - Loading states
    - Accessibility audit

---

## Quick Reference: Key Code Patterns

### Browser Client Usage

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// In a client component:
'use client';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
await supabase.auth.signInWithPassword({ email, password });
```

### Server Client Usage

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

// In a server component or route handler:
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### Middleware Pattern

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Route protection
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth pages
  if (user && ['/sign-in', '/sign-up'].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/forgot-password'],
};
```

---

## Testing Checklist

### Manual Testing (per spec acceptance criteria)

**Sign Up (User Story 1)**:
- [ ] Valid email/password → Receive confirmation email
- [ ] Click confirmation link → Redirected to dashboard
- [ ] Duplicate email → Error with sign-in link
- [ ] Short password (<8 chars) → Validation error

**Sign In (User Story 2)**:
- [ ] Valid credentials → Redirected to dashboard
- [ ] Invalid credentials → Generic error message
- [ ] Unverified email → Prompt to verify

**Google OAuth (User Story 3)**:
- [ ] New user → Account created, redirected to dashboard
- [ ] Existing user → Signed in, redirected to dashboard
- [ ] Cancelled auth → Returned to sign-in with message

**Password Reset (User Story 4)**:
- [ ] Request reset → Confirmation shown (regardless of email)
- [ ] Click link → Can set new password
- [ ] Expired link → Error with option to request new link

**Protected Routes (User Story 5)**:
- [ ] Unauthenticated → `/dashboard` redirects to sign-in
- [ ] Authenticated → `/dashboard` accessible
- [ ] Session expires → Redirected on next action

**Sign Out (User Story 6)**:
- [ ] Click sign out → Session terminated, redirected to landing
- [ ] After sign out → Cannot access protected routes

---

## Troubleshooting

### Common Issues

**"Session not refreshing"**
- Ensure middleware is correctly setting cookies on BOTH request and response
- Check middleware matcher includes the route

**"OAuth callback fails"**
- Verify redirect URL is added in Supabase Dashboard
- Check Google OAuth credentials match

**"Email verification link not working"**
- Check email redirect URL in signUp options
- Verify `/auth/callback` route handler is correct

**"User signed in but session is null"**
- This is expected when email confirmation is enabled
- Session becomes available after email verification

---

## Files to Create

```
lib/
└── supabase/
    ├── client.ts           # Browser client factory
    ├── server.ts           # Server client factory
    └── middleware.ts       # Middleware client factory

app/
├── middleware.ts           # Root middleware
├── auth/
│   └── callback/
│       └── route.ts        # OAuth callback handler
├── (auth)/
│   ├── layout.tsx          # Optional: shared auth layout
│   ├── sign-in/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   ├── forgot-password/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
└── components/
    └── auth/
        ├── SignInForm.tsx
        ├── SignUpForm.tsx
        ├── ForgotPasswordForm.tsx
        ├── ResetPasswordForm.tsx
        ├── GoogleSignInButton.tsx
        └── AuthFormWrapper.tsx
```

---

## Next Steps

After completing this quickstart setup:

1. Run `/speckit.tasks` to generate the detailed task list
2. Follow the tasks in order, checking off acceptance criteria
3. Run the testing checklist before marking feature complete
