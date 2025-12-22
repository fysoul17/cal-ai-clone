"use client";

import { CTAButton } from "./CTAButton";
import { PhoneMockup } from "./PhoneMockup";

export interface HeroSectionProps {
  headline: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
}

export function HeroSection({
  headline,
  subtext,
  ctaLabel,
  ctaHref,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 motion-safe:animate-fadeInUp motion-reduce:opacity-100">
              {headline}
            </h1>
            <p
              className="text-lg sm:text-xl text-slate-300 mb-8 max-w-lg mx-auto lg:mx-0 motion-safe:animate-fadeInUp motion-reduce:opacity-100"
              style={{ animationDelay: "150ms" }}
            >
              {subtext}
            </p>
            <div
              className="motion-safe:animate-fadeInUp motion-reduce:opacity-100"
              style={{ animationDelay: "300ms" }}
            >
              <CTAButton
                label={ctaLabel}
                href={ctaHref}
                variant="primary"
                size="lg"
              />
            </div>
          </div>

          {/* Phone Mockup */}
          <div
            className="order-1 lg:order-2 flex justify-center motion-safe:animate-fadeInUp motion-reduce:opacity-100"
            style={{ animationDelay: "200ms" }}
          >
            <PhoneMockup className="scale-75 sm:scale-90 lg:scale-100" />
          </div>
        </div>
      </div>

      {/* Background gradient decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
