'use client';

interface AuthFormWrapperProps {
  /** Form title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Form content */
  children: React.ReactNode;
}

/**
 * Provides consistent styling for auth pages
 * - Centered card layout
 * - Design system styles (gradient background, card surface)
 * - Responsive width (max-w-md on desktop)
 */
export default function AuthFormWrapper({
  title,
  subtitle,
  children,
}: AuthFormWrapperProps) {
  return (
    <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4 py-8">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/5 w-96 h-96 bg-[#FF3366]/15 rounded-full blur-3xl" />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">{title}</h1>
            {subtitle && (
              <p className="text-[#A0A0B8]">{subtitle}</p>
            )}
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>
    </div>
  );
}
