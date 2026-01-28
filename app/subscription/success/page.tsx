'use client';

import Link from 'next/link';

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col items-center justify-center p-4 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#22C55E]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full bg-gradient-to-br from-[#252541] to-[#0F0F1A] rounded-3xl border border-white/5 p-8 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#22C55E]" />

        <div className="w-20 h-20 bg-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1
          className="text-3xl font-extrabold mb-2"
          style={{
            background: 'linear-gradient(to right, #FF6B35, #F7C94B, #FF3366)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome to Pro!
        </h1>
        <p className="text-[#A0A0B8] mb-8">
          Your subscription has been successfully activated.
        </p>

        <Link
          href="/"
          className="block w-full py-4 px-6 bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wider rounded-full transition-all shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
