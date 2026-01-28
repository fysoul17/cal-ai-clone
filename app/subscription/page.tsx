'use client';

import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        throw new Error('Client Key is not set');
      }

      const tossPayments = await loadTossPayments(clientKey);

      // Customer Key must be unique for each user (or consistent for the same user)
      // Ideally, pass the real user ID or a consistent hash.
      // For this demo, we generate a random one, effectively treating every session as a new "card registration".
      // In production, use: `user.id` or similar.
      const customerKey = uuidv4();

      await tossPayments.requestBillingAuth('CARD', {
        customerKey,
        successUrl: window.location.origin + '/api/billing/confirm',
        failUrl: window.location.origin + '/subscription/fail',
      });

    } catch {
      setError('Failed to open payment window. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col items-center justify-center p-4 font-sans relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B35]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF3366]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-gradient-to-br from-[#252541] to-[#0F0F1A] rounded-3xl border border-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#F7C94B] to-[#FF3366]" />

        <h1
          className="text-3xl font-extrabold text-center mb-2"
          style={{
            background: 'linear-gradient(to right, #FF6B35, #F7C94B, #FF3366)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Pro Plan
        </h1>
        <p className="text-[#A0A0B8] text-center mb-8">
          Unlock the full potential of your daily nutrition tracking.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-white">Unlimited AI Food Analysis</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-white">Weekly Progress Reports</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-white">Priority Support</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <span
            className="text-5xl font-black"
            style={{
              background: 'linear-gradient(to right, #FF6B35, #F7C94B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ₩9,900
          </span>
          <span className="text-[#6B6B80]"> / month</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={subscribe}
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wider rounded-full transition-all shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>

        <p className="mt-4 text-xs text-center text-[#6B6B80]">
          Secure payment via TossPayments. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
