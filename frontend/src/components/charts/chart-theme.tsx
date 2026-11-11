'use client';

import * as React from 'react';

// Harmonized chromatic palette
export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
];

export const STATUS_COLORS = {
  Present: 'var(--status-present)',
  Absent: 'var(--status-absent)',
  Leave: 'var(--status-leave)',
};

export const DARK_SHADES = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-5)',
  muted: 'var(--chart-6)',
};

/**
 * Global SVG defs for smooth vertical gradients across Recharts and custom visualizations
 */
export function ChartGradients() {
  return (
    <svg width="0" height="0" className="absolute -z-50 pointer-events-none opacity-0" aria-hidden="true">
      <defs>
        {/* Chart 1 Gradient (Sapphire Blue) */}
        <linearGradient id="gradient-chart-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.02" />
        </linearGradient>

        {/* Chart 2 Gradient (Teal) */}
        <linearGradient id="gradient-chart-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.02" />
        </linearGradient>

        {/* Chart 3 Gradient (Amber) */}
        <linearGradient id="gradient-chart-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0.02" />
        </linearGradient>

        {/* Status Present (Emerald) */}
        <linearGradient id="gradient-present" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--status-present)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--status-present)" stopOpacity="0.03" />
        </linearGradient>

        {/* Status Absent (Coral/Rose) */}
        <linearGradient id="gradient-absent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--status-absent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--status-absent)" stopOpacity="0.03" />
        </linearGradient>

        {/* Status Leave (Amber) */}
        <linearGradient id="gradient-leave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--status-leave)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--status-leave)" stopOpacity="0.03" />
        </linearGradient>

        {/* Glow Filters */}
        <filter id="glow-primary" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--chart-1)" floodOpacity="0.3" />
        </filter>
        <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--status-present)" floodOpacity="0.35" />
        </filter>
      </defs>
    </svg>
  );
}

export function ChartPatterns() {
  return null;
}

export function CustomTooltipContent({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
  formatter?: (val: any) => string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md p-3 shadow-xl text-xs min-w-[140px]">
      {label && (
        <p className="font-semibold text-[var(--foreground)] mb-1.5 pb-1 border-b border-[var(--border)]/70">
          {label}
        </p>
      )}
      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="text-[var(--muted-foreground)] flex items-center gap-1.5 font-medium">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-xs inline-block"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name || 'Value'}:
            </span>
            <span className="font-semibold text-[var(--foreground)] tabular-nums">
              {formatter ? formatter(entry.value) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
