"use client";

import { StepIndicator } from "./StepIndicator";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

const steps: Array<{ stepNumber: 1 | 2 | 3; title: string; description: string }> = [
  {
    stepNumber: 1,
    title: "사진 촬영",
    description: "음식 사진을 찍거나 갤러리에서 선택하세요.",
  },
  {
    stepNumber: 2,
    title: "AI 분석",
    description: "AI가 음식을 인식하고 영양 정보를 분석합니다.",
  },
  {
    stepNumber: 3,
    title: "결과 저장",
    description: "분석 결과를 확인하고 일일 기록에 저장하세요.",
  },
];

export function HowItWorksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white mb-4 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
          >
            이용 방법
          </h2>
          <p
            className={`text-slate-300 text-lg max-w-2xl mx-auto ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
            style={{ animationDelay: "100ms" }}
          >
            3단계로 간편하게 시작하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div
              key={step.stepNumber}
              className={
                isVisible
                  ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                  : "opacity-0"
              }
              style={{ animationDelay: `${200 + index * 150}ms` }}
            >
              <StepIndicator
                stepNumber={step.stepNumber}
                title={step.title}
                description={step.description}
              />
            </div>
          ))}
        </div>

        {/* Connection lines for desktop */}
        <div className="hidden md:block relative -mt-40 mb-20">
          <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-500/50 via-amber-500/50 to-orange-500/50 -z-10" />
        </div>
      </div>
    </section>
  );
}
