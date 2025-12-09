'use client';

import { useState, useCallback } from 'react';

import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils/cn';

export function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: { id: string; message: string; type: string };
  onDismiss: () => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      role="alert"
      className={cn(
        'flex min-w-[280px] max-w-sm items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium shadow-lg',
        'animate-slide-in-right',
        'transition-all duration-fast ease-standard',
        isHovered && 'shadow-card-hover',
        toast.type === 'error' && 'bg-error text-white',
        toast.type === 'success' && 'bg-success text-white',
        toast.type === 'warning' && 'bg-warning text-white',
        toast.type === 'info' && 'bg-info text-white'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status icon */}
      <span className="flex-none">
        {toast.type === 'success' && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {toast.type === 'error' && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {toast.type === 'warning' && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        {toast.type === 'info' && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </span>

      <span className="flex-1">{toast.message}</span>

      <button
        onClick={onDismiss}
        className="flex-none rounded p-0.5 opacity-70 transition-opacity duration-fast ease-standard hover:opacity-100
                   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        aria-label="Dismiss notification"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
