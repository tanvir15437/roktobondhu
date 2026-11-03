import React from 'react';

export interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[] | string[];
  helperText?: string;
  error?: string;
  placeholder?: string;
  requiredIndicator?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      helperText,
      error,
      placeholder,
      requiredIndicator = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-14 font-semibold text-ink-primary mb-1 select-none"
          >
            {label}
            {requiredIndicator && <span className="text-semantic-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={`w-full h-10 px-3 pr-8 text-14 text-ink-primary bg-ui-surface border rounded-md transition-colors appearance-none cursor-pointer ${
              error
                ? 'border-semantic-error focus:border-semantic-error focus:ring-1 focus:ring-semantic-error'
                : 'border-ui-border hover:border-ink-muted focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
            } disabled:bg-ui-bg disabled:text-ink-muted disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const val = typeof opt === 'string' ? opt : opt.value;
              const lbl = typeof opt === 'string' ? opt : opt.label;
              return (
                <option key={val} value={val}>
                  {lbl}
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink-muted">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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

Select.displayName = 'Select';

