# Research: Supabase Authentication for Next.js App Router

**Feature**: 004-supabase-auth
**Date**: 2026-01-27
**Status**: Complete

## Research Tasks Completed

### 1. Supabase SSR Package Selection

**Decision**: Use `@supabase/ssr` package for Next.js App Router integration.

**Rationale**:
- Official Supabase package specifically designed for SSR frameworks
- Provides `createServerClient` and `createBrowserClient` factories
- Handles cookie-based session management with proper httpOnly settings
- Mandatory middleware pattern ensures session refresh on every request

**Alternatives Considered**:
- `@supabase/auth-helpers-nextjs` - Deprecated in favor of `@supabase/ssr`
- `@supabase/supabase-js` alone - Doesn't handle SSR cookie patterns correctly

### 2. Session Management Strategy

**Decision**: Cookie-based sessions using Supabase default settings with middleware refresh.

**Rationale**:
- httpOnly cookies prevent XSS token theft (per spec assumption)
- Middleware pattern is **mandatory** for proper session refresh
- Server components get read-only session access
- Route handlers and Server Actions can mutate sessions

**Key Pattern** (from Supabase SSR docs):
```typescript
// middleware.ts - REQUIRED for session refresh
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookies) => {
        // Must set on BOTH request and response
        cookies.forEach(({ name, value }) => request.cookies.set(name, value))
        const response = NextResponse.next({ request })
        cookies.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
        return response
      }
    }
  })

  await supabase.auth.getSession() // Triggers refresh if needed
  return response
}
```

**Session Duration** (per spec clarifications):
- Session: 7 days
- Refresh token: 30 days

### 3. OAuth Callback Handling

**Decision**: Dedicated route handler at `/auth/callback/route.ts` using PKCE flow.

**Rationale**:
- Standard Supabase pattern for OAuth and magic link callbacks
- Handles code exchange securely on server
- Supports redirect URL validation for security
- Works with both Google OAuth and email verification links

**Key Pattern**:
```typescript
// app/auth/callback/route.ts
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```

### 4. Client Factory Patterns

**Decision**: Three separate client factories for different contexts.

**Rationale**:
- **Browser client** (`createBrowserClient`): Used in client components, automatically handles document.cookie
- **Server client** (`createServerClient`): Used in Server Components, Route Handlers, Server Actions
- **Middleware client**: Special case with both getAll and setAll for request/response cookie handling

**File Structure**:
```
lib/supabase/
├── client.ts      # Browser client (singleton by default)
├── server.ts      # Server component/action client
└── middleware.ts  # Middleware-specific client
```

### 5. Route Protection Strategy

**Decision**: Middleware-based route protection with redirect to sign-in.

**Rationale**:
- Centralized protection logic
- Runs before any page render
- Can be configured via `matcher` in middleware config
- Per spec FR-009, FR-010: `/dashboard` must be protected

**Protected Routes Pattern**:
```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*']
}

// In middleware function:
const { data: { session } } = await supabase.auth.getSession()
if (!session && protectedRoutes.includes(pathname)) {
  return NextResponse.redirect(new URL('/sign-in', request.url))
}
```

### 6. Google OAuth Configuration

**Decision**: Configure in Supabase Dashboard, use `signInWithOAuth` in client.

**Rationale**:
- OAuth credentials stored securely in Supabase, not in codebase
- Client-side initiates OAuth flow
- Callback handled by `/auth/callback` route
- Per spec FR-006: Accounts linked by email automatically

**Environment Variables Needed**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
```

Google OAuth setup in Supabase Dashboard:
1. Enable Google provider
2. Add Google Client ID and Secret
3. Configure redirect URL: `https://[project-id].supabase.co/auth/v1/callback`

### 7. Email Verification Flow

**Decision**: Email confirmation enabled (Supabase default), redirect to sign-in after confirmation.

**Rationale**:
- Per spec FR-002: Must require email verification
- Supabase sends confirmation email automatically on signup
- Confirmation link includes code, handled by `/auth/callback`
- User redirected to dashboard after successful verification

**Flow**:
1. User signs up → gets confirmation email
2. User clicks link → redirected to `/auth/callback?code=xxx&next=/dashboard`
3. Callback exchanges code for session
4. User redirected to dashboard as authenticated

### 8. Password Reset Flow

**Decision**: Two-step flow using `resetPasswordForEmail` and `updateUser`.

**Rationale**:
- Standard Supabase pattern
- Per spec FR-007, FR-008: Must allow reset via email, expire links after 1 hour
- Supabase handles link generation and expiration

**Flow**:
1. User requests reset → `supabase.auth.resetPasswordForEmail(email, { redirectTo })`
2. User clicks link → redirected to `/reset-password?code=xxx`
3. User enters new password → `supabase.auth.updateUser({ password })`
4. User redirected to sign-in

### 9. Rate Limiting

**Decision**: Rely on Supabase built-in rate limiting.

**Rationale**:
- Supabase Auth has built-in brute force protection
- Per spec FR-014: Max 5 failed attempts, 15-minute lockout
- Need to verify Supabase defaults match spec or configure via Dashboard

**Note**: May need to configure rate limiting in Supabase Dashboard if defaults don't match spec requirements.

### 10. Error Handling

**Decision**: Generic error messages that don't reveal user existence.

**Rationale**:
- Per spec FR-013: Must not reveal sensitive info in errors
- Standard practice: "Invalid email or password" vs "User not found"
- Supabase returns specific errors; map to generic messages in UI

**Error Mapping**:
| Supabase Error | User-facing Message |
|----------------|---------------------|
| Invalid login credentials | Invalid email or password |
| User already registered | This email is already registered |
| Email not confirmed | Please verify your email first |
| Password too short | Password must be at least 8 characters |

## Dependencies to Install

```bash
pnpm add @supabase/ssr @supabase/supabase-js
```

## Environment Variables

```env
# Required for Supabase client
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Optional: For determining redirect URLs
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

## Supabase Dashboard Configuration Required

1. **Authentication → Providers → Email**:
   - Enable Email provider
   - Set "Confirm email" to ON
   - Set minimum password length to 8

2. **Authentication → Providers → Google**:
   - Enable Google provider
   - Add Client ID and Secret from Google Cloud Console
   - Configure redirect URLs

3. **Authentication → URL Configuration**:
   - Site URL: Production URL
   - Redirect URLs: Add localhost for dev, production domain

4. **Authentication → Rate Limits** (if configurable):
   - Max failed attempts: 5
   - Lockout duration: 15 minutes

## NEEDS CLARIFICATION - Resolved

| Item | Resolution |
|------|------------|
| Session duration | 7-day session, 30-day refresh token (per spec clarifications) |
| Client storage | httpOnly cookies via Supabase default (per spec assumptions) |
| Accessibility level | WCAG 2.1 AA (per spec clarifications) |
| Google OAuth + email conflict | Block signup, prompt to use Google (per spec clarifications) |
| Loading state feedback | Disable button with inline spinner (per spec clarifications) |
