import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  ROOT MENU                                 */
/* -------------------------------------------------------------------------- */

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-50 flex flex-1 items-center justify-center",
      className,
    )}
    {...props}
  >
    {children}

    {/* VIEWPORT */}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));

NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

/* -------------------------------------------------------------------------- */
/*                                   LIST                                     */
/* -------------------------------------------------------------------------- */

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1.5",
      className,
    )}
    {...props}
  />
));

NavigationMenuList.displayName =
  NavigationMenuPrimitive.List.displayName;

/* -------------------------------------------------------------------------- */
/*                                   ITEM                                     */
/* -------------------------------------------------------------------------- */

const NavigationMenuItem = NavigationMenuPrimitive.Item;

/* -------------------------------------------------------------------------- */
/*                              TRIGGER STYLES                                */
/* -------------------------------------------------------------------------- */

const navigationMenuTriggerStyle = cva(
  [
    "group relative inline-flex h-11 items-center justify-center",
    "rounded-md px-4 py-2",
    "font-medium text-sm tracking-wide",
    "transition-all duration-300 ease-out",
    "select-none whitespace-nowrap",
    "outline-none",
    "border border-transparent",

    /* Colors */
    "bg-transparent text-foreground/80",
    "hover:text-foreground",
    "hover:bg-accent/40",
    "focus:bg-accent/40",
    "focus:text-foreground",

    /* Open / active states */
    "data-[active]:bg-accent/40",
    "data-[state=open]:bg-accent/50",
    "data-[state=open]:border-border/60",

    /* Disabled */
    "disabled:pointer-events-none disabled:opacity-40",

    /* Subtle glow */
    "before:absolute before:inset-0 before:rounded-md",
    "before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent",
    "before:opacity-0 hover:before:opacity-100",
    "before:transition-opacity before:duration-300",
  ].join(" "),
);

/* -------------------------------------------------------------------------- */
/*                                  TRIGGER                                   */
/* -------------------------------------------------------------------------- */

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), className)}
    {...props}
  >
    <span className="relative z-10 flex items-center">
      {children}

      <ChevronDown
        className={cn(
          "ml-1.5 h-3.5 w-3.5 shrink-0",
          "transition-transform duration-300 ease-out",
          "group-data-[state=open]:rotate-180",
        )}
        aria-hidden="true"
      />
    </span>

    {/* Bottom active line */}
    <span
      className={cn(
        "absolute bottom-0 left-1/2 h-px w-0",
        "bg-primary transition-all duration-300",
        "group-data-[state=open]:left-4",
        "group-data-[state=open]:w-[calc(100%-2rem)]",
      )}
    />
  </NavigationMenuPrimitive.Trigger>
));

NavigationMenuTrigger.displayName =
  NavigationMenuPrimitive.Trigger.displayName;

/* -------------------------------------------------------------------------- */
/*                                  CONTENT                                   */
/* -------------------------------------------------------------------------- */

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      [
        "left-0 top-0 w-full md:absolute md:w-auto",

        /* Animation */
        "data-[motion^=from-]:animate-in",
        "data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in-0",
        "data-[motion^=to-]:fade-out-0",
        "data-[motion=from-end]:slide-in-from-right-8",
        "data-[motion=from-start]:slide-in-from-left-8",
        "data-[motion=to-end]:slide-out-to-right-8",
        "data-[motion=to-start]:slide-out-to-left-8",

        /* Timing */
        "duration-300 ease-out",
      ].join(" "),
      className,
    )}
    {...props}
  />
));

NavigationMenuContent.displayName =
  NavigationMenuPrimitive.Content.displayName;

/* -------------------------------------------------------------------------- */
/*                                    LINK                                    */
/* -------------------------------------------------------------------------- */

const NavigationMenuLink = NavigationMenuPrimitive.Link;

/* -------------------------------------------------------------------------- */
/*                                  VIEWPORT                                  */
/* -------------------------------------------------------------------------- */

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "absolute left-0 top-full flex w-full justify-center",
      "perspective-[2000px]",
    )}
  >
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        [
          "relative mt-3 overflow-hidden",
          "origin-top-center",

          /* Sizing */
          "h-[var(--radix-navigation-menu-viewport-height)]",
          "w-full md:w-[var(--radix-navigation-menu-viewport-width)]",

          /* Visual */
          "rounded-xl border border-border/70",
          "bg-popover/90",
          "backdrop-blur-xl",
          "text-popover-foreground",

          /* Shadow */
          "shadow-[0_20px_80px_rgba(0,0,0,0.45)]",

          /* Animation */
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95",
          "data-[state=open]:zoom-in-[0.98]",
          "duration-300",

          /* Subtle gradient */
          "before:absolute before:inset-0 before:pointer-events-none",
          "before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent",
        ].join(" "),
        className,
      )}
      {...props}
    />
  </div>
));

NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

/* -------------------------------------------------------------------------- */
/*                                 INDICATOR                                  */
/* -------------------------------------------------------------------------- */

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      [
        "top-full z-[60] flex h-3 items-end justify-center overflow-hidden",

        /* Animation */
        "data-[state=visible]:animate-in",
        "data-[state=hidden]:animate-out",
        "data-[state=hidden]:fade-out-0",
        "data-[state=visible]:fade-in-0",
        "duration-300",
      ].join(" "),
      className,
    )}
    {...props}
  >
    <div
      className={cn(
        "relative top-[65%]",
        "h-3 w-3 rotate-45",
        "rounded-[2px]",
        "border-l border-t border-border/70",
        "bg-popover/90 backdrop-blur-xl",
        "shadow-md",
      )}
    />
  </NavigationMenuPrimitive.Indicator>
));

NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
