'use client';

import { MealEntry as MealEntryType } from '@/app/types/meal';

interface MealEntryProps {
  meal: MealEntryType;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const mealTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  Breakfast: {
    bg: 'bg-[#F7C94B]/20',
    text: 'text-[#F7C94B]',
    border: 'border-[#F7C94B]/30',
  },
  Lunch: {
    bg: 'bg-[#22C55E]/20',
    text: 'text-[#22C55E]',
    border: 'border-[#22C55E]/30',
  },
  Dinner: {
    bg: 'bg-[#3B82F6]/20',
    text: 'text-[#3B82F6]',
    border: 'border-[#3B82F6]/30',
  },
  Snack: {
    bg: 'bg-[#FF6B35]/20',
    text: 'text-[#FF6B35]',
    border: 'border-[#FF6B35]/30',
  },
};

export default function MealEntry({ meal }: MealEntryProps) {
  const colors = meal.mealType ? mealTypeColors[meal.mealType] : null;

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 hover:border-[#FF6B35]/30 transition-all duration-300">
      <div className="flex-shrink-0 w-16 text-center">
        <span className="text-sm font-semibold text-[#A0A0B8]">
          {formatTime(meal.timestamp)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold truncate">{meal.name}</h3>
        {colors && meal.mealType && (
          <span
            className={`inline-flex items-center px-2 py-0.5 mt-1 text-xs font-semibold rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}
          >
            {meal.mealType}
          </span>
        )}
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="text-lg font-bold text-white">
          {meal.calories}
        </span>
        <span className="text-[#A0A0B8] text-sm ml-1">cal</span>
      </div>
    </div>
  );
}
