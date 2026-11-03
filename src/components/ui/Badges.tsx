import React from 'react';
import { BloodGroup, UrgencyLevel, RequestStatus } from '@/types';

// Blood Group Badge: Crisp, identifiable, accessible
export interface BloodGroupBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'subtle' | 'outline';
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  group,
  size = 'md',
  variant = 'solid',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-12 font-bold rounded-sm tracking-wide',
    md: 'h-8 px-3 text-14 font-bold rounded-md tracking-wider',
    lg: 'h-10 px-4 text-18 font-bold rounded-md tracking-wider',
  }[size];

  const variantClasses = {
    solid: 'bg-brand-primary text-white border border-brand-primary shadow-subtle',
    subtle: 'bg-brand-light text-brand-primary border border-brand-secondary/30',
    outline: 'bg-ui-surface text-brand-primary border border-brand-primary/40',
  }[variant];

  return (
    <span
      className={`inline-flex items-center justify-center font-sans select-none ${sizeClasses} ${variantClasses} ${className}`}
    >
      {group}
    </span>
  );
};

// Urgency Badge: Follows semantic colors with distinct subtle backgrounds
export interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: 'sm' | 'md';
  className?: string;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-12 font-semibold rounded-sm gap-1',
    md: 'h-7 px-3 text-12 font-semibold rounded-md gap-1.5',
  }[size];

  switch (urgency) {
    case 'URGENT':
      return (
        <span
          className={`inline-flex items-center bg-semantic-error-subtle text-semantic-error border border-[#F8C8C8] select-none ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-semantic-error animate-pulse" />
          URGENT
        </span>
      );
    case 'TODAY':
      return (
        <span
          className={`inline-flex items-center bg-semantic-warning-subtle text-semantic-warning border border-[#FCDCA3] select-none ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-semantic-warning" />
          Today
        </span>
      );
    case 'WITHIN_24H':
      return (
        <span
          className={`inline-flex items-center bg-semantic-info-subtle text-semantic-info border border-[#C6DDFC] select-none ${sizeClasses} ${className}`}
        >
          Within 24h
        </span>
      );
    case 'WITHIN_3_DAYS':
      return (
        <span
          className={`inline-flex items-center bg-ui-bg text-ink-secondary border border-ui-border select-none ${sizeClasses} ${className}`}
        >
          Within 3 days
        </span>
      );
    case 'SCHEDULED':
    default:
      return (
        <span
          className={`inline-flex items-center bg-brand-light text-brand-primary border border-brand-secondary/30 select-none ${sizeClasses} ${className}`}
        >
          Scheduled
        </span>
      );
  }
};

// Request Status Badge
export interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 px-2 text-12 font-medium rounded-sm gap-1.5',
    md: 'h-7 px-3 text-12 font-medium rounded-md gap-2',
  }[size];

  switch (status) {
    case 'Active':
      return (
        <span
          className={`inline-flex items-center bg-semantic-success-subtle text-semantic-success border border-[#C7E9D9] select-none ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
          Active
        </span>
      );
    case 'Partially Fulfilled':
      return (
        <span
          className={`inline-flex items-center bg-semantic-warning-subtle text-semantic-warning border border-[#FCDCA3] select-none ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-semantic-warning" />
          Partially Fulfilled
        </span>
      );
    case 'Fulfilled':
      return (
        <span
          className={`inline-flex items-center bg-[#EBF8F2] text-semantic-success border border-[#BCE8D3] select-none ${sizeClasses} ${className}`}
        >
          <svg className="w-3.5 h-3.5 text-semantic-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Fulfilled
        </span>
      );
    case 'Cancelled':
      return (
        <span
          className={`inline-flex items-center bg-semantic-error-subtle text-semantic-error border border-[#F8C8C8] select-none ${sizeClasses} ${className}`}
        >
          Cancelled
        </span>
      );
    case 'Expired':
    default:
      return (
        <span
          className={`inline-flex items-center bg-ui-bg text-ink-muted border border-ui-border select-none ${sizeClasses} ${className}`}
        >
          Expired
        </span>
      );
  }
};

