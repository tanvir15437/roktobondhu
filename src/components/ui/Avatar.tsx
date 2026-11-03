import React from 'react';

export interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  availabilityStatus?: 'Available' | 'Unavailable';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  size = 'md',
  availabilityStatus,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-12 font-bold',
    md: 'w-10 h-10 text-14 font-bold',
    lg: 'w-14 h-14 text-18 font-bold',
    xl: 'w-20 h-20 text-24 font-bold',
  }[size];

  const dotClasses = {
    sm: 'w-2.5 h-2.5 ring-1.5',
    md: 'w-3 h-3 ring-2',
    lg: 'w-3.5 h-3.5 ring-2',
    xl: 'w-4 h-4 ring-2',
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      <div
        className={`${sizeClasses} rounded-lg bg-brand-light text-brand-primary border border-brand-secondary/20 flex items-center justify-center`}
      >
        {initials}
      </div>
      {availabilityStatus && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dotClasses} rounded-full ring-ui-surface ${
            availabilityStatus === 'Available' ? 'bg-semantic-success' : 'bg-ink-muted'
          }`}
          title={`Status: ${availabilityStatus}`}
        />
      )}
    </div>
  );
};

