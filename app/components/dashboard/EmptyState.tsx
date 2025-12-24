'use client';

interface EmptyStateProps {
  onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-5xl mb-4">🍽️</span>
      <h3 className="text-xl font-bold text-white mb-2">
        Ready to track your first meal?
      </h3>
      <p className="text-[#A0A0B8] mb-6 max-w-xs">
        Start logging your meals to track your daily calorie intake.
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF6B35] to-[#FF3366] text-white font-bold uppercase tracking-wide rounded-full shadow-[0_8px_32px_rgba(255,107,53,0.4)] hover:shadow-[0_12px_40px_rgba(255,107,53,0.5)] hover:-translate-y-0.5 transition-all duration-300"
      >
        Add Food
      </button>
    </div>
  );
}
