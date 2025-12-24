'use client';

import { MealEntry as MealEntryType } from '@/app/types/meal';
import MealEntry from './MealEntry';
import EmptyState from './EmptyState';

interface MealTimelineProps {
  meals: MealEntryType[];
  onAddClick: () => void;
}

export default function MealTimeline({ meals, onAddClick }: MealTimelineProps) {
  if (meals.length === 0) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-6">
        <EmptyState onAddClick={onAddClick} />
      </div>
    );
  }

  const sortedMeals = [...meals].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Today&apos;s Meals</h2>
        <span className="text-[#A0A0B8] text-sm">
          {meals.length} {meals.length === 1 ? 'meal' : 'meals'}
        </span>
      </div>

      <div className="space-y-3">
        {sortedMeals.map((meal) => (
          <MealEntry key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
}
