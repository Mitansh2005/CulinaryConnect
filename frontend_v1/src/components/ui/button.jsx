/* eslint-disable react/prop-types, react-refresh/only-export-components */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group inline-flex items-center justify-center whitespace-nowrap font-body text-sm font-semibold tracking-[-0.01em] transition-[border-radius,background-color,border-color,color,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        restaurant:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        chef:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        secondary:
          "border border-secondary/20 bg-secondary/12 text-secondary hover:bg-secondary/18 dark:bg-secondary/10 dark:text-secondary-foreground",
        inactive:
          "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80",
        outline:
          "border border-stone-200 bg-stone-50/90 text-text-main-light shadow-sm hover:border-primary/30 hover:bg-white dark:border-white/20 dark:bg-white/5 dark:text-text-main-dark dark:hover:bg-white/10",
        ghost:
          "text-text-main-light hover:bg-stone-50/90 dark:text-text-main-dark dark:hover:bg-white/10",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:brightness-95",
      },
      size: {
        default: "h-11 px-5 py-2.5 rounded-[22px] hover:rounded-[10px]",
        sm: "h-9 px-3.5 text-xs rounded-[18px] hover:rounded-[8px]",
        lg: "h-12 px-8 text-base rounded-[24px] hover:rounded-[12px]",
        icon: "h-11 w-11 rounded-[22px] hover:rounded-[10px]",
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
