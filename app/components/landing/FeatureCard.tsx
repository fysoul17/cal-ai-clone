import { ReactNode } from "react";

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`bg-slate-800/50 border border-slate-700 rounded-2xl p-6 ${className}`}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
