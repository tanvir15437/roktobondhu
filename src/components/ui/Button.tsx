import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      loading = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Exact sizing tokens matching strict spacing (4, 8, 12, 16, 20, 24) and font sizes (12, 14, 16)
    const sizeClasses = {
      sm: 'h-8 px-3 text-12 font-medium gap-1 rounded-md',
      md: 'h-10 px-4 text-14 font-semibold gap-2 rounded-md',
      lg: 'h-12 px-6 text-16 font-semibold gap-2 rounded-lg',
    }[size];

    const variantClasses = {
      primary:
        'bg-brand-primary text-white hover:bg-brand-dark active:bg-brand-dark shadow-subtle border border-transparent disabled:bg-brand-primary/50 disabled:cursor-not-allowed',
      secondary:
        'bg-brand-light text-brand-primary hover:bg-brand-secondary/20 active:bg-brand-secondary/30 border border-transparent disabled:opacity-50',
      outline:
        'bg-ui-surface text-ink-primary hover:bg-ui-bg border border-ui-border active:border-brand-primary disabled:opacity-50',
      ghost:
        'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-ui-border/30 active:bg-ui-border/50 disabled:opacity-50',
      danger:
        'bg-semantic-error text-white hover:bg-[#C23838] active:bg-[#A92E2E] shadow-subtle border border-transparent disabled:opacity-50',
      success:
        'bg-semantic-success text-white hover:bg-[#127049] active:bg-[#0E5B3B] shadow-subtle border border-transparent disabled:opacity-50',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center transition-colors duration-150 select-none ${sizeClasses} ${variantClasses} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

