'use client';

interface AnalysisStatusProps {
  status: 'idle' | 'ready' | 'analyzing' | 'success' | 'error';
  errorMessage?: string;
  retryCount: number;
  onRetry: () => void;
  onManualEntry: () => void;
}

const MAX_RETRIES = 3;

export default function AnalysisStatus({
  status,
  errorMessage,
  retryCount,
  onRetry,
  onManualEntry,
}: AnalysisStatusProps) {
  // Don't render anything for idle, ready, or success states
  if (status === 'idle' || status === 'ready' || status === 'success') {
    return null;
  }

  // T019 & T020: Loading spinner and status text during analysis
  if (status === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center py-8 animate-[fadeInUp_0.3s_ease-out]">
        {/* Loading spinner with gradient */}
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-[#252541]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF6B35] border-r-[#FF3366] animate-spin" />
        </div>

        {/* T020: Status text */}
        <p className="text-white font-semibold text-lg mb-2">
          Analyzing your meal...
        </p>

        {/* T024: Retry count indicator (shown during retry) */}
        {retryCount > 0 && (
          <p className="text-[#A0A0B8] text-sm">
            Retry {retryCount} of {MAX_RETRIES}
          </p>
        )}
      </div>
    );
  }

  // T021, T022, T023: Error state display
  if (status === 'error') {
    const hasRetriesLeft = retryCount < MAX_RETRIES;

    return (
      <div className="flex flex-col items-center justify-center py-8 animate-[fadeInUp_0.3s_ease-out]">
        {/* Error icon */}
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-[#EF4444]/20 border border-[#EF4444]/30">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* T021: Error message */}
        <p className="text-[#EF4444] font-semibold text-lg mb-2 text-center">
          Analysis Failed
        </p>

        <p className="text-[#A0A0B8] text-sm mb-6 text-center max-w-xs">
          {errorMessage || 'Something went wrong. Please try again.'}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* T022: Retry button (hidden after 3 retries) */}
          {hasRetriesLeft && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Try Again
            </button>
          )}

          {/* T023: "Enter manually" link (shown after 3 failed retries or always as secondary option) */}
          <button
            type="button"
            onClick={onManualEntry}
            className={`w-full px-6 py-3 rounded-full border-2 text-white font-bold uppercase tracking-wide transition-all duration-300 ${
              hasRetriesLeft
                ? 'border-white/20 hover:border-[#FF6B35] hover:text-[#FF6B35]'
                : 'border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white'
            }`}
          >
            Enter Manually Instead
          </button>
        </div>

        {/* T024: Retry count indicator */}
        <p className="text-[#6B6B80] text-xs mt-4">
          {hasRetriesLeft
            ? `${MAX_RETRIES - retryCount} ${MAX_RETRIES - retryCount === 1 ? 'retry' : 'retries'} remaining`
            : 'Maximum retries reached'}
        </p>
      </div>
    );
  }

  return null;
}
