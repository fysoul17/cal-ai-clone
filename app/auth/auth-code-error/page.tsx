import Link from 'next/link';

export const metadata = {
  title: 'Authentication Error | Cal AI',
  description: 'An error occurred during authentication.',
};

export default function AuthCodeErrorPage() {
  // Note: We intentionally don't expose detailed error info to users for security

  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4 py-8">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-[#FF3366]/15 rounded-full blur-3xl" />
      </div>

      {/* Error card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-center">
          {/* Error icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-2xl font-black text-white mb-2">Authentication Error</h1>
          <p className="text-[#A0A0B8] mb-8">
            Something went wrong during authentication. This could happen if:
          </p>

          <ul className="text-left text-[#A0A0B8] text-sm mb-8 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-[#FF6B35]">•</span>
              <span>The sign-in link has expired</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6B35]">•</span>
              <span>You cancelled the authentication process</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6B35]">•</span>
              <span>There was a temporary connection issue</span>
            </li>
          </ul>

          <div className="space-y-3">
            <Link
              href="/sign-in"
              className="block w-full px-6 py-4 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block text-[#A0A0B8] hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
