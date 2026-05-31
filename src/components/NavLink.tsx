import { forwardRef, type ReactNode } from "react";
import {
  NavLink as RouterNavLink,
  type NavLinkProps,
  type To,
} from "react-router-dom";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const navLinkVariants = cva(
  "inline-flex items-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        territory:
          "text-rdm-fog/75 hover:text-rdm-platinum aria-[current=page]:text-rdm-gold aria-[current=page]:drop-shadow-[0_0_8px_rgba(212,178,106,0.4)]",
        ecosystem:
          "text-rdm-fog/75 hover:text-rdm-platinum aria-[current=page]:text-rdm-oxygen aria-[current=page]:drop-shadow-[0_0_8px_rgba(0,160,255,0.4)]",
        governance:
          "text-rdm-fog/75 hover:text-rdm-platinum aria-[current=page]:text-rdm-candle aria-[current=page]:drop-shadow-[0_0_8px_rgba(255,193,7,0.4)]",
        heritage:
          "text-rdm-mineral/80 hover:text-rdm-gold aria-[current=page]:bg-gradient-to-r aria-[current=page]:from-rdm-copper aria-[current=page]:to-rdm-gold aria-[current=page]:bg-clip-text aria-[current=page]:text-transparent",
        intelligence:
          "text-rdm-fog/75 hover:text-rdm-oxygen aria-[current=page]:bg-gradient-to-r aria-[current=page]:from-rdm-pine aria-[current=page]:via-rdm-data aria-[current=page]:to-rdm-gold aria-[current=page]:bg-clip-text aria-[current=page]:text-transparent",
        auth:
          "text-rdm-fog/70 hover:text-white aria-[current=page]:text-white aria-[current=page]:bg-white/10 aria-[current=page]:backdrop-blur-sm",
        default:
          "text-rdm-fog/75 hover:text-rdm-platinum aria-[current=page]:text-white",
      },
      size: {
        sm: "text-sm px-3 py-1.5",
        md: "text-base px-4 py-2",
        lg: "text-lg px-5 py-2.5",
        xl: "text-xl px-6 py-3",
      },
      mode: {
        text: "",
        pill: "rounded-full border border-transparent aria-[current=page]:border-current/20",
        subtle:
          "rounded-lg bg-transparent hover:bg-white/5 aria-[current=page]:bg-white/8",
        panel:
          "rounded-xl bg-white/3 backdrop-blur-sm border border-white/8 hover:border-white/12 aria-[current=page]:border-current/30 aria-[current=page]:bg-white/6",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      mode: "text",
      weight: "medium",
    },
  },
);

interface NavLinkEnhancedProps
  extends Omit<NavLinkProps, "className">,
    VariantProps<typeof navLinkVariants> {
  to: To;
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  badge?: string | number;
  showPulse?: boolean;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkEnhancedProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      variant = "default",
      size = "md",
      mode = "text",
      weight = "medium",
      icon,
      iconPosition = "left",
      badge,
      showPulse = false,
      to,
      children,
      end = false,
      ...props
    },
    ref,
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        end={end}
        className={({ isActive, isPending }) =>
          cn(
            navLinkVariants({ variant, size, mode, weight }),
            className,
            isActive && activeClassName,
            isPending && cn("opacity-60 cursor-wait", pendingClassName),
          )
        }
        {...props}
      >
        {({ isActive }) => (
          <>
            {showPulse && isActive && (
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            )}

            {icon && iconPosition === "left" && (
              <span
                className={cn(
                  "inline-flex items-center justify-center transition-transform",
                  isActive && "scale-110",
                )}
                aria-hidden="true"
              >
                {icon}
              </span>
            )}

            <span className="relative">
              {children as ReactNode}
              {badge !== undefined && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[0.65rem] font-bold text-rdm-night bg-rdm-gold rounded-full">
                  {badge}
                </span>
              )}
            </span>

            {icon && iconPosition === "right" && (
              <span
                className={cn(
                  "inline-flex items-center justify-center transition-transform",
                  isActive && "scale-110",
                )}
                aria-hidden="true"
              >
                {icon}
              </span>
            )}
          </>
        )}
      </RouterNavLink>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink, navLinkVariants };
export type { NavLinkEnhancedProps };
