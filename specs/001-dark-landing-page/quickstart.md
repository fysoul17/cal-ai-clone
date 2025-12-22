# Quickstart: Dark Mode Landing Page

**Feature Branch**: `001-dark-landing-page`
**Date**: 2025-12-22

## Prerequisites

- Node.js 18+
- pnpm/npm/yarn
- Git

## Setup

```bash
# Clone and checkout feature branch
git checkout 001-dark-landing-page

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 to view the landing page.

## Project Structure

```
app/
├── page.tsx                    # Landing page (main entry)
├── layout.tsx                  # Root layout (metadata, fonts)
├── globals.css                 # TailwindCSS imports, custom animations
└── components/
    └── landing/
        ├── Header.tsx          # Fixed navigation bar
        ├── HeroSection.tsx     # Hero with headline + mockup
        ├── FeaturesSection.tsx # Feature cards grid
        ├── HowItWorksSection.tsx # 3-step process
        ├── Footer.tsx          # Final CTA + copyright
        ├── CTAButton.tsx       # Reusable CTA button
        ├── FeatureCard.tsx     # Single feature card
        ├── StepIndicator.tsx   # Single step item
        └── PhoneMockup.tsx     # CSS-only phone device frame
```

## Key Files

| File | Purpose |
|------|---------|
| `app/page.tsx` | Assembles all landing page sections |
| `app/globals.css` | Custom animation keyframes |
| `app/components/landing/HeroSection.tsx` | Core value proposition display |
| `app/components/landing/CTAButton.tsx` | Primary conversion element |

## Development Workflow

### 1. Start with Hero Section
```bash
# Create component file
touch app/components/landing/HeroSection.tsx

# Test in browser
npm run dev
```

### 2. Add Animations
Custom keyframes are defined in `globals.css`:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. Test Responsiveness
Use browser DevTools to test:
- Mobile: 320px, 375px, 428px
- Tablet: 768px
- Desktop: 1024px, 1440px, 1920px

### 4. Test Accessibility
```bash
# Run Lighthouse audit
# Chrome DevTools > Lighthouse > Accessibility

# Test reduced motion
# Chrome DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion
```

## Component Usage Examples

### CTA Button
```tsx
import { CTAButton } from '@/app/components/landing/CTAButton'

<CTAButton 
  label="지금 시작하기" 
  href="/signup" 
  variant="primary" 
  size="lg" 
/>
```

### Feature Card
```tsx
import { FeatureCard } from '@/app/components/landing/FeatureCard'
import { Camera } from 'lucide-react'

<FeatureCard
  icon={<Camera className="w-8 h-8" />}
  title="AI 음식 분석"
  description="사진 한 장으로 음식을 인식하고 영양 정보를 자동으로 분석합니다."
/>
```

## Common Issues

### Animation Not Triggering
- Ensure element has initial `opacity-0` class
- Check IntersectionObserver threshold (should be 0.1)
- Verify `motion-safe:` prefix is applied

### Colors Not Appearing
- TailwindCSS 4.x uses CSS variables - check `globals.css` imports
- Ensure classes use slate scale (e.g., `bg-slate-950`)

### CTA Links Not Working
- `/login` and `/signup` routes are NOT part of this feature
- Links will show 404 until authentication feature is implemented

## Build & Verify

```bash
# Type check
npm run build

# Preview production build
npm run start

# Lint
npm run lint
```

## Success Criteria Checklist

- [x] Hero section loads with fade-in animation
- [x] All text is readable (WCAG AA contrast)
- [x] CTA buttons have hover states
- [x] Page is responsive 320px to 1920px
- [x] Animations respect `prefers-reduced-motion`
- [x] No console errors
- [x] Build completes without errors
