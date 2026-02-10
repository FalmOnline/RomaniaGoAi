import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type ButtonSize = "small" | "big";
type ButtonColor = "yellow" | "green";
type IconPosition = "left" | "right";

/**
 * 1) Common props you want in BOTH <button> and <a> versions
 */
type CommonProps = {
  Icon?: LucideIcon;
  iconPosition?: IconPosition;
  size?: ButtonSize;
  color?: ButtonColor;
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * 2) BUTTON version props:
 * - has all normal button props (onClick, disabled, type, etc.)
 * - cannot have `href`
 */
type ButtonAsButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    type?: never;
    // disabled?: boolean;
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button(props: ButtonProps) {
  // 4) Extract common props (works for both button & link)
  const {
    type,
    href,
    Icon,
    iconPosition = "left",
    size = "big",
    color = "yellow",
    fullWidth = false,
    isLoading = false,
    className = "",
    children,
    ...rest
  } = props;

  // 5) If loading => treat as disabled (for both modes)
  const isDisabled = ("disabled" in props && !!props.disabled) || isLoading;

  // 6) Base classes + focus-visible + disabled styles
  let classes =
    "inline-flex items-center justify-center gap-2 font-medium " +
    "transition-colors duration-200 ease-out " +
    "transition-shadow focus-visible:outline-none focus-visible:ring-2 " +
    "focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // 7) full width
  if (fullWidth) classes += " w-full";

  // 8) size styles
  if (size === "small") classes += " px-4 py-2 rounded-3xl";
  else classes += " px-7 py-3 rounded-full";

  // 9) color styles + focus ring color
  if (color === "yellow") {
    classes +=
      " bg-rg-primary-yellow text-black focus-visible:ring-rg-primary-blue hover:bg-rg-yellow-dark-10";
  } else {
    classes +=
      " bg-rg-primary-green text-white focus-visible:ring-rg-primary-blue hover:bg-rg-green-dark-30";
  }

  // 10) add any extra className from caller at the end
  classes += ` ${className}`;

  // 11) shared inner content (icon + text + optional spinner)
  const content = (
    <>
      {isLoading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}

      {Icon && iconPosition === "left" && (
        <Icon size={24} strokeWidth={1} aria-hidden="true" />
      )}
      <span>{children}</span>
      {Icon && iconPosition === "right" && (
        <Icon size={24} strokeWidth={1} aria-hidden="true" />
      )}
    </>
  );

  /**
   * 12) Decide which element to render:
   * - if props has `href` -> render as link
   * - otherwise -> render as <button>
   */
  if (href) {
    const { onClick, tabIndex, ...anchorRest } =
      rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <Link
        href={href}
        {...anchorRest} // ✅ spread the cleaned props
        className={classes}
        aria-busy={isLoading || undefined}
        aria-disabled={isDisabled || undefined}
        tabIndex={isDisabled ? -1 : tabIndex} // ✅ use destructured tabIndex
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            return;
          }
          onClick?.(e); // ✅ user's onClick
        }}
      >
        {content}
      </Link>
    );
  }

  // Button mode
  // eslint-disable-next-line
  // const { href, type, ...rest } = props as ButtonAsButtonProps;

  return (
    <button
      {...rest}
      type={type ?? "button"}
      className={classes}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
    >
      {content}
    </button>
  );
}
