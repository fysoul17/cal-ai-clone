# Data Model: Supabase Authentication

**Feature**: 004-supabase-auth
**Date**: 2026-01-27
**Status**: Complete

## Overview

This feature uses Supabase Auth, which manages authentication entities internally. The data model documents the conceptual entities and their relationships, along with any app-specific extensions.

## Entities

### 1. User (Supabase Managed)

**Source**: `auth.users` table (Supabase internal schema)

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Unique user identifier | Primary key, auto-generated |
| `email` | string | User's email address | Unique, required |
| `encrypted_password` | string | Hashed password | Managed by Supabase |
| `email_confirmed_at` | timestamp | When email was verified | Nullable (null = unverified) |
| `created_at` | timestamp | Account creation time | Auto-generated |
| `updated_at` | timestamp | Last update time | Auto-updated |
| `raw_app_meta_data` | jsonb | App-level metadata | Provider info, etc. |
| `raw_user_meta_data` | jsonb | User-level metadata | Display name, avatar, etc. |

**Relationships**:
- Has many `identities` (for OAuth providers)
- Has many `sessions`
- Has many `mfa_factors` (not used in MVP)

**Validation Rules**:
- Email must be valid format
- Password minimum 8 characters (FR-003)
- Email must be unique across all auth methods

### 2. Identity (Supabase Managed)

**Source**: `auth.identities` table

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Identity identifier | Primary key |
| `user_id` | UUID | Reference to user | Foreign key to auth.users |
| `provider` | string | Auth provider name | 'email', 'google', etc. |
| `provider_id` | string | Provider's user ID | Unique per provider |
| `identity_data` | jsonb | Provider-specific data | Email, name, avatar, etc. |
| `created_at` | timestamp | Identity creation time | Auto-generated |
| `updated_at` | timestamp | Last update time | Auto-updated |

**State Transitions**:
- Created on first sign-up/sign-in with a provider
- Can be linked to existing user (FR-006: Google OAuth + email linking)

### 3. Session (Supabase Managed)

**Source**: `auth.sessions` table

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | UUID | Session identifier | Primary key |
| `user_id` | UUID | Reference to user | Foreign key to auth.users |
| `created_at` | timestamp | Session start time | Auto-generated |
| `updated_at` | timestamp | Last refresh time | Auto-updated |
| `not_after` | timestamp | Session expiration | 7 days from creation/refresh |
| `refreshed_at` | timestamp | Last token refresh | Auto-updated |

**Session Lifecycle**:
1. Created on successful sign-in
2. Refreshed by middleware on each request
3. Expires after 7 days of inactivity
4. Invalidated on sign-out

**Refresh Token**:
- Stored in `auth.refresh_tokens` table
- Valid for 30 days
- Used to create new sessions transparently

### 4. Authentication Event (Application Concept)

> Note: Supabase logs auth events internally. This entity describes the conceptual model per spec requirements.

| Field | Type | Description |
|-------|------|-------------|
| `event_type` | enum | 'sign_in', 'sign_up', 'sign_out', 'password_reset' |
| `user_id` | UUID | User performing action |
| `method` | string | 'email', 'google', etc. |
| `status` | enum | 'success', 'failure' |
| `timestamp` | timestamp | When event occurred |
| `ip_address` | string | Client IP (for security logging) |
| `error_code` | string | Error identifier if failed |

**Note**: Supabase Auth logs these events internally. Access via Supabase Dashboard under Authentication → Logs.

## Client-Side Session Object

The session object available in client code:

```typescript
interface Session {
  access_token: string       // JWT for API calls
  refresh_token: string      // Token for session refresh
  expires_in: number         // Seconds until access_token expires
  expires_at: number         // Unix timestamp of expiration
  token_type: 'bearer'
  user: User
}

interface User {
  id: string                 // UUID
  email: string
  email_confirmed_at: string | null
  phone: string | null
  created_at: string
  updated_at: string
  app_metadata: {
    provider: string         // 'email' or 'google'
    providers: string[]      // All linked providers
  }
  user_metadata: {
    avatar_url?: string      // From Google OAuth
    full_name?: string       // From Google OAuth
    email_verified?: boolean
  }
}
```

## State Diagrams

### User Account States

```
                    ┌─────────────┐
                    │   (Start)   │
                    └──────┬──────┘
                           │ Sign up
                           ▼
                    ┌─────────────┐
        ┌──────────│  Unverified │
        │          └──────┬──────┘
        │                 │ Email confirmed
        │                 ▼
        │          ┌─────────────┐
        │          │   Verified  │◄─────────────┐
        │          └──────┬──────┘              │
        │                 │ Sign in             │
        │                 ▼                     │
        │          ┌─────────────┐              │
        │          │   Active    │──────────────┤
        │          │  (session)  │ Sign out     │
        │          └──────┬──────┘              │
        │                 │ Session expires     │
        │                 ▼                     │
        │          ┌─────────────┐              │
        └─────────►│   Inactive  │──────────────┘
                   │ (no session)│ Sign in again
                   └─────────────┘
```

### OAuth Account Linking Flow

```
┌─────────────────────────────────────────────────────┐
│              Google OAuth Sign-In                    │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Check email exists │
              └─────────────────────┘
                    │           │
           No match │           │ Email matches
                    ▼           ▼
          ┌─────────────┐ ┌─────────────────┐
          │ Create new  │ │ Link identity   │
          │   account   │ │ to existing     │
          └─────────────┘ │   account       │
                          └─────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
          ┌─────────────────┐       ┌─────────────────┐
          │ Email/password  │       │ Google OAuth    │
          │ account linked  │       │ primary         │
          └─────────────────┘       └─────────────────┘
```

## Database Considerations

### App-Level User Data (Future)

The application may need to store additional user data (e.g., preferences, meal history). This should be stored in the `public` schema with a foreign key to `auth.users`.

```sql
-- Example future extension (not in current scope)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  daily_calorie_target INTEGER DEFAULT 2000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

When adding app-level user data, enable RLS:

```sql
-- Example RLS policy (not in current scope)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

## Type Definitions

```typescript
// types/auth.ts

export type AuthProvider = 'email' | 'google';

export interface AuthUser {
  id: string;
  email: string;
  emailConfirmedAt: string | null;
  providers: AuthProvider[];
  metadata: {
    avatarUrl?: string;
    fullName?: string;
  };
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type AuthEventType =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'PASSWORD_RECOVERY'
  | 'TOKEN_REFRESHED'
  | 'USER_UPDATED';
```
