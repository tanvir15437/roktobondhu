import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pills';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'line',
  className = '',
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 p-1 bg-ui-bg rounded-lg border border-ui-border ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-14 font-medium transition-all ${
                isActive
                  ? 'bg-ui-surface text-brand-primary shadow-subtle border border-ui-border font-semibold'
                  : 'text-ink-secondary hover:text-ink-primary hover:bg-ui-surface/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-12 px-1.5 py-0.2 rounded-sm ${
                    isActive
                      ? 'bg-brand-light text-brand-primary font-semibold'
                      : 'bg-ui-border/50 text-ink-muted'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex border-b border-ui-border overflow-x-auto no-scrollbar gap-6 ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 pb-3 text-14 font-medium transition-colors relative whitespace-nowrap ${
              isActive
                ? 'text-brand-primary font-semibold'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-12 px-1.5 py-0.5 rounded-sm ${
                  isActive
                    ? 'bg-brand-light text-brand-primary font-semibold'
                    : 'bg-ui-bg text-ink-muted border border-ui-border'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-sm" />
            )}
          </button>
        );
      })}
    </div>
  );
};

