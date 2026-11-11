'use client';

import * as React from 'react';

export interface GaugeChartProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export function GaugeChart({
  value,
  size = 230,
  strokeWidth = 14,
}: GaugeChartProps) {
  const clampedValue = Math.min(100, Math.max(0, value || 0));
  const viewBoxSize = 240;
  const center = viewBoxSize / 2;
  const radius = 80;

  // Clockwise arc from bottom-left (140 deg) across the top (270 deg) to bottom-right (400 deg)
  const startAngle = 140;
  const sweepAngle = 260; // 400 - 140 = 260 deg

  const polarToCartesian = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: Number((center + r * Math.cos(rad)).toFixed(2)),
      y: Number((center + r * Math.sin(rad)).toFixed(2)),
    };
  };

  const describeClockwiseArc = (startDeg: number, deltaDeg: number, r: number) => {
    const endDeg = startDeg + deltaDeg;
    const startPt = polarToCartesian(startDeg, r);
    const endPt = polarToCartesian(endDeg, r);
    const largeArc = deltaDeg > 180 ? 1 : 0;
    return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
  };

  const trackArc = describeClockwiseArc(startAngle, sweepAngle, radius);
  const activeSweep = Math.max(1, (clampedValue / 100) * sweepAngle);
  const progressArc = describeClockwiseArc(startAngle, activeSweep, radius);

  // Status tiers
  let tierColor = '#10b981'; // Emerald
  let tierGlow = 'rgba(16, 185, 129, 0.4)';
  let tierLabel = 'Optimal Target';
  let tierBg =
    'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';

  if (clampedValue < 70) {
    tierColor = '#f43f5e'; // Rose
    tierGlow = 'rgba(244, 63, 94, 0.4)';
    tierLabel = 'Action Required';
    tierBg =
      'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/40';
  } else if (clampedValue < 85) {
    tierColor = '#f59e0b'; // Amber
    tierGlow = 'rgba(245, 158, 11, 0.4)';
    tierLabel = 'Moderate Range';
    tierBg =
      'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/40';
  }

  // Ticks at 0% (140°), 50% (270°), 100% (400°)
  const ticks = [
    { percent: 0, deg: 140, label: '0%' },
    { percent: 50, deg: 270, label: '50%' },
    { percent: 100, deg: 400, label: '100%' },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          width="100%"
          height="100%"
          className="overflow-visible"
        >
          {/* Background Track */}
          <path
            d={trackArc}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d={progressArc}
            fill="none"
            stroke={tierColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${tierGlow})`,
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Tick Labels */}
          {ticks.map((t) => {
            const pt = polarToCartesian(t.deg, radius + strokeWidth + 8);
            return (
              <text
                key={t.percent}
                x={pt.x}
                y={pt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[var(--muted-foreground)] text-[10px] font-semibold select-none"
              >
                {t.label}
              </text>
            );
          })}
        </svg>

        {/* Center Metric Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
            {clampedValue.toFixed(1)}%
          </span>
          <span className="text-[11px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mt-0.5">
            Attendance Rate
          </span>
          <div
            className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tierBg} flex items-center gap-1.5 shadow-2xs`}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: tierColor }}
            />
            {tierLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
