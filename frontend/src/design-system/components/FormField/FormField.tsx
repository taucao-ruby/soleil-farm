/**
 * Soleil Farm Design System - FormField Component
 * ===============================================
 * Accessible form field wrapper with label, error, and helper text.
 * Works with any input component (Input, Select, Textarea, etc.)
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, HelpCircle, Info } from 'lucide-react';

import { cn } from '@/lib/utils';

// ===== FORM FIELD VARIANTS =====
const formFieldVariants = cva('w-full', {
  variants: {
    size: {
      sm: '[&_label]:text-xs [&_input]:text-sm',
      md: '',
      lg: '[&_label]:text-base [&_input]:text-base',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// ===== COMPONENT TYPES =====
export interface FormFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldVariants> {
  /** Field label */
  label?: string;
  /** Field name (for id/htmlFor) */
  name?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Required indicator */
  required?: boolean;
  /** Optional indicator */
  optional?: boolean;
  /** Disable the field */
  disabled?: boolean;
  /** Show success state */
  success?: boolean;
  /** Tooltip content */
  tooltip?: string;
  /** Hide label visually (keep for screen readers) */
  hideLabel?: boolean;
  /** Horizontal layout */
  horizontal?: boolean;
  /** Label width (for horizontal layout) */
  labelWidth?: string;
}

// ===== CONTEXT FOR FIELD STATE =====
interface FormFieldContextValue {
  id: string;
  name?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function useFormField() {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error('useFormField must be used within a FormField');
  }
  return context;
}

// ===== FORM FIELD COMPONENT =====
const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    {
      className,
      size,
      label,
      name,
      error,
      helperText,
      required,
      optional,
      disabled,
      success,
      tooltip,
      hideLabel,
      horizontal,
      labelWidth = '8rem',
      children,
      ...props
    },
    ref
  ) => {
    // Generate unique ID
    const generatedId = React.useId();
    const id = name || generatedId;

    // Context value
    const contextValue = React.useMemo(
      () => ({
        id,
        name,
        error,
        disabled,
        required,
      }),
      [id, name, error, disabled, required]
    );

    return (
      <FormFieldContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            formFieldVariants({ size }),
            horizontal && 'flex items-start gap-4',
            disabled && 'opacity-60',
            className
          )}
          {...props}
        >
          {/* Label */}
          {label && (
            <div
              className={cn(
                'flex items-center gap-1',
                horizontal ? 'shrink-0 pt-2' : 'mb-1.5',
                hideLabel && 'sr-only'
              )}
              style={horizontal ? { width: labelWidth } : undefined}
            >
              <label
                htmlFor={id}
                className={cn(
                  'text-sm font-medium text-foreground',
                  disabled && 'cursor-not-allowed'
                )}
              >
                {label}
              </label>

              {required && (
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              )}

              {optional && (
                <span className="text-xs text-muted-foreground">(tùy chọn)</span>
              )}

              {tooltip && (
                <button
                  type="button"
                  className="ml-1 text-muted-foreground hover:text-foreground"
                  aria-label={tooltip}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Input Container */}
          <div className={cn('flex-1', horizontal && 'space-y-1.5')}>
            {/* Input */}
            <div className="relative">
              {children}

              {/* Success Icon */}
              {success && !error && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg
                    className="h-5 w-5 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Error Icon */}
              {error && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              )}
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 text-sm text-destructive"
                  id={`${id}-error`}
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Helper Text */}
            {helperText && !error && (
              <p
                className="flex items-center gap-1 text-sm text-muted-foreground"
                id={`${id}-description`}
              >
                <Info className="h-3.5 w-3.5" />
                {helperText}
              </p>
            )}
          </div>
        </div>
      </FormFieldContext.Provider>
    );
  }
);

FormField.displayName = 'FormField';

// ===== FORM GROUP =====
interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group title */
  title?: string;
  /** Group description */
  description?: string;
}

const FormGroup = React.forwardRef<HTMLDivElement, FormGroupProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h3 className="text-lg font-medium text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div className="space-y-4">{children}</div>
      </div>
    );
  }
);

FormGroup.displayName = 'FormGroup';

// ===== FORM SECTION =====
interface FormSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Two-column layout */
  twoColumn?: boolean;
}

const FormSection = React.forwardRef<HTMLDivElement, FormSectionProps>(
  ({ className, title, description, twoColumn, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('rounded-lg border border-border p-6', className)}
        {...props}
      >
        {(title || description) && (
          <div className="mb-6 border-b border-border pb-4">
            {title && (
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}
        <div
          className={cn(
            'space-y-4',
            twoColumn && 'grid gap-4 sm:grid-cols-2 sm:gap-6 sm:space-y-0'
          )}
        >
          {children}
        </div>
      </section>
    );
  }
);

FormSection.displayName = 'FormSection';

// ===== EXPORTS =====
export { FormField, FormGroup, FormSection, formFieldVariants, FormFieldContext };
export default FormField;
