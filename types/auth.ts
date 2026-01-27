// types/auth.ts
// Auth type definitions based on data-model.md

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
