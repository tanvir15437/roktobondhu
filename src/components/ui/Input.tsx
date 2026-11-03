import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  requiredIndicator?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      requiredIndicator = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-14 font-semibold text-ink-primary mb-1 select-none"
          >
            {label}
            {requiredIndicator && <span className="text-semantic-error ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-ink-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full h-10 px-3 text-14 text-ink-primary bg-ui-surface border rounded-md transition-colors placeholder:text-ink-muted ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-semantic-error focus:border-semantic-error focus:ring-1 focus:ring-semantic-error'
                : 'border-ui-border hover:border-ink-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
            } disabled:bg-ui-bg disabled:text-ink-muted disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-ink-muted flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-12 font-medium text-semantic-error">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-12 text-ink-secondary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

