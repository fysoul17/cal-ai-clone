"use client";

import { FeatureCard } from "./FeatureCard";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

const features = [
  {
    icon: "📸",
    title: "Instant Photo Recognition",
    description:
      "Just snap a photo of your meal. Our AI instantly identifies the food items and calculates accurate nutritional information in seconds.",
  },
  {
    icon: "🎯",
    title: "Precise Macro Tracking",
    description:
      "Get detailed breakdowns of calories, protein, carbs, and fat. Set personalized goals and track your progress effortlessly.",
  },
  {
    icon: "💪",
    title: "Fitness Integration",
    description:
      "Sync with your workout routine. Whether you're bulking, cutting, or maintaining, Cal AI adapts to your fitness goals.",
  },
  {
    icon: "📊",
    title: "Smart Analytics",
    description:
      "Visualize your nutrition trends with beautiful charts. Understand your eating patterns and make data-driven decisions.",
  },
  {
    icon: "🔥",
    title: "Daily Calorie Goals",
    description:
      "Set and track your daily calorie targets. Get real-time updates on your remaining calories and macro budgets.",
  },
  {
    icon: "🏆",
    title: "Achievement System",
    description:
      "Stay motivated with streaks, badges, and milestones. Celebrate your progress and build healthy habits that last.",
  },
];

export function FeaturesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      ref={ref}
      id="features"
      className="py-24 px-8 relative"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(255,107,53,0.08)_0%,transparent_70%)] pointer-events-none" />

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
            <span>FEATURES</span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "100ms" }}
          >
            Everything You Need to{" "}
            <span className="text-gradient">Fuel Your Gains</span>
          </h2>
          <p
            className={`text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "200ms" }}
          >
            Powerful tools designed to simplify nutrition tracking and help you
            achieve your health goals faster.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={
                isVisible
                  ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                  : "opacity-0"
              }
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
