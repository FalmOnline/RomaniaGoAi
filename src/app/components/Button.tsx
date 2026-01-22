// components/ui/Button.tsx
import * as React from "react";
import type { LucideIcon } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  /** Pass either a Lucide component (e.g. Check) or a React node */
  leftIcon?: LucideIcon | React.ReactNode;
  rightIcon?: LucideIcon | React.ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-3xl font-medium " +
  "transition-shadow focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-rg-primary-yellow text-black hover:bg-rg-yellow-dark-10 focus-visible:ring-blue-600",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400",
  ghost:
    "bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const iconSizePx: Record<Size, number> = { sm: 16, md: 18, lg: 20 };

function renderIcon(icon: ButtonProps["leftIcon"], size: Size) {
  if (!icon) return null;
  const px = iconSizePx[size];
  if (typeof icon === "function") {
    const Icon = icon as LucideIcon;
    return <Icon size={px} aria-hidden="true" />;
  }
  // already a node (<Check className="h-4 w-4" />)
  return <span className="inline-flex shrink-0" aria-hidden="true">{icon}</span>;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth,
      className = "",
      type,
      children,
      ...props
    },
    ref
  ) => {
    const classes = [
      base,
      variants[variant],
      sizes[size],
      fullWidth ? "w-full" : "",
      className,
    ].filter(Boolean).join(" ");

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        type={type ?? "button"}
        {...props}
      >
        {isLoading && (
          // swap to <Loader2 /> if you prefer lucide spinner
          <svg className="animate-spin -ml-0.5 mr-1 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {renderIcon(leftIcon, size)}
        <span>{children}</span>
        {renderIcon(rightIcon, size)}
      </button>
    );
  }
);
Button.displayName = "Button";
