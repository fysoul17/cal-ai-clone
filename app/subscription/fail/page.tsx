'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FailContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <div className="max-w-md w-full bg-gradient-to-br from-[#252541] to-[#0F0F1A] rounded-3xl border border-white/5 p-8 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#EF4444]" />

      <div className="w-20 h-20 bg-[#EF4444]/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>

      <h1 className="text-3xl font-extrabold mb-2 text-white">Payment Failed</h1>
      <p className="text-[#A0A0B8] mb-2">
        We couldn&apos;t process your subscription.
      </p>

      {message && (
        <div className="bg-[#EF4444]/10 text-[#EF4444] text-sm p-3 rounded-xl mb-8 font-mono border border-[#EF4444]/20">
          [{code}] {message}
        </div>
      )}

      <div className="flex gap-4">
        <Link
          href="/subscription"
          className="flex-1 py-3 px-6 bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wider rounded-full transition-all shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5"
        >
          Try Again
        </Link>
        <Link
          href="/"
          className="flex-1 py-3 px-6 bg-transparent text-white font-bold uppercase tracking-wider rounded-full border-2 border-white/20 transition-all hover:border-[#FF6B35] hover:text-[#FF6B35]"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}

export default function SubscriptionFailPage() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex flex-col items-center justify-center p-4 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#EF4444]/10 rounded-full blur-3xl" />
      </div>

      <Suspense fallback={<div className="text-[#A0A0B8]">Loading...</div>}>
        <FailContent />
      </Suspense>
    </div>
  );
}
