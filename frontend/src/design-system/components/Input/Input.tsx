/**
 * Soleil Farm Design System - Input Component
 * ==========================================
 * Enhanced input component with icons, addons, and states.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// ===== INPUT VARIANTS =====
const inputVariants = cva(
  [
    'flex w-full rounded-lg border bg-background px-3 py-2',
    'text-sm text-foreground',
    'ring-offset-background',
    'transition-all duration-200',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ],
  {
    variants: {
      inputSize: {
        sm: 'h-8 text-xs px-2.5',
        md: 'h-10',
        lg: 'h-12 text-base px-4',
      },
      variant: {
        default: 'border-input',
        filled: 'border-transparent bg-muted',
        flushed: 'rounded-none border-0 border-b-2 px-0 focus-visible:ring-0',
      },
      hasError: {
        true: 'border-destructive focus-visible:ring-destructive',
        false: '',
      },
      hasSuccess: {
        true: 'border-emerald-500 focus-visible:ring-emerald-500',
        false: '',
      },
    },
    defaultVariants: {
      inputSize: 'md',
      variant: 'default',
      hasError: false,
      hasSuccess: false,
    },
  }
);

// ===== COMPONENT TYPES =====
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /** Left icon */
  leftIcon?: React.ReactNode;
  /** Right icon */
  rightIcon?: React.ReactNode;
  /** Left addon (text or element) */
  leftAddon?: React.ReactNode;
  /** Right addon (text or element) */
  rightAddon?: React.ReactNode;
  /** Clear button */
  clearable?: boolean;
  /** Clear callback */
  onClear?: () => void;
  /** Container className */
  containerClassName?: string;
}

// ===== INPUT COMPONENT =====
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type,
      inputSize,
      variant,
      hasError,
      hasSuccess,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      clearable,
      onClear,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const hasLeftElement = leftIcon || leftAddon;
    const hasRightElement = rightIcon || rightAddon || clearable;
    const showClear = clearable && value && !disabled;

    // If no addons or icons, render simple input
    if (!hasLeftElement && !hasRightElement) {
      return (
        <input
          type={type}
          className={cn(
            inputVariants({ inputSize, variant, hasError, hasSuccess }),
            className
          )}
          ref={ref}
          disabled={disabled}
          value={value}
          {...props}
        />
      );
    }

    // Render with addons/icons
    return (
      <div
        className={cn(
          'relative flex items-stretch',
          disabled && 'opacity-50',
          containerClassName
        )}
      >
        {/* Left Addon */}
        {leftAddon && (
          <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            {leftAddon}
          </span>
        )}

        {/* Input Wrapper */}
        <div className="relative flex flex-1 items-center">
          {/* Left Icon */}
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
              {leftIcon}
            </span>
          )}

          <input
            type={type}
            className={cn(
              inputVariants({ inputSize, variant, hasError, hasSuccess }),
              leftIcon && 'pl-10',
              (rightIcon || showClear) && 'pr-10',
              leftAddon && 'rounded-l-none',
              rightAddon && 'rounded-r-none',
              className
            )}
            ref={ref}
            disabled={disabled}
            value={value}
            aria-invalid={hasError ? 'true' : undefined}
            {...props}
          />

          {/* Right Icon or Clear */}
          {(rightIcon || showClear) && (
            <span className="absolute right-3 flex items-center gap-1">
              {showClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Clear input"
                  tabIndex={-1}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
              {rightIcon && !showClear && (
                <span className="text-muted-foreground [&>svg]:h-4 [&>svg]:w-4">
                  {rightIcon}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Right Addon */}
        {rightAddon && (
          <span className="inline-flex items-center rounded-r-lg border border-l-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            {rightAddon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ===== SEARCH INPUT =====
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  /** Loading state */
  loading?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ loading, className, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={
          loading ? (
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )
        }
        clearable
        className={className}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// ===== NUMBER INPUT =====
interface NumberInputProps extends Omit<InputProps, 'type'> {
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step value */
  step?: number;
  /** Show stepper buttons */
  showStepper?: boolean;
  /** On value change */
  onValueChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      min,
      max,
      step = 1,
      showStepper = false,
      onValueChange,
      value,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      const numValue = parseFloat(e.target.value);
      if (!isNaN(numValue)) {
        onValueChange?.(numValue);
      }
    };

    const increment = () => {
      const current = parseFloat(value?.toString() || '0');
      const newValue = Math.min(current + step, max ?? Infinity);
      onValueChange?.(newValue);
    };

    const decrement = () => {
      const current = parseFloat(value?.toString() || '0');
      const newValue = Math.max(current - step, min ?? -Infinity);
      onValueChange?.(newValue);
    };

    if (!showStepper) {
      return (
        <Input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={className}
          {...props}
        />
      );
    }

    return (
      <div className="flex">
        <button
          type="button"
          onClick={decrement}
          className="inline-flex items-center justify-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-muted-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Decrease"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <input
          ref={ref}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={cn(
            'flex h-10 w-full border border-input bg-background px-3 py-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={increment}
          className="inline-flex items-center justify-center rounded-r-lg border border-l-0 border-input bg-muted px-3 text-muted-foreground hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Increase"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

// ===== EXPORTS =====
export { Input, SearchInput, NumberInput, inputVariants };
export default Input;
