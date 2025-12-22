import { ReactNode } from "react";

export interface StepIndicatorProps {
  stepNumber: 1 | 2 | 3;
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function StepIndicator({
  stepNumber,
  title,
  description,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white font-bold text-xl mb-4">
        {stepNumber}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
        {description}
      </p>
    </div>
  );
}
