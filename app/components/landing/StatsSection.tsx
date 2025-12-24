"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

const stats = [
  {
    value: "32K+",
    label: "Active Users",
    description: "Growing community of fitness enthusiasts",
  },
  {
    value: "1M+",
    label: "Meals Logged",
    description: "Photos analyzed with AI precision",
  },
  {
    value: "99%",
    label: "Accuracy Rate",
    description: "Industry-leading nutrition detection",
  },
  {
    value: "4.9",
    label: "App Rating",
    description: "Loved by users worldwide",
  },
];

export function StatsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      ref={ref}
      id="stats"
      className="py-24 px-8 relative overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse,rgba(255,51,102,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className={`inline-block badge mb-6 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
          >
            <span>STATS</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "100ms" }}
          >
            Trusted by <span className="text-gradient">Thousands</span>
          </h2>
          <p
            className={`text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            Join the growing community of health-conscious individuals who trust
            Cal AI for their nutrition tracking needs.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${
                isVisible
                  ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              {/* Stat Card */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 hover:border-[var(--color-border-primary)] transition-all duration-300 hover:-translate-y-2">
                {/* Value */}
                <div className="text-stat text-5xl mb-2">{stat.value}</div>

                {/* Label */}
                <div className="text-lg font-bold text-white mb-2">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
