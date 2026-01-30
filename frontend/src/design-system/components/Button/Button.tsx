/**
 * Soleil Farm Design System - Button Component
 * ============================================
 * A flexible button component with multiple variants,
 * sizes, and states. Fully accessible and animated.
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

// ===== BUTTON VARIANTS =====
const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'whitespace-nowrap rounded-lg font-medium',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        // Primary - Main actions
        primary: [
          'bg-primary text-primary-foreground',
          'hover:bg-primary/90',
          'shadow-sm hover:shadow-md',
        ],

        // Secondary - Alternative actions
        secondary: [
          'bg-secondary text-secondary-foreground',
          'hover:bg-secondary/80',
          'border border-border',
        ],

        // Destructive - Dangerous actions
        destructive: [
          'bg-destructive text-destructive-foreground',
          'hover:bg-destructive/90',
          'shadow-sm',
        ],

        // Ghost - Minimal styling
        ghost: [
          'text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
        ],

        // Outline - Bordered button
        outline: [
          'border-2 border-primary bg-transparent text-primary',
          'hover:bg-primary hover:text-primary-foreground',
        ],

        // Link - Text-like button
        link: [
          'text-primary underline-offset-4',
          'hover:underline',
          'h-auto p-0',
        ],

        // Success - Positive actions
        success: [
          'bg-farm-leaf text-white',
          'hover:bg-farm-leaf-dark',
          'shadow-sm',
        ],

        // Warning - Caution actions
        warning: [
          'bg-farm-harvest text-white',
          'hover:bg-farm-harvest-dark',
          'shadow-sm',
        ],
      },

      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },

      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

// ===== COMPONENT TYPES =====
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renders as child element (Slot pattern) */
  asChild?: boolean;
  /** Shows loading spinner */
  loading?: boolean;
  /** Loading text (shown next to spinner) */
  loadingText?: string;
  /** Icon to show before text */
  leftIcon?: React.ReactNode;
  /** Icon to show after text */
  rightIcon?: React.ReactNode;
  /** Enable motion animations */
  animated?: boolean;
}

// ===== MOTION VARIANTS =====
const motionVariants = {
  tap: { scale: 0.97 },
  hover: { scale: 1.02 },
};

// ===== BUTTON COMPONENT =====
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      animated = true,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Use Slot for composition pattern
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;

    // Render loading state
    const renderContent = () => (
      <>
        {loading ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {loading && loadingText ? loadingText : children}
        {!loading && rightIcon}
      </>
    );

    // Non-animated version
    if (!animated || asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-busy={loading}
          {...props}
        >
          {renderContent()}
        </Comp>
      );
    }

    // Animated version with Framer Motion
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        whileTap={!isDisabled ? motionVariants.tap : undefined}
        whileHover={!isDisabled ? motionVariants.hover : undefined}
        transition={{ duration: 0.1 }}
        {...(props as HTMLMotionProps<'button'>)}
      >
        {renderContent()}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// ===== BUTTON GROUP COMPONENT =====
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientation of the group */
  orientation?: 'horizontal' | 'vertical';
  /** Spacing between buttons */
  spacing?: 'none' | 'sm' | 'md';
  /** Attached style (no spacing, connected borders) */
  attached?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      orientation = 'horizontal',
      spacing = 'sm',
      attached = false,
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      none: '',
      sm: orientation === 'horizontal' ? 'gap-2' : 'gap-2',
      md: orientation === 'horizontal' ? 'gap-4' : 'gap-4',
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'inline-flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          attached
            ? [
                '[&>button]:rounded-none',
                orientation === 'horizontal'
                  ? '[&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg [&>button:not(:last-child)]:border-r-0'
                  : '[&>button:first-child]:rounded-t-lg [&>button:last-child]:rounded-b-lg [&>button:not(:last-child)]:border-b-0',
              ]
            : spacingClasses[spacing],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// ===== EXPORTS =====
export { Button, ButtonGroup, buttonVariants };
export default Button;
