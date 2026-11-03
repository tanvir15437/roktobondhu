import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-ui-border rounded-lg bg-ui-surface/60 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-16 font-bold text-ink-primary mb-1">{title}</h3>
      <p className="text-14 text-ink-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

