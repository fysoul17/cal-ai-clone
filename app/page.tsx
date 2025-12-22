import { Header } from "./components/landing/Header";
import { HeroSection } from "./components/landing/HeroSection";
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { HowItWorksSection } from "./components/landing/HowItWorksSection";
import { Footer } from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main>
        <HeroSection
          headline="사진 한 장으로 칼로리 추적"
          subtext="AI가 음식을 인식하고 영양 정보를 자동으로 분석합니다. 간편하게 건강한 식단을 관리하세요."
          ctaLabel="지금 시작하기"
          ctaHref="/signup"
        />
        <FeaturesSection />
        <HowItWorksSection />
        <Footer />
      </main>
    </div>
  );
}
