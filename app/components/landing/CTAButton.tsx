import Link from "next/link";

export type CTAVariant = "primary" | "secondary";
export type CTASize = "sm" | "md" | "lg";

export interface CTAButtonProps {
  label: string;
  href: string;
  variant: CTAVariant;
  size?: CTASize;
  className?: string;
}

const sizeClasses: Record<CTASize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const variantClasses: Record<CTAVariant, string> = {
  primary:
    "bg-orange-500 hover:bg-orange-600 text-white",
  secondary:
    "bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10",
};

export function CTAButton({
  label,
  href,
  variant,
  size = "md",
  className = "",
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center font-semibold rounded-full transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {label}
    </Link>
  );
}
