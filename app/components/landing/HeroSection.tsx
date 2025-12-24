"use client";

import Link from "next/link";

export interface HeroSectionProps {
  headline?: string;
  subtext?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const macroCards = [
  { icon: "🔥", value: "1,850", label: "Calories", color: "#FFFFFF" },
  { icon: "🥩", value: "142g", label: "Protein", color: "#FF6B35" },
  { icon: "🍚", value: "185g", label: "Carbs", color: "#F7C94B" },
  { icon: "🥑", value: "62g", label: "Fat", color: "#FF3366" },
];

export function HeroSection({
  headline = "SNAP. ANALYZE. CONQUER.",
  subtext = "The smartest way to track your nutrition. Take a photo of your meal and let AI do the rest. Accurate macros in seconds.",
  ctaLabel = "START FREE TRIAL",
  ctaHref = "/signup",
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-20 px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="bg-pattern" />

      {/* Floating Macro Cards - Left Side */}
      <div className="absolute left-[5%] top-1/3 hidden xl:flex flex-col gap-4 z-10">
        {macroCards.slice(0, 2).map((card, index) => (
          <div
            key={card.label}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 min-w-[120px] text-center"
            style={{
              animation: `float 6s ease-in-out infinite`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="font-bold text-lg" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Macro Cards - Right Side */}
      <div className="absolute right-[5%] top-1/3 hidden xl:flex flex-col gap-4 z-10">
        {macroCards.slice(2, 4).map((card, index) => (
          <div
            key={card.label}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-4 min-w-[120px] text-center"
            style={{
              animation: `float 6s ease-in-out infinite`,
              animationDelay: `${(index + 2) * 0.5}s`,
            }}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="font-bold text-lg" style={{ color: card.color }}>
              {card.value}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="badge mb-8 motion-safe:animate-fadeInUp motion-reduce:opacity-100">
          <span>AI-POWERED</span>
          <span className="text-[var(--color-secondary)]">NUTRITION TRACKING</span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-black leading-[1.1] mb-6 uppercase tracking-tight motion-safe:animate-fadeInUp motion-reduce:opacity-100"
          style={{ animationDelay: "100ms" }}
        >
          <span className="text-white">SNAP. </span>
          <span className="text-gradient">ANALYZE. </span>
          <span className="text-white">CONQUER.</span>
        </h1>

        {/* Subtext */}
        <p
          className="text-lg sm:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed motion-safe:animate-fadeInUp motion-reduce:opacity-100"
          style={{ animationDelay: "200ms" }}
        >
          {subtext}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 motion-safe:animate-fadeInUp motion-reduce:opacity-100"
          style={{ animationDelay: "300ms" }}
        >
          <Link href={ctaHref} className="btn-primary text-base py-4 px-10">
            {ctaLabel}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link href="#how-it-works" className="btn-ghost">
            SEE HOW IT WORKS
          </Link>
        </div>

        {/* Phone Mockup Preview */}
        <div
          className="relative max-w-xs mx-auto motion-safe:animate-fadeInUp motion-reduce:opacity-100"
          style={{ animationDelay: "400ms" }}
        >
          <div className="bg-gradient-surface rounded-[var(--radius-3xl)] p-4 shadow-xl">
            {/* Phone Frame */}
            <div className="bg-[var(--color-bg-darker)] rounded-[28px] overflow-hidden">
              {/* Status Bar */}
              <div className="h-8 bg-[var(--color-surface)] flex items-center justify-center">
                <div className="w-20 h-5 bg-black rounded-full" />
              </div>

              {/* App Content Preview */}
              <div className="p-4 min-h-[280px]">
                {/* Daily Summary */}
                <div className="text-center mb-6">
                  <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">
                    Today&apos;s Progress
                  </div>
                  <div className="text-stat text-4xl">1,850</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    / 2,200 kcal
                  </div>
                </div>

                {/* Macro Pills */}
                <div className="flex justify-center gap-2 mb-6">
                  <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] px-3 py-2 text-center flex-1">
                    <div className="text-xs text-[var(--color-primary)] font-bold">142g</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">Protein</div>
                  </div>
                  <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] px-3 py-2 text-center flex-1">
                    <div className="text-xs text-[var(--color-secondary)] font-bold">185g</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">Carbs</div>
                  </div>
                  <div className="bg-[var(--color-surface)] rounded-[var(--radius-md)] px-3 py-2 text-center flex-1">
                    <div className="text-xs text-[var(--color-accent)] font-bold">62g</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">Fat</div>
                  </div>
                </div>

                {/* Add Food Button */}
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-full -z-10" />
        </div>

        {/* Trust Indicators */}
        <div
          className="flex items-center justify-center gap-8 mt-12 motion-safe:animate-fadeInUp motion-reduce:opacity-100"
          style={{ animationDelay: "500ms" }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">32K+</div>
            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Active Users</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border-light)]" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">1M+</div>
            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">Meals Logged</div>
          </div>
          <div className="w-px h-10 bg-[var(--color-border-light)]" />
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4.9</div>
            <div className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wider">App Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
