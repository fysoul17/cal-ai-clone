import { CTAButton } from "./CTAButton";

export interface HeaderProps {
  showCTA?: boolean;
}

export function Header({ showCTA = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-white">Cal AI</span>
          </div>

          {/* CTA Button */}
          {showCTA && (
            <CTAButton
              label="시작하기"
              href="/login"
              variant="primary"
              size="sm"
            />
          )}
        </div>
      </div>
    </header>
  );
}
