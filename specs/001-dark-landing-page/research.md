# Research: Dark Mode Landing Page

**Feature Branch**: `001-dark-landing-page`
**Date**: 2025-12-22

## Research Areas

This document consolidates research findings for implementing the dark mode landing page with animations, dark theme color palette, and app mockup placeholder.

---

## 1. Scroll Animations with TailwindCSS 4.x

### Decision: Intersection Observer + Tailwind Keyframes

**Rationale**: Native browser API with custom Tailwind animations provides optimal performance without external dependencies.

**Alternatives Considered**:
- CSS-only animations: Rejected - limited viewport detection without JavaScript
- Framer Motion: Rejected - adds 25KB+ bundle size for simple fade effects
- tailwindcss-animate plugin: Rejected - adds complexity for MVP needs

### Implementation Approach

**1. Custom Keyframes in Tailwind config:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards'
      }
    }
  }
}
```

**2. Client Hook for Scroll Detection:**
```tsx
'use client'
import { useEffect, useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  return ref
}
```

**3. Motion Safety:**
- Use `motion-safe:` prefix for animations
- Use `motion-reduce:opacity-100` for immediate visibility

### Performance Considerations

- Restrict to GPU-accelerated properties: `transform`, `opacity`
- Animation duration: 200-600ms for optimal responsiveness
- Stagger animations when multiple elements enter simultaneously
- Trigger once and unobserve to prevent re-animations

---

## 2. Dark Mode Color Palette

### Decision: Slate Scale + Orange-500 Accent

**Rationale**: Tailwind's slate scale provides WCAG 2.1 AA compliant contrast ratios. Orange-500 energizes the health/fitness theme while maintaining accessibility.

**Alternatives Considered**:
- Pure black (#000000): Rejected - too harsh, causes eye strain
- Gray scale: Rejected - less sophisticated than slate
- Amber accent: Rejected - lower contrast ratio than orange

### Color Palette

| Role | Tailwind Class | Hex Value | Usage |
|------|---------------|-----------|-------|
| Background | `bg-slate-950` | `#020617` | Main page background |
| Surface | `bg-slate-900` | `#0f172a` | Cards, elevated elements |
| Surface Elevated | `bg-slate-800` | `#1e293b` | Hover states, subtle contrast |
| Border | `border-slate-700` | `#334155` | Dividers, card borders |
| Primary Text | `text-white` | `#ffffff` | Headlines, important text |
| Secondary Text | `text-slate-300` | `#cbd5e1` | Body text, descriptions |
| Muted Text | `text-slate-400` | `#94a3b8` | Labels, metadata |
| Accent | `text-orange-500` | `#f97316` | CTA buttons, highlights |
| Accent Hover | `bg-orange-600` | `#ea580c` | Button hover state |

### Contrast Ratios (Verified)

| Combination | Ratio | WCAG Level |
|-------------|-------|------------|
| White on slate-950 | ~19:1 | AAA ✓ |
| Slate-300 on slate-950 | ~11:1 | AAA ✓ |
| Orange-500 on slate-950 | ~6.4:1 | AA ✓ |
| Orange-400 on slate-950 | ~7.8:1 | AAA ✓ |

### CTA Button Style

```tsx
<button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
  지금 시작하기
</button>
```

---

## 3. App Mockup Placeholder

### Decision: CSS-Only Tailwind Device Frame

**Rationale**: Zero external dependencies, fast loading, seamless dark mode integration. Flowbite-style device frame provides realistic phone appearance.

**Alternatives Considered**:
- External image asset: Rejected - adds HTTP request, harder to theme
- Inline SVG: Rejected - more complex for simple use case
- Placeholder gradient only: Rejected - less professional appearance

### Implementation

```tsx
// PhoneMockup.tsx
export function PhoneMockup() {
  return (
    <div className="relative mx-auto border-slate-800 bg-slate-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      {/* Side buttons */}
      <div className="h-[32px] w-[3px] bg-slate-800 absolute -start-[17px] top-[72px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-slate-800 absolute -start-[17px] top-[124px] rounded-s-lg" />
      <div className="h-[46px] w-[3px] bg-slate-800 absolute -start-[17px] top-[178px] rounded-s-lg" />
      <div className="h-[64px] w-[3px] bg-slate-800 absolute -end-[17px] top-[142px] rounded-e-lg" />
      
      {/* Screen with app preview */}
      <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-gradient-to-br from-slate-900 to-slate-950">
        {/* Simplified app UI mockup */}
        <div className="p-6 pt-12 space-y-4">
          {/* Status bar placeholder */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-2 w-12 bg-slate-700 rounded" />
            <div className="h-2 w-16 bg-slate-700 rounded" />
          </div>
          
          {/* Camera capture area */}
          <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full" />
            </div>
          </div>
          
          {/* Nutrition result card */}
          <div className="bg-slate-800/50 rounded-2xl p-4 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4" />
            <div className="h-6 bg-orange-500/30 rounded w-full" />
            <div className="flex gap-2">
              <div className="h-3 bg-slate-700 rounded w-1/4" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### Sizing Notes

- Desktop: Full size (300x600px)
- Tablet: Scale to 80% (240x480px)
- Mobile: Scale to 70% or hide mockup, show simplified illustration

---

## Sources

### Animations
- [Building Scroll-Triggered Animations in Tailwind CSS](https://dev.to/hexshift/building-scroll-triggered-animations-in-tailwind-css-without-external-libraries-jf7)
- [Tailwind CSS Animation Documentation](https://tailwindcss.com/docs/animation)
- [Motion Safe/Reduce Modifiers](https://www.epicweb.dev/tips/motion-safe-and-motion-reduce-modifiers)

### Colors
- [Dark Mode Color Palettes Guide 2025](https://mypalettetool.com/blog/dark-mode-color-palettes)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Colors](https://tailwindcss.com/docs/colors)

### Device Mockups
- [Flowbite Device Mockups](https://flowbite.com/docs/components/device-mockups/)
- [DaisyUI Phone Mockup](https://daisyui.com/components/mockup-phone/)
