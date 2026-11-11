'use client';

import * as React from 'react';

// Cohesive 5-color Nordic Teal & Slate palette from user image
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
  Leave: 'var(--status-leave)',
  Absent: 'var(--status-absent)',
};

/**
 * Global SVG gradients using the exact palette
 */
export function ChartGradients() {
  return (
    <svg width="0" height="0" className="absolute -z-50 pointer-events-none opacity-0" aria-hidden="true">
      <defs>
        {/* Chart 1 Gradient (Seafoam Sage) */}
        <linearGradient id="gradient-chart-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.02" />
        </linearGradient>

        {/* Chart 2 Gradient (Slate Teal) */}
        <linearGradient id="gradient-chart-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--chart-2)" stopOpacity="0.02" />
        </linearGradient>

        {/* Chart 3 Gradient (Muted Aqua) */}
        <linearGradient id="gradient-chart-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-3)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--chart-3)" stopOpacity="0.02" />
        </linearGradient>

        {/* Status Present Gradient */}
        <linearGradient id="gradient-present" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--status-present)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--status-present)" stopOpacity="0.04" />
        </linearGradient>

        {/* Status Leave Gradient */}
        <linearGradient id="gradient-leave" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--status-leave)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--status-leave)" stopOpacity="0.03" />
        </linearGradient>

        {/* Status Absent Gradient */}
        <linearGradient id="gradient-absent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--status-absent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--status-absent)" stopOpacity="0.02" />
        </linearGradient>

        {/* Subtle Glow Filter */}
        <filter id="glow-teal" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--chart-1)" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
}
