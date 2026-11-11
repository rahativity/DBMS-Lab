'use client';

import * as React from 'react';

export interface SparklineProps {
  data: number[];
  width?: number | string;
  height?: number;
  className?: string;
  color?: string;
}

export function Sparkline({
  data,
  width = '100%',
  height = 36,
  className = '',
  color = 'var(--chart-1)',
}: SparklineProps) {
  const gradientId = React.useId();

  if (!data || data.length < 2) {
    return <div style={{ height }} className="w-full bg-[var(--muted)]/30 rounded" />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const svgWidth = 140;
  const svgHeight = height;
  const paddingY = 4;
  const paddingX = 4;

  const points = data.map((val, idx) => {
    const x = paddingX + (idx / (data.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - ((val - min) / range) * (svgHeight - paddingY * 2);
    return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
  });

  const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaD = `${pathD} L ${points[points.length - 1].x},${svgHeight} L ${points[0].x},${svgHeight} Z`;
  const lastPoint = points[points.length - 1];

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
        style={{ height }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Smooth line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Endpoint marker with pulse */}
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={color}
          stroke="var(--card)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
