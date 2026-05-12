import * as React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import {
  Check,
  ChevronRight,
  Circle,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                   ROOT                                     */
/* -------------------------------------------------------------------------- */

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <div className="relative w-full flex justify-center">
    {/* BACKDROP GLOW */}
    <div className="absolute inset-0 flex justify-center pointer-events-none">
      <div className="h-full w-[70%] bg-primary/[0.03] blur-3xl rounded-full" />
    </div>

    <MenubarPrimitive.Root
      ref={ref}
      className={cn(
        [
          /* POSITIONING */
          "relative z-50",

          /* LAYOUT */
          "flex items-center gap-1.5",

          /* SIZE */
          "min-h-[58px]",
          "px-3 py-2",

          /* VISUAL */
          "rounded-2xl",
          "border border-border/60",
          "bg-background/75",
          "backdrop-blur-2xl",

          /* SHADOW */
          "shadow-[0_10px_60px_rgba(0,0,0,0.35)]",

          /* INNER LIGHT */
          "before:absolute before:inset-0 before:rounded-2xl",
          "before:bg-gradient-to-b before:from-white/[0.04] before:to-transparent",
          "before:pointer-events-none",

          /* MOBILE */
          "overflow-x-auto scrollbar-none",
        ].join(" "),
        className,
      )}
      {...props}
    />
  </div>
));

Menubar.displayName = MenubarPrimitive.Root.displayName;

/* -------------------------------------------------------------------------- */
/*                                  TRIGGER                                   */
/* -------------------------------------------------------------------------- */

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "group relative flex items-center justify-center",

        /* SIZE */
        "h-11 px-5",

        /* TYPO */
        "text-sm font-medium tracking-wide",

        /* VISUAL */
        "rounded-xl",
        "border border-transparent",
        "text-foreground/75",
        "bg-transparent",

        /* TRANSITIONS */
        "transition-all duration-300 ease-out",

        /* STATES */
        "hover:text-foreground",
        "hover:bg-accent/40",
        "hover:border-border/60",

        "focus:outline-none",
        "focus:bg-accent/50",
        "focus:text-foreground",

        "data-[state=open]:bg-accent/60",
        "data-[state=open]:border-border/80",
        "data-[state=open]:text-foreground",

        /* ACTIVE GLOW */
        "data-[state=open]:shadow-[0_0_30px_rgba(255,255,255,0.06)]",
      ].join(" "),
      className,
    )}
    {...props}
  >
    {/* HOVER LIGHT */}
    <span className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

    {/* TEXT */}
    <span className="relative z-10">
      {children}
    </span>

    {/* ACTIVE LINE */}
    <span
      className={cn(
        "absolute bottom-1 left-1/2 h-px w-0",
        "bg-primary transition-all duration-300",
        "group-data-[state=open]:left-4",
        "group-data-[state=open]:w-[calc(100%-2rem)]",
      )}
    />
  </MenubarPrimitive.Trigger>
));

MenubarTrigger.displayName =
  MenubarPrimitive.Trigger.displayName;

/* -------------------------------------------------------------------------- */
/*                               SUB TRIGGER                                  */
/* -------------------------------------------------------------------------- */

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      [
        "group relative flex cursor-default select-none items-center",

        /* SIZE */
        "min-h-[42px]",
        "px-3 py-2",

        /* TYPO */
        "text-sm tracking-wide",

        /* VISUAL */
        "rounded-lg",
        "text-foreground/80",

        /* TRANSITIONS */
        "transition-all duration-200",

        /* STATES */
        "focus:bg-accent/50",
        "focus:text-foreground",

        "data-[state=open]:bg-accent/50",
        "data-[state=open]:text-foreground",
      ].join(" "),
      inset && "pl-8",
      className,
    )}
    {...props}
  >
    <span>{children}</span>

    <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:translate-x-0.5" />
  </MenubarPrimitive.SubTrigger>
));

MenubarSubTrigger.displayName =
  MenubarPrimitive.SubTrigger.displayName;

/* -------------------------------------------------------------------------- */
/*                               SUB CONTENT                                  */
/* -------------------------------------------------------------------------- */

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      [
        "z-[80]",
        "min-w-[240px]",
        "overflow-hidden",

        /* VISUAL */
        "rounded-2xl",
        "border border-border/70",
        "bg-popover/92",
        "backdrop-blur-2xl",
        "p-2",

        /* SHADOW */
        "shadow-[0_20px_80px_rgba(0,0,0,0.45)]",

        /* ANIMATIONS */
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",

        "data-[state=closed]:fade-out-0",
        "data-[state=open]:fade-in-0",

        "data-[state=closed]:zoom-out-95",
        "data-[state=open]:zoom-in-[0.98]",

        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",

        "duration-200",
      ].join(" "),
      className,
    )}
    {...props}
  />
));

MenubarSubContent.displayName =
  MenubarPrimitive.SubContent.displayName;

