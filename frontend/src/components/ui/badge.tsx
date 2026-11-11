'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'outline' | 'muted' | 'dashed' | 'present' | 'absent' | 'leave';
  status?: 'Present' | 'Absent' | 'Leave' | string;
}

export function Badge({
  className,
  variant,
  status,
  children,
  ...props
}: BadgeProps) {
  let effectiveVariant = variant || 'muted';
  let dotColor: string | null = null;

  if (status) {
    if (status === 'Present') {
      effectiveVariant = 'present';
      dotColor = 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
    } else if (status === 'Absent') {
      effectiveVariant = 'absent';
      dotColor = 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
    } else if (status === 'Leave') {
      effectiveVariant = 'leave';
      dotColor = 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    }
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-normal transition-colors',
        {
          'bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50':
            effectiveVariant === 'present',
          'bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50':
            effectiveVariant === 'absent',
          'bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50':
            effectiveVariant === 'leave',
          'bg-[var(--foreground)] text-[var(--background)]':
            effectiveVariant === 'solid',
          'border border-[var(--border)] text-[var(--foreground)] bg-transparent':
            effectiveVariant === 'outline',
          'bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--border)]':
            effectiveVariant === 'muted',
          'border border-dashed border-[var(--border)] text-[var(--foreground)] bg-transparent':
            effectiveVariant === 'dashed',
        },
        className,
      )}
      {...props}
    >
      {dotColor && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColor)} />}
      <span>{children || status}</span>
    </div>
  );
}
