'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import GoogleSignInButton from './GoogleSignInButton';

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
  showResendVerification: boolean;
}

const initialState: SignInFormState = {
  email: '',
  password: '',
  isLoading: false,
  error: null,
  showResendVerification: false,
};

export default function SignInForm({ onSuccess, redirectTo = '/dashboard' }: SignInFormProps) {
  const [state, setState] = useState<SignInFormState>(initialState);
  const router = useRouter();

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Please enter your email address';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Please enter your password';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setState(prev => ({ ...prev, error: null, showResendVerification: false }));

    // Client-side validation
    const emailError = validateEmail(state.email);
    if (emailError) {
      setState(prev => ({ ...prev, error: emailError }));
      return;
    }

    const passwordError = validatePassword(state.password);
    if (passwordError) {
      setState(prev => ({ ...prev, error: passwordError }));
      return;
    }

    // Start loading
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: state.email,
        password: state.password,
      });

      if (error) {
        // Handle specific error cases (FR-013: generic, non-revealing messages)
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Invalid email or password',
          }));
        } else if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Please verify your email address. Check your inbox.',
            showResendVerification: true,
          }));
        } else if (error.message.includes('Too many requests') || error.message.includes('rate_limit')) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Too many attempts. Please try again in 15 minutes.',
          }));
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Invalid email or password',
          }));
        }
        return;
      }

      // Success - redirect to dashboard
      onSuccess?.();
      router.push(redirectTo);
      router.refresh();
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred. Please try again.',
      }));
    }
  };

  const handleResendVerification = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const supabase = createClient();
      await supabase.auth.resend({
        type: 'signup',
        email: state.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Verification email sent! Check your inbox.',
        showResendVerification: false,
      }));
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to resend verification email. Please try again.',
      }));
    }
  };

  const handleInputChange = (field: keyof Pick<SignInFormState, 'email' | 'password'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(prev => ({
      ...prev,
      [field]: e.target.value,
      error: null,
      showResendVerification: false,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#A0A0B8] mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={state.email}
          onChange={handleInputChange('email')}
          disabled={state.isLoading}
          placeholder="you@example.com"
          aria-describedby={state.error ? 'error-message' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 border-white/10 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all disabled:opacity-50"
        />
      </div>

      {/* Password field */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className="block text-sm font-medium text-[#A0A0B8]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-[#FF6B35] hover:text-[#FF8F5E] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          value={state.password}
          onChange={handleInputChange('password')}
          disabled={state.isLoading}
          placeholder="Enter your password"
          aria-describedby={state.error ? 'error-message' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 border-white/10 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all disabled:opacity-50"
        />
      </div>

      {/* Error message */}
      {state.error && (
        <div id="error-message" role="alert" className="text-[#EF4444] text-sm">
          {state.error}
          {state.showResendVerification && (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={state.isLoading}
              className="ml-2 underline hover:text-[#EF4444]/80 disabled:opacity-50"
            >
              Resend verification email
            </button>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={state.isLoading}
        className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-[0_8px_32px_rgba(255,107,53,0.4)]"
      >
        {state.isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </span>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gradient-to-br from-[#252541] to-[#0F0F1A] text-[#A0A0B8]">or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <GoogleSignInButton disabled={state.isLoading} />

      {/* Link to sign up */}
      <p className="text-center text-[#A0A0B8] mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-[#FF6B35] hover:text-[#FF8F5E] font-medium transition-colors">
          Create one
        </Link>
      </p>
    </form>
  );
}
