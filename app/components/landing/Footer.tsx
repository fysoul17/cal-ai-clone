"use client";

import { CTAButton } from "./CTAButton";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

export interface FooterProps {
  showCTA?: boolean;
  ctaHeadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  copyright?: string;
}

export function Footer({
  showCTA = true,
  ctaHeadline = "지금 바로 시작하세요",
  ctaLabel = "무료로 시작하기",
  ctaHref = "/signup",
  copyright = "© 2025 Cal AI. All rights reserved.",
}: FooterProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>();

  return (
    <footer ref={ref} className="py-20 px-4 sm:px-6 lg:px-8">
      {showCTA && (
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div
            className={`bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 sm:p-12 border border-slate-700 ${
              isVisible
                ? "motion-safe:animate-fadeInUp motion-reduce:opacity-100"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {ctaHeadline}
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
              AI 기반 칼로리 추적으로 건강한 식단 관리를 시작하세요.
            </p>
            <CTAButton
              label={ctaLabel}
              href={ctaHref}
              variant="primary"
              size="lg"
            />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">C</span>
              </div>
              <span className="text-sm font-semibold text-white">Cal AI</span>
            </div>

            {/* Copyright */}
            <p className="text-slate-400 text-sm">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
