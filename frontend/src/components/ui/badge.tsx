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
      dotColor = 'bg-[#4b7273] dark:bg-[#86b9b1]';
    } else if (status === 'Leave') {
      effectiveVariant = 'leave';
      dotColor = 'bg-[#86b9b1] dark:bg-[#a4cec7]';
    } else if (status === 'Absent') {
      effectiveVariant = 'absent';
      dotColor = 'bg-[#7b8f91] dark:bg-[#5e8a8b]';
    }
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-normal transition-colors',
        {
          'bg-[#e2eceb] text-[#042631] border border-[#cfd6d6] dark:bg-[#86b9b122] dark:text-[#86b9b1] dark:border-[#144450]':
            effectiveVariant === 'present',
          'bg-[#edf5f4] text-[#042631] border border-[#cfd6d6] dark:bg-[#a4cec722] dark:text-[#a4cec7] dark:border-[#144450]':
            effectiveVariant === 'leave',
          'bg-[#dee5e5] text-[#041420] border border-[#cfd6d6] dark:bg-[#5e8a8b22] dark:text-[#cfd6d6] dark:border-[#144450]':
            effectiveVariant === 'absent',
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
