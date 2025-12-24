import { Header } from "./components/landing/Header";
import { HeroSection } from "./components/landing/HeroSection";
import { FeaturesSection } from "./components/landing/FeaturesSection";
import { HowItWorksSection } from "./components/landing/HowItWorksSection";
import { StatsSection } from "./components/landing/StatsSection";
import { Footer } from "./components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-dark)]">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
}
