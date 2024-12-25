import * as React from "react";
import { cn } from "../../utils";
import { VariantProps, cva } from "class-variance-authority";

const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      default: "text-base",
      heading: "text-xl font-bold tracking-tight",
      subheading: "text-lg font-semibold",
      label: "text-sm font-medium",
      code: "font-mono text-sm bg-muted px-1 py-0.5 rounded-sm",
      terminal: "font-mono text-xs",
      error: "text-sm text-destructive",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "base",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(textVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, textVariants };
