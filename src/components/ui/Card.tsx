import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3', // 12px
    md: 'p-4 sm:p-5', // 16px - 20px
    lg: 'p-6 sm:p-8', // 24px - 32px
  }[padding];

  return (
    <div
      className={`bg-ui-surface border border-ui-border rounded-lg shadow-subtle ${
        interactive
          ? 'transition-all duration-150 hover:border-brand-primary/40 hover:shadow-card cursor-pointer'
          : ''
      } ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

