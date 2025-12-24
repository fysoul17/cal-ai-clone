"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    icon: "📷",
    title: "Snap a Photo",
    description:
      "Take a quick photo of your meal using your phone camera or upload an existing image from your gallery.",
  },
  {
    number: "02",
    icon: "🤖",
    title: "AI Analysis",
    description:
      "Our advanced AI instantly analyzes your food, identifying ingredients and calculating accurate nutritional values.",
  },
  {
    number: "03",
    icon: "✅",
    title: "Review & Save",
    description:
      "Confirm the analysis, make any adjustments if needed, and save to your daily log. That's it!",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="py-24 px-8 bg-[var(--color-bg-darker)] relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-20" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-20" />

      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div
            className={`inline-block badge mb-6 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
          >
            <span>HOW IT WORKS</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "100ms" }}
          >
            Track Nutrition in{" "}
            <span className="text-gradient">3 Simple Steps</span>
          </h2>
          <p
            className={`text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            No more manual entry or guesswork. Just snap, analyze, and conquer
            your nutrition goals.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] transform -translate-y-1/2 opacity-30" />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`relative ${
                  isVisible
                    ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${300 + index * 150}ms` }}
              >
                {/* Step Card */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] p-8 text-center relative z-10 hover:border-[var(--color-border-primary)] transition-colors duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-primary rounded-full text-white text-sm font-bold">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="text-6xl mb-6 mt-4">{step.icon}</div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (between cards on desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-bg-dark)] border border-[var(--color-border)] flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[var(--color-primary)]"
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
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