/* -------------------------------------------------------------------------- */
/*                                  CONTENT                                   */
/* -------------------------------------------------------------------------- */

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    {
      className,
      align = "start",
      alignOffset = -6,
      sideOffset = 10,
      ...props
    },
    ref,
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          [
            "z-[80]",
            "min-w-[260px]",
            "overflow-hidden",

            /* VISUAL */
            "rounded-2xl",
            "border border-border/70",
            "bg-popover/92",
            "backdrop-blur-2xl",
            "p-2",

            /* SHADOW */
            "shadow-[0_25px_100px_rgba(0,0,0,0.55)]",

            /* INNER LIGHT */
            "before:absolute before:inset-0 before:pointer-events-none",
            "before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent",

            /* ANIMATIONS */
            "data-[state=open]:animate-in",
            "data-[state=closed]:animate-out",

            "data-[state=closed]:fade-out-0",
            "data-[state=open]:fade-in-0",

            "data-[state=closed]:zoom-out-95",
            "data-[state=open]:zoom-in-[0.985]",

            "data-[side=bottom]:slide-in-from-top-3",
            "data-[side=left]:slide-in-from-right-3",
            "data-[side=right]:slide-in-from-left-3",
            "data-[side=top]:slide-in-from-bottom-3",

            "duration-200",
          ].join(" "),
          className,
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  ),
);

MenubarContent.displayName =
  MenubarPrimitive.Content.displayName;

/* -------------------------------------------------------------------------- */
/*                                    ITEM                                    */
/* -------------------------------------------------------------------------- */

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      [
        "relative flex cursor-default select-none items-center",

        /* SIZE */
        "min-h-[42px]",
        "px-3 py-2.5",

        /* TYPO */
        "text-sm tracking-wide",

        /* VISUAL */
        "rounded-xl",
        "text-foreground/80",

        /* TRANSITIONS */
        "transition-all duration-200",

        /* STATES */
        "focus:bg-accent/50",
        "focus:text-foreground",

        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-40",
      ].join(" "),
      inset && "pl-9",
      className,
    )}
    {...props}
  />
));

MenubarItem.displayName = MenubarPrimitive.Item.displayName;

/* -------------------------------------------------------------------------- */
/*                              CHECKBOX ITEM                                 */
/* -------------------------------------------------------------------------- */

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    className={cn(
      [
        "relative flex cursor-default select-none items-center",
        "min-h-[42px]",
        "rounded-xl",
        "py-2.5 pl-10 pr-3",
        "text-sm tracking-wide",
        "text-foreground/80",

        "transition-all duration-200",

        "focus:bg-accent/50",
        "focus:text-foreground",

        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-40",
      ].join(" "),
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-primary" />
      </MenubarPrimitive.ItemIndicator>
    </span>

    {children}
  </MenubarPrimitive.CheckboxItem>
));

MenubarCheckboxItem.displayName =
  MenubarPrimitive.CheckboxItem.displayName;

/* -------------------------------------------------------------------------- */
/*                               RADIO ITEM                                   */
/* -------------------------------------------------------------------------- */

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      [
        "relative flex cursor-default select-none items-center",
        "min-h-[42px]",
        "rounded-xl",
        "py-2.5 pl-10 pr-3",
        "text-sm tracking-wide",
        "text-foreground/80",

        "transition-all duration-200",

        "focus:bg-accent/50",
        "focus:text-foreground",

        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-40",
      ].join(" "),
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2.5 w-2.5 fill-current text-primary" />
      </MenubarPrimitive.ItemIndicator>
    </span>

    {children}
  </MenubarPrimitive.RadioItem>
));

MenubarRadioItem.displayName =
  MenubarPrimitive.RadioItem.displayName;

/* -------------------------------------------------------------------------- */
/*                                   LABEL                                    */
/* -------------------------------------------------------------------------- */

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      [
        "px-3 py-2",
        "text-[11px]",
        "font-semibold",
        "tracking-[0.22em]",
        "uppercase",
        "text-primary",
      ].join(" "),
      inset && "pl-9",
      className,
    )}
    {...props}
  />
));

MenubarLabel.displayName =
  MenubarPrimitive.Label.displayName;

/* -------------------------------------------------------------------------- */
/*                                 SEPARATOR                                  */
/* -------------------------------------------------------------------------- */

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn(
      "my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent",
      className,
    )}
    {...props}
  />
));

MenubarSeparator.displayName =
  MenubarPrimitive.Separator.displayName;

/* -------------------------------------------------------------------------- */
/*                                  SHORTCUT                                  */
/* -------------------------------------------------------------------------- */

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      [
        "ml-auto",
        "text-[10px]",
        "tracking-[0.22em]",
        "uppercase",
        "text-muted-foreground/70",
      ].join(" "),
      className,
    )}
    {...props}
  />
);

MenubarShortcut.displayName = "MenubarShortcut";

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};
