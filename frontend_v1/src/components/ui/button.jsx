/* eslint-disable react/prop-types, react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl font-body text-sm font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary via-ember-500 to-ember-600 text-primary-foreground shadow-float hover:-translate-y-0.5 hover:brightness-105",
        restaurant:
          "bg-gradient-to-br from-primary via-ember-500 to-ember-600 text-primary-foreground shadow-float hover:-translate-y-0.5 hover:brightness-105",
        chef:
          "bg-gradient-to-br from-primary via-ember-500 to-ember-600 text-primary-foreground shadow-float hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "border border-secondary/20 bg-secondary/12 text-secondary hover:bg-secondary/18 dark:bg-secondary/10 dark:text-secondary-foreground",
        inactive:
          "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80",
        outline:
          "border border-stone-200 bg-stone-50/90 text-text-main-light shadow-sm hover:border-primary/30 hover:bg-white dark:border-border-dark dark:bg-white/6 dark:text-text-main-dark dark:hover:bg-white/10",
        ghost:
          "text-text-main-light hover:bg-stone-50/90 dark:text-text-main-dark dark:hover:bg-white/10",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-95",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        icon: "h-11 w-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, onClick, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={onClick}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
