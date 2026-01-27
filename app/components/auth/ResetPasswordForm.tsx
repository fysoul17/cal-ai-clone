'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface ResetPasswordFormProps {
  /** Callback on successful password update */
  onSuccess?: () => void;
}

interface ResetPasswordFormState {
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  error: string | null;
  isExpired: boolean;
}

const initialState: ResetPasswordFormState = {
  password: '',
  confirmPassword: '',
  isLoading: false,
  error: null,
  isExpired: false,
};

export default function ResetPasswordForm({ onSuccess }: ResetPasswordFormProps) {
  const [state, setState] = useState<ResetPasswordFormState>(initialState);
  const router = useRouter();

  // Check if user has valid reset session on mount
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      // If there's an error or no session with recovery event, the link may be expired
      if (error || !session) {
        // The session might be established during the page load from the hash
        // We'll handle this more gracefully during password update
      }
    };

    checkSession();
  }, []);

  // Validate password
  const validatePassword = (password: string): string | null => {
    if (!password) return 'Please enter a new password';
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
    setState(prev => ({ ...prev, error: null }));

    // Client-side validation
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
      const { error } = await supabase.auth.updateUser({
        password: state.password,
      });

      if (error) {
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            isExpired: true,
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
            error: 'Failed to update password. Please try again.',
          }));
        }
        return;
      }

      // Success - redirect to sign in
      onSuccess?.();
      router.push('/sign-in?reset=success');
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred. Please try again.',
      }));
    }
  };

  const handleInputChange = (field: 'password' | 'confirmPassword') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState(prev => ({
      ...prev,
      [field]: e.target.value,
      error: null,
    }));
  };

  // If the link is expired, show error with option to request new link
  if (state.isExpired) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Link Expired</h2>
        <p className="text-[#A0A0B8] mb-6">
          This password reset link has expired or is invalid. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-[#A0A0B8] text-center mb-4">
        Enter your new password below.
      </p>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[#A0A0B8] mb-2">
          New Password
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
          Confirm New Password
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
            Updating...
          </span>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );
}
