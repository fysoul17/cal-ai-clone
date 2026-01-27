'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

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

const initialState: ForgotPasswordFormState = {
  email: '',
  isLoading: false,
  error: null,
  isSubmitted: false,
};

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const [state, setState] = useState<ForgotPasswordFormState>(initialState);

  // Validate email
  const validateEmail = (email: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Please enter your email address';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setState(prev => ({ ...prev, error: null }));

    // Client-side validation
    const emailError = validateEmail(state.email);
    if (emailError) {
      setState(prev => ({ ...prev, error: emailError }));
      return;
    }

    // Start loading
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const supabase = createClient();
      // FR-013: Don't reveal if email exists - always show success
      await supabase.auth.resetPasswordForEmail(state.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      // Always show success message (don't reveal if email exists)
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitted: true,
      }));

      onSuccess?.();
    } catch {
      // Still show success for security
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubmitted: true,
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({
      ...prev,
      email: e.target.value,
      error: null,
    }));
  };

  // If submitted, show confirmation message
  if (state.isSubmitted) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FF6B35]/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
        <p className="text-[#A0A0B8] mb-6">
          If an account exists for {state.email}, you will receive a password reset link.
        </p>
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
      <p className="text-[#A0A0B8] text-center mb-4">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#A0A0B8] mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={state.email}
          onChange={handleInputChange}
          disabled={state.isLoading}
          placeholder="you@example.com"
          aria-describedby={state.error ? 'error-message' : undefined}
          className="w-full px-4 py-3 rounded-xl bg-[#0F0F1A] border-2 border-white/10 text-white placeholder-[#6B6B80] focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all disabled:opacity-50"
        />
      </div>

      {/* Error message */}
      {state.error && (
        <div id="error-message" role="alert" className="text-[#EF4444] text-sm">
          {state.error}
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
            Sending...
          </span>
        ) : (
          'Send Reset Link'
        )}
      </button>

      {/* Link to sign in */}
      <p className="text-center text-[#A0A0B8]">
        Remember your password?{' '}
        <Link href="/sign-in" className="text-[#FF6B35] hover:text-[#FF8F5E] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
