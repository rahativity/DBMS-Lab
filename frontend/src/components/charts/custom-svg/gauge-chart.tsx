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

  // Status tiers matching the 5-color palette
  let tierColor = '#86b9b1'; // Seafoam Sage
  let tierGlow = 'rgba(134, 185, 177, 0.45)';
  let tierLabel = 'Optimal Target';
  let tierBg =
    'bg-[#e2eceb] text-[#042631] dark:bg-[#86b9b122] dark:text-[#86b9b1] border-[#cfd6d6] dark:border-[#144450]';

  if (clampedValue < 70) {
    tierColor = '#4b7273'; // Slate Teal
    tierGlow = 'rgba(75, 114, 115, 0.45)';
    tierLabel = 'Action Required';
    tierBg =
      'bg-[#dee5e5] text-[#041420] dark:bg-[#0d3844] dark:text-[#cfd6d6] border-[#cfd6d6] dark:border-[#144450]';
  } else if (clampedValue < 85) {
    tierColor = '#62928e'; // Muted Aqua
    tierGlow = 'rgba(98, 146, 142, 0.45)';
    tierLabel = 'Moderate Range';
    tierBg =
      'bg-[#edf5f4] text-[#042631] dark:bg-[#a4cec722] dark:text-[#a4cec7] border-[#cfd6d6] dark:border-[#144450]';
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
