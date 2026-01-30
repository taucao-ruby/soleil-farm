/**
 * Soleil Farm Design System - Card Component
 * ==========================================
 * Flexible card component for content containers.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

// ===== CARD VARIANTS =====
const cardVariants = cva(
  [
    'rounded-xl border bg-card text-card-foreground',
    'transition-all duration-200',
  ],
  {
    variants: {
      variant: {
        default: 'border-border shadow-sm',
        outline: 'border-2 border-border bg-transparent',
        elevated: 'border-transparent shadow-lg',
        ghost: 'border-transparent shadow-none',
        filled: 'border-transparent bg-muted',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md hover:border-primary/30',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
);

// ===== COMPONENT TYPES =====
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Enable hover animation */
  animated?: boolean;
  /** As a link */
  asChild?: boolean;
}

// ===== CARD COMPONENT =====
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      interactive,
      animated = false,
      children,
      ...props
    },
    ref
  ) => {
    if (animated && interactive) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, padding, interactive }), className)}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.15 }}
          {...(props as HTMLMotionProps<'div'>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ===== CARD HEADER =====
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

// ===== CARD TITLE =====
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

// ===== CARD DESCRIPTION =====
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

// ===== CARD CONTENT =====
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));

CardContent.displayName = 'CardContent';

// ===== CARD FOOTER =====
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

// ===== CARD IMAGE =====
interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Aspect ratio */
  aspectRatio?: 'video' | 'square' | 'auto';
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, aspectRatio = 'video', alt, ...props }, ref) => {
    const aspectClasses = {
      video: 'aspect-video',
      square: 'aspect-square',
      auto: '',
    };

    return (
      <div className={cn('-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl', className)}>
        <img
          ref={ref}
          alt={alt}
          className={cn(
            'h-full w-full object-cover',
            aspectClasses[aspectRatio]
          )}
          {...props}
        />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

// ===== CARD BADGE =====
const CardBadge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'absolute right-4 top-4 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground',
      className
    )}
    {...props}
  />
));

CardBadge.displayName = 'CardBadge';

// ===== EXPORTS =====
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  CardBadge,
  cardVariants,
};
export default Card;
