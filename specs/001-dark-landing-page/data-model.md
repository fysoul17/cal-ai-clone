# Data Model: Dark Mode Landing Page

**Feature Branch**: `001-dark-landing-page`
**Date**: 2025-12-22

## Overview

This landing page is a static frontend feature with no database persistence. This document defines the UI component entities, their properties, and relationships as specified in the feature spec.

---

## Entities

### 1. Landing Page Section

**Description**: Independent regions composing the page structure.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| id | string | Yes | Unique section identifier (anchor target) |
| title | string | No | Section heading (if applicable) |
| backgroundColor | string | Yes | Tailwind background class |
| padding | string | Yes | Vertical padding specification |
| maxWidth | string | Yes | Container max-width constraint |

**Sections** (ordered top-to-bottom):
1. Header (fixed navigation)
2. Hero
3. Features
4. HowItWorks
5. Footer (includes final CTA)

**Validation**: Each section must have semantic HTML structure (`<section>`, `<header>`, `<footer>`).

---

### 2. Call-to-Action (CTA)

**Description**: Conversion elements guiding users to signup/login.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| label | string | Yes | Button text (e.g., "지금 시작하기") |
| href | string | Yes | Target URL (e.g., "/login", "/signup") |
| variant | enum | Yes | "primary" (filled) or "secondary" (outline) |
| size | enum | No | "sm", "md" (default), "lg" |

**Primary CTA Style**:
- Background: `bg-orange-500`
- Hover: `bg-orange-600`
- Text: `text-white font-semibold`
- Shape: `rounded-full px-6 py-3`

**Secondary CTA Style**:
- Background: `transparent`
- Border: `border-2 border-orange-500`
- Text: `text-orange-500`
- Hover: `bg-orange-500/10`

**Validation**: 
- Label max length: 20 characters
- href must start with "/" (internal navigation)

---

### 3. Feature Card

**Description**: Visual component explaining product capabilities.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| icon | ReactNode | Yes | SVG icon or Lucide icon component |
| title | string | Yes | Feature name (4-8 characters recommended) |
| description | string | Yes | Brief explanation (2-3 sentences) |

**Feature Cards Data** (from FR-004):

```typescript
const features = [
  {
    icon: CameraIcon,
    title: "AI 음식 분석",
    description: "사진 한 장으로 음식을 인식하고 영양 정보를 자동으로 분석합니다."
  },
  {
    icon: CalculatorIcon,
    title: "자동 영양소 계산",
    description: "칼로리, 단백질, 탄수화물, 지방을 정확하게 계산합니다."
  },
  {
    icon: ChartIcon,
    title: "일일 추적",
    description: "하루 섭취량을 한눈에 확인하고 목표를 관리하세요."
  }
]
```

**Card Layout**:
- Background: `bg-slate-800/50`
- Border: `border border-slate-700`
- Padding: `p-6`
- Shape: `rounded-2xl`

**Validation**:
- Title max length: 20 characters
- Description max length: 100 characters

---

### 4. Step Indicator

**Description**: Sequential process visualization for "How It Works" section.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| stepNumber | number | Yes | Step order (1, 2, 3) |
| title | string | Yes | Step name |
| description | string | Yes | Brief action description |
| icon | ReactNode | No | Optional visual indicator |

**Steps Data** (from FR-005):

```typescript
const steps = [
  {
    stepNumber: 1,
    title: "사진 촬영",
    description: "음식 사진을 찍거나 갤러리에서 선택하세요."
  },
  {
    stepNumber: 2,
    title: "AI 분석",
    description: "AI가 음식을 인식하고 영양 정보를 분석합니다."
  },
  {
    stepNumber: 3,
    title: "결과 저장",
    description: "분석 결과를 확인하고 일일 기록에 저장하세요."
  }
]
```

**Step Number Style**:
- Circle with gradient: `bg-gradient-to-br from-orange-500 to-amber-500`
- Size: `w-12 h-12`
- Text: `text-white font-bold text-xl`

**Validation**:
- stepNumber must be 1, 2, or 3
- Title max length: 15 characters

---

## Component Relationships

```
LandingPage
├── Header
│   ├── Logo
│   └── CTA (primary, sm)
├── HeroSection
│   ├── Headline
│   ├── Subtext
│   ├── CTA (primary, lg)
│   └── PhoneMockup
├── FeaturesSection
│   └── FeatureCard[] (3 items)
├── HowItWorksSection
│   └── StepIndicator[] (3 items)
└── Footer
    ├── CTA (primary, lg)
    └── Copyright
```

---

## State Transitions

**Animation States** (per section):

| State | Description | Trigger |
|-------|-------------|---------|
| Hidden | `opacity-0 translate-y-5` | Initial render |
| Visible | `opacity-100 translate-y-0` | IntersectionObserver fires |

**Transition**: `motion-safe:animate-fadeInUp` (600ms ease-out)

**Reduced Motion**: Elements render immediately visible (`opacity-100`)

---

## Constraints

1. All text content in Korean (한국어)
2. Dark mode only (no theme toggle)
3. CTA links to `/login` or `/signup` (routes not yet implemented)
4. No user-generated content or dynamic data
5. No external asset dependencies for mockup
