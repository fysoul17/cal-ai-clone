'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import GoogleSignInButton from './GoogleSignInButton';

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

const initialState: SignUpFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  isLoading: false,
  error: null,
  successMessage: null,
};

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [state, setState] = useState<SignUpFormState>(initialState);

  // Validation functions
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Please enter your email address';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Please enter a password';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setState(prev => ({ ...prev, error: null, successMessage: null }));

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

    const confirmError = validateConfirmPassword(state.password, state.confirmPassword);
    if (confirmError) {
      setState(prev => ({ ...prev, error: confirmError }));
      return;
    }

    // Start loading
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: state.email,
        password: state.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('already registered') || error.message.includes('already exists')) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'email_already_exists',
          }));
        } else if (error.message.includes('Password')) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Password must be at least 8 characters',
          }));
        } else {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: error.message || 'An error occurred during sign up',
          }));
        }
        return;
      }

      // Success - show verification message
      setState(prev => ({
        ...prev,
        isLoading: false,
        successMessage: 'Check your email for a verification link to complete your registration.',
      }));

      onSuccess?.();
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred. Please try again.',
      }));
    }
  };

  const handleInputChange = (field: keyof Pick<SignUpFormState, 'email' | 'password' | 'confirmPassword'>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(prev => ({
      ...prev,
      [field]: e.target.value,
      error: null,
    }));
  };

  // If success, show success message
  if (state.successMessage) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
        <p className="text-[#A0A0B8] mb-6">{state.successMessage}</p>
        <Link
          href="/sign-in"
          className="text-[#FF6B35] hover:text-[#FF8F5E] font-medium transition-colors"
        >
          Back to Sign In
        </Link>
      </div>
    );
  }

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
        <label htmlFor="password" className="block text-sm font-medium text-[#A0A0B8] mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={state.password}
          onChange={handleInputChange('password')}
          disabled={state.isLoading}
          placeholder="Minimum 8 characters"
          aria-describedby={state.error ? 'error-message' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 border-white/10 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all disabled:opacity-50"
        />
      </div>

      {/* Confirm Password field */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#A0A0B8] mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={state.confirmPassword}
          onChange={handleInputChange('confirmPassword')}
          disabled={state.isLoading}
          placeholder="Re-enter your password"
          aria-describedby={state.error ? 'error-message' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 border-white/10 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all disabled:opacity-50"
        />
      </div>

      {/* Error message */}
      {state.error && (
        <div id="error-message" role="alert" className="text-[#EF4444] text-sm">
          {state.error === 'email_already_exists' ? (
            <span>
              An account with this email already exists.{' '}
              <Link href="/sign-in" className="underline hover:text-[#EF4444]/80">
                Sign in instead?
              </Link>
            </span>
          ) : (
            state.error
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
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-gradient-to-br from-[#252541] to-[#0F0F1A] text-[#A0A0B8]">or sign up with</span>
        </div>
      </div>

      {/* Google Sign Up */}
      <GoogleSignInButton label="Sign up with Google" disabled={state.isLoading} />

      {/* Link to sign in */}
      <p className="text-center text-[#A0A0B8] mt-6">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-[#FF6B35] hover:text-[#FF8F5E] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
