'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '@/types';

interface ToastContextType {
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastMessage['type'], title: string, description?: string) => {
      const id = 'toast-' + Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, type, title, description };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const icon = {
            success: <CheckCircle2 className="w-5 h-5 text-semantic-success flex-shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-semantic-error flex-shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-semantic-warning flex-shrink-0" />,
            info: <Info className="w-5 h-5 text-semantic-info flex-shrink-0" />,
          }[toast.type];

          const borderColors = {
            success: 'border-[#BCE8D3]',
            error: 'border-[#F8C8C8]',
            warning: 'border-[#FCDCA3]',
            info: 'border-[#C6DDFC]',
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-ui-surface border ${borderColors} rounded-lg shadow-dropdown p-4 flex items-start gap-3 transition-all animate-in slide-in-from-bottom-3 duration-200`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1">
                <h4 className="text-14 font-semibold text-ink-primary leading-tight">
                  {toast.title}
                </h4>
                {toast.description && (
                  <p className="mt-1 text-12 text-ink-secondary leading-normal">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-ink-muted hover:text-ink-primary p-0.5 rounded-sm transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

