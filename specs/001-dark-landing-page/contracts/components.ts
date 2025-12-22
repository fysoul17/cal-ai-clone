/**
 * Component Contracts: Dark Mode Landing Page
 * 
 * This file defines the TypeScript interfaces for landing page components.
 * These types serve as the contract between component implementation and usage.
 * 
 * Feature Branch: 001-dark-landing-page
 * Date: 2025-12-22
 */

import { ReactNode } from 'react'

// ============================================================================
// CTA Button
// ============================================================================

export type CTAVariant = 'primary' | 'secondary'
export type CTASize = 'sm' | 'md' | 'lg'

export interface CTAButtonProps {
  /** Button text (max 20 characters) */
  label: string
  /** Target URL - must start with "/" for internal navigation */
  href: string
  /** Visual style variant */
  variant: CTAVariant
  /** Button size - defaults to 'md' */
  size?: CTASize
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Feature Card
// ============================================================================

export interface FeatureCardProps {
  /** Icon component to display */
  icon: ReactNode
  /** Feature name (max 20 characters) */
  title: string
  /** Brief explanation (max 100 characters) */
  description: string
  /** Additional CSS classes */
  className?: string
}

export interface FeatureData {
  icon: ReactNode
  title: string
  description: string
}

// ============================================================================
// Step Indicator
// ============================================================================

export interface StepIndicatorProps {
  /** Step order (1, 2, or 3) */
  stepNumber: 1 | 2 | 3
  /** Step name (max 15 characters) */
  title: string
  /** Brief action description */
  description: string
  /** Optional visual indicator */
  icon?: ReactNode
  /** Additional CSS classes */
  className?: string
}

export interface StepData {
  stepNumber: 1 | 2 | 3
  title: string
  description: string
  icon?: ReactNode
}

// ============================================================================
// Phone Mockup
// ============================================================================

export interface PhoneMockupProps {
  /** Scale factor (0.5 to 1.0) - defaults to 1 */
  scale?: number
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Section Components
// ============================================================================

export interface SectionProps {
  /** Unique section identifier (used as anchor) */
  id?: string
  /** Additional CSS classes */
  className?: string
  /** Section content */
  children: ReactNode
}

export interface HeaderProps {
  /** Logo component or text */
  logo?: ReactNode
  /** Show CTA button in header */
  showCTA?: boolean
}

export interface HeroSectionProps {
  /** Main headline text */
  headline: string
  /** Supporting text below headline */
  subtext: string
  /** Primary CTA button label */
  ctaLabel: string
  /** CTA target URL */
  ctaHref: string
}

export interface FeaturesSectionProps {
  /** Section heading */
  title?: string
  /** Array of feature data */
  features: FeatureData[]
}

export interface HowItWorksSectionProps {
  /** Section heading */
  title?: string
  /** Array of step data */
  steps: StepData[]
}

export interface FooterProps {
  /** Show final CTA section */
  showCTA?: boolean
  /** CTA headline */
  ctaHeadline?: string
  /** CTA button label */
  ctaLabel?: string
  /** CTA target URL */
  ctaHref?: string
  /** Copyright text */
  copyright?: string
}
