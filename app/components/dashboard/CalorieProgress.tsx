'use client';

interface CalorieProgressProps {
  consumed: number;
  target: number;
}

export default function CalorieProgress({ consumed, target }: CalorieProgressProps) {
  const percentage = Math.round((consumed / target) * 100);
  const isOverLimit = consumed > target;
  const remaining = target - consumed;
  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#252541] to-[#0F0F1A] border border-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Daily Progress</h2>
        <span className="text-2xl font-black text-white">
          {percentage}%
        </span>
      </div>

      <div className="mb-4">
        <div className="h-3 rounded-full bg-[#0F0F1A] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverLimit
                ? 'bg-gradient-to-r from-[#F7C94B] to-[#FF6B35]'
                : 'bg-gradient-to-r from-[#FF6B35] to-[#FF3366]'
            }`}
            style={{ width: `${displayPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[#A0A0B8]">
          <span className="text-white font-bold">{consumed.toLocaleString()}</span>
          {' / '}
          {target.toLocaleString()} cal
        </span>
        <span className={`font-semibold ${isOverLimit ? 'text-[#F7C94B]' : 'text-[#22C55E]'}`}>
          {isOverLimit
            ? `Over by ${Math.abs(remaining).toLocaleString()} cal`
            : `${remaining.toLocaleString()} cal remaining`}
        </span>
      </div>
    </div>
  );
}
