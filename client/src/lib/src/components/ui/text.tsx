import * as React from "react";
import { cn } from "../../utils";
import { VariantProps, cva } from "class-variance-authority";

/**
 * Text component with retro computing styles
 * Features include:
 * - Various pixelated and retro font styles
 * - Terminal and CLI-inspired text styles
 * - Animation effects including typing, glitch, and scanlines
 * - Monospace-forward design for authentic tech aesthetic
 */
const textVariants = cva("text-foreground transition-colors", {
  variants: {
    variant: {
      // Basic styles
      default: "text-base",
      heading: "text-xl font-bold tracking-tight leading-none border-b-2 border-primary/50 pb-1 font-mono",
      subheading: "text-lg font-semibold font-mono border-l-4 border-primary/70 pl-2",
      paragraph: "text-base leading-relaxed",
      
      // Functional styles
      label: "text-sm font-medium uppercase tracking-wider font-mono",
      code: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded-sm border border-border overflow-x-auto",
      terminal: "font-mono text-xs leading-none text-green-400 bg-black/80 px-2 py-1 rounded-sm",
      command: "font-mono text-xs bg-black/70 text-white px-2 py-1 rounded-sm before:content-['$_'] before:text-primary/70 before:mr-1",
      
      // Status/alert styles
      error: "font-mono text-sm text-red-500 border-l-2 border-red-500 pl-2 bg-red-500/10 py-0.5 px-1.5 rounded-r-sm",
      success: "font-mono text-sm text-green-500 border-l-2 border-green-500 pl-2 bg-green-500/10 py-0.5 px-1.5 rounded-r-sm",
      warning: "font-mono text-sm text-yellow-500 border-l-2 border-yellow-500 pl-2 bg-yellow-500/10 py-0.5 px-1.5 rounded-r-sm",
      info: "font-mono text-sm text-blue-500 border-l-2 border-blue-500 pl-2 bg-blue-500/10 py-0.5 px-1.5 rounded-r-sm",
      
      // Special effect styles
      glitch: "font-bold relative before:content-[attr(data-text)] before:absolute before:text-foreground before:left-[0.05em] before:top-[0.05em] before:text-red-500 before:opacity-70 before:z-[-1] after:content-[attr(data-text)] after:absolute after:text-foreground after:left-[-0.05em] after:top-[-0.05em] after:text-blue-500 after:opacity-70 after:z-[-1]",
      pixelated: "font-mono text-base [image-rendering:pixelated] tracking-wider leading-relaxed",
      retro: "font-mono text-base border-b-2 border-dashed border-primary pb-0.5 px-1",
      crt: "font-mono text-base text-green-400 [text-shadow:0_0_2px_#4ade80] px-1",
      ascii: "font-mono text-xs whitespace-pre leading-none",
      highlight: "font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm",
      
      // DeFi-specific styles
      value: "font-mono text-base tabular-nums text-right",
      token: "font-mono text-base uppercase tracking-wider",
      percent: "font-mono text-base after:content-['%']",
      address: "font-mono text-xs text-muted-foreground tracking-tighter",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    animation: {
      none: "",
      typing: "overflow-hidden whitespace-nowrap animate-typing border-r-2 border-r-primary",
      blink: "animate-blink",
      flicker: "animate-flicker",
      scanline: "relative after:content-[''] after:w-full after:h-[1px] after:bg-foreground/30 after:absolute after:left-0 after:animate-scanline",
      glow: "animate-pulse text-primary drop-shadow-[0_0_10px_var(--primary)]",
      glitch: "animate-glitch",
      pixelate: "animate-pixelate"
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    }
  },
  defaultVariants: {
    variant: "default",
    size: "base",
    animation: "none",
    weight: "normal",
    tracking: "normal",
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: React.ElementType;
  dataText?: string;  // For glitch effect
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation, 
    weight,
    tracking,
    as: Component = "p", 
    dataText, 
    ...props 
  }, ref) => {
    // Extract data-text for glitch effect
    const dataAttributes = variant === 'glitch' 
      ? { 'data-text': dataText || props.children?.toString() || '' }
      : {};
    
    // For DeFi-specific values that need special formatting
    const formattedChildren = React.useMemo(() => {
      if (variant === 'percent' && typeof props.children === 'number') {
        return props.children.toFixed(2);
      }
      return props.children;
    }, [variant, props.children]);
      
    return (
      <Component
        ref={ref}
        className={cn(textVariants({ 
          variant, 
          size, 
          animation, 
          weight,
          tracking,
          className 
        }))}
        {...dataAttributes}
        {...props}
      >
        {formattedChildren}
      </Component>
    );
  }
);
Text.displayName = "Text";

export { Text, textVariants };
