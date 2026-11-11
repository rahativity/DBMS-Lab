'use client';

import * as React from 'react';
import { AttendanceFlowItem } from '@/types';
import { CHART_COLORS } from '../chart-theme';

export interface SankeyChartProps {
  data: AttendanceFlowItem[];
}

const statusColors: Record<string, string> = {
  Present: 'var(--status-present)',
  Absent: 'var(--status-absent)',
  Leave: 'var(--status-leave)',
};

export function SankeyChart({ data }: SankeyChartProps) {
  const [hoveredLink, setHoveredLink] = React.useState<{
    from: string;
    to: string;
    value: number;
  } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[260px] text-xs text-[var(--muted-foreground)]">
        No attendance flow records found
      </div>
    );
  }

  // Aggregate left nodes (from) and right nodes (to)
  const leftMap = new Map<string, number>();
  const rightMap = new Map<string, number>();
  let totalValue = 0;

  data.forEach((d) => {
    leftMap.set(d.from, (leftMap.get(d.from) || 0) + d.value);
    rightMap.set(d.to, (rightMap.get(d.to) || 0) + d.value);
    totalValue += d.value;
  });

  const width = 560;
  const height = 300;
  const nodeWidth = 12;
  const paddingY = 28;
  const availableHeight = height - paddingY * 2;

  // Layout left nodes (Departments)
  const leftNodes: { name: string; y: number; height: number; value: number; color: string }[] = [];
  let currentY = paddingY;
  const leftGap = 12;
  const totalLeftGaps = (leftMap.size - 1) * leftGap;
  const leftScale = (availableHeight - totalLeftGaps) / (totalValue || 1);

  Array.from(leftMap.entries()).forEach(([name, val], idx) => {
    const h = Math.max(10, val * leftScale);
    leftNodes.push({
      name,
      y: currentY,
      height: h,
      value: val,
      color: CHART_COLORS[idx % CHART_COLORS.length],
    });
    currentY += h + leftGap;
  });

  // Layout right nodes (Statuses)
  const rightNodes: { name: string; y: number; height: number; value: number; color: string }[] = [];
  currentY = paddingY;
  const rightGap = 18;
  const totalRightGaps = (rightMap.size - 1) * rightGap;
  const rightScale = (availableHeight - totalRightGaps) / (totalValue || 1);

  Array.from(rightMap.entries()).forEach(([name, val]) => {
    const h = Math.max(14, val * rightScale);
    rightNodes.push({
      name,
      y: currentY,
      height: h,
      value: val,
      color: statusColors[name] || 'var(--chart-1)',
    });
    currentY += h + rightGap;
  });

  // Calculate links
  const leftNodeOffsets: Record<string, number> = {};
  const rightNodeOffsets: Record<string, number> = {};
  leftNodes.forEach((n) => (leftNodeOffsets[n.name] = n.y));
  rightNodes.forEach((n) => (rightNodeOffsets[n.name] = n.y));

  const links = data
    .map((d) => {
      const leftNode = leftNodes.find((n) => n.name === d.from);
      const rightNode = rightNodes.find((n) => n.name === d.to);
      if (!leftNode || !rightNode) return null;

      const linkLeftH = Math.max(2, (d.value / (leftNode.value || 1)) * leftNode.height);
      const linkRightH = Math.max(2, (d.value / (rightNode.value || 1)) * rightNode.height);

      const sy0 = leftNodeOffsets[d.from];
      const sy1 = sy0 + linkLeftH;
      leftNodeOffsets[d.from] += linkLeftH;

      const ty0 = rightNodeOffsets[d.to];
      const ty1 = ty0 + linkRightH;
      rightNodeOffsets[d.to] += linkRightH;

      const x0 = 130 + nodeWidth;
      const x1 = width - 130;
      const xi = (x0 + x1) / 2;

      const pathD = `M ${x0} ${sy0} C ${xi} ${sy0}, ${xi} ${ty0}, ${x1} ${ty0} L ${x1} ${ty1} C ${xi} ${ty1}, ${xi} ${sy1}, ${x0} ${sy1} Z`;

      const gradientId = `flow-grad-${d.from.replace(/\s+/g, '-')}-${d.to}`;

      return {
        d: pathD,
        from: d.from,
        to: d.to,
        value: d.value,
        sourceColor: leftNode.color,
        targetColor: rightNode.color,
        gradientId,
      };
    })
    .filter(Boolean);

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[620px] h-auto">
        <defs>
          {links.map((link) => (
            <linearGradient
              key={link!.gradientId}
              id={link!.gradientId}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor={link!.sourceColor} stopOpacity="0.45" />
              <stop offset="100%" stopColor={link!.targetColor} stopOpacity="0.45" />
            </linearGradient>
          ))}
        </defs>

        {/* Links */}
        <g>
          {links.map((link, i) => {
            const isHovered =
              hoveredLink &&
              hoveredLink.from === link!.from &&
              hoveredLink.to === link!.to;
            const isDimmed = hoveredLink && !isHovered;

            return (
              <path
                key={i}
                d={link!.d}
                fill={`url(#${link!.gradientId})`}
                opacity={isHovered ? 0.9 : isDimmed ? 0.15 : 0.65}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() =>
                  setHoveredLink({
                    from: link!.from,
                    to: link!.to,
                    value: link!.value,
                  })
                }
                onMouseLeave={() => setHoveredLink(null)}
              />
            );
          })}
        </g>

        {/* Left Nodes (Departments) */}
        {leftNodes.map((n) => (
          <g key={n.name}>
            <rect
              x={130}
              y={n.y}
              width={nodeWidth}
              height={n.height}
              fill={n.color}
              rx={4}
              className="shadow-xs"
            />
            <text
              x={122}
              y={n.y + n.height / 2 + 3}
              textAnchor="end"
              fill="var(--foreground)"
              fontSize={11}
              fontWeight={600}
            >
              {n.name}
            </text>
            <text
              x={122}
              y={n.y + n.height / 2 + 15}
              textAnchor="end"
              fill="var(--muted-foreground)"
              fontSize={9}
              fontWeight={500}
            >
              {n.value} logs
            </text>
          </g>
        ))}

        {/* Right Nodes (Statuses) */}
        {rightNodes.map((n) => (
          <g key={n.name}>
            <rect
              x={width - 130}
              y={n.y}
              width={nodeWidth}
              height={n.height}
              fill={n.color}
              rx={4}
              className="shadow-xs"
            />
            <text
              x={width - 130 + nodeWidth + 8}
              y={n.y + n.height / 2 + 4}
              textAnchor="start"
              fill="var(--foreground)"
              fontSize={11}
              fontWeight={700}
            >
              {n.name}
            </text>
            <text
              x={width - 130 + nodeWidth + 8}
              y={n.y + n.height / 2 + 16}
              textAnchor="start"
              fill="var(--muted-foreground)"
              fontSize={10}
              fontWeight={600}
            >
              {n.value} ({totalValue > 0 ? ((n.value / totalValue) * 100).toFixed(0) : 0}%)
            </text>
          </g>
        ))}
      </svg>

      {/* Hover Floating Tooltip */}
      {hoveredLink && (
        <div className="absolute top-2 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md shadow-lg text-xs font-semibold flex items-center gap-2 pointer-events-none">
          <span className="text-blue-500">{hoveredLink.from}</span>
          <span className="text-[var(--muted-foreground)]">&rarr;</span>
          <span
            style={{
              color: statusColors[hoveredLink.to] || 'var(--foreground)',
            }}
          >
            {hoveredLink.to}
          </span>
          <span className="ml-1 px-1.5 py-0.2 rounded bg-[var(--muted)] text-[var(--foreground)] font-bold">
            {hoveredLink.value} logs
          </span>
        </div>
      )}
    </div>
  );
}
