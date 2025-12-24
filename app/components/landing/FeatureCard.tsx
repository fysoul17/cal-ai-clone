export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card group">
      {/* Icon */}
      <div className="text-5xl mb-6">{icon}</div>

      {/* Content */}
      <h3 className="text-[1.375rem] font-bold text-white mb-3">{title}</h3>
      <p className="text-[var(--color-text-secondary)] leading-relaxed">
        {description}
      </p>

      {/* Arrow Indicator */}
      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[var(--color-bg-darker)] flex items-center justify-center text-[var(--color-text-tertiary)] group-hover:text-[var(--color-primary)] group-hover:bg-[rgba(255,107,53,0.1)] transition-all duration-300">
        <svg
          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  );
}
