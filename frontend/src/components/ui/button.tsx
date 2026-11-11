'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/50 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          {
            'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 shadow-xs':
              variant === 'default',
            'bg-blue-600 hover:bg-blue-700 text-white shadow-xs':
              variant === 'primary',
            'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--muted-foreground)]/30 shadow-2xs':
              variant === 'outline',
            'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]':
              variant === 'secondary',
            'text-[var(--foreground)] hover:bg-[var(--muted)]':
              variant === 'ghost',
            'bg-rose-600 hover:bg-rose-700 text-white shadow-xs':
              variant === 'danger',
          },
          {
            'h-8 px-2.5 text-xs gap-1.5': size === 'sm',
            'h-9 px-3.5 text-sm gap-2': size === 'md',
            'h-10 px-4 text-base gap-2.5': size === 'lg',
            'h-9 w-9 p-0': size === 'icon',
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
