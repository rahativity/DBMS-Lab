'use client';

import * as React from 'react';
import { AttendanceHeatmapItem } from '@/types';

export interface HeatmapChartProps {
  data: AttendanceHeatmapItem[];
}

export function HeatmapChart({ data }: HeatmapChartProps) {
  const [tooltip, setTooltip] = React.useState<{
    x: number;
    y: number;
    name: string;
    date: string;
    status: string;
  } | null>(null);

  // Memoize data extraction to prevent heavy re-render recalculation on cell hover
  const { employees, dates, lookup } = React.useMemo(() => {
    if (!data || data.length === 0) {
      return { employees: [], dates: [], lookup: new Map<string, string>() };
    }

    const employeesMap = new Map<number, string>();
    const datesSet = new Set<string>();
    const lookupMap = new Map<string, string>();

    data.forEach((item) => {
      employeesMap.set(item.employeeId, item.employeeName);
      datesSet.add(item.date);
      lookupMap.set(`${item.employeeId}_${item.date}`, item.status);
    });

    return {
      employees: Array.from(employeesMap.entries()).map(([id, name]) => ({
        id,
        name,
      })),
      dates: Array.from(datesSet).sort(),
      lookup: lookupMap,
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[220px] text-xs text-[var(--muted-foreground)]">
        No attendance heatmap data recorded
      </div>
    );
  }

  const cellSize = 20;
  const cellGap = 4;
  const nameWidth = 130;
  const headerHeight = 32;

  const totalWidth = nameWidth + dates.length * (cellSize + cellGap) + 24;
  const totalHeight = headerHeight + employees.length * (cellSize + cellGap) + 20;

  return (
    <div className="relative w-full overflow-x-auto pb-2">
      <svg
        width={Math.max(640, totalWidth)}
        height={totalHeight}
        className="font-sans text-[11px]"
        role="grid"
        aria-label="Attendance Heatmap Grid"
      >
        {/* Date Headers */}
        {dates.map((d, colIndex) => {
          const x = nameWidth + colIndex * (cellSize + cellGap);
          const showLabel = dates.length <= 15 || colIndex % 4 === 0;
          return (
            <g key={d}>
              {showLabel && (
                <text
                  x={x + cellSize / 2}
                  y={headerHeight - 10}
                  textAnchor="middle"
                  fill="var(--muted-foreground)"
                  className="text-[10px] font-medium"
                >
                  {d.slice(5)}
                </text>
              )}
            </g>
          );
        })}

        {/* Rows */}
        {employees.map((emp, rowIndex) => {
          const y = headerHeight + rowIndex * (cellSize + cellGap);
          return (
            <g key={emp.id} role="row">
              {/* Employee Name */}
              <text
                x={nameWidth - 10}
                y={y + cellSize / 2 + 4}
                textAnchor="end"
                fill="var(--foreground)"
                className="text-[11px] font-semibold"
              >
                {emp.name.length > 15 ? `${emp.name.slice(0, 14)}…` : emp.name}
              </text>

              {/* Cells */}
              {dates.map((date, colIndex) => {
                const x = nameWidth + colIndex * (cellSize + cellGap);
                const status = lookup.get(`${emp.id}_${date}`);

                let fill = 'var(--muted)';
                let stroke = 'var(--border)';

                if (status === 'Present') {
                  fill = 'var(--status-present)';
                  stroke = 'rgba(75, 114, 115, 0.4)';
                } else if (status === 'Leave') {
                  fill = 'var(--status-leave)';
                  stroke = 'rgba(134, 185, 177, 0.4)';
                } else if (status === 'Absent') {
                  fill = 'var(--status-absent)';
                  stroke = 'rgba(123, 143, 145, 0.4)';
                }

                return (
                  <rect
                    key={`${emp.id}_${date}`}
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    rx={5}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={1}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`${emp.name}, ${date}: ${status || 'No record'}`}
                    className="cursor-pointer transition-all duration-150 hover:scale-110 hover:opacity-90 focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        name: emp.name,
                        date,
                        status: status || 'No Record',
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onFocus={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        name: emp.name,
                        date,
                        status: status || 'No Record',
                      });
                    }}
                    onBlur={() => setTooltip(null)}
                  />
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="pointer-events-none z-50 rounded-xl border border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md px-3 py-2 shadow-xl whitespace-nowrap text-xs space-y-0.5"
        >
          <p className="font-bold text-[var(--foreground)]">{tooltip.name}</p>
          <div className="flex items-center gap-2 text-[var(--muted-foreground)] text-[11px]">
            <span>{tooltip.date}</span>
            <span>•</span>
            <span
              className={
                tooltip.status === 'Present'
                  ? 'text-[#4b7273] dark:text-[#86b9b1] font-semibold'
                  : tooltip.status === 'Absent'
                  ? 'text-[#7b8f91] dark:text-[#cfd6d6] font-semibold'
                  : 'text-[#62928e] dark:text-[#a4cec7] font-semibold'
              }
            >
              {tooltip.status}
            </span>
          </div>
        </div>
      )}

      {/* Modern Legend */}
      <div className="flex items-center gap-6 mt-3 text-xs text-[var(--muted-foreground)] pl-2 border-t border-[var(--border)]/50 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[var(--status-present)] shadow-xs" />
          <span className="font-medium text-[var(--foreground)]">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[var(--status-leave)] shadow-xs" />
          <span className="font-medium text-[var(--foreground)]">Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm bg-[var(--status-absent)] shadow-xs" />
          <span className="font-medium text-[var(--foreground)]">Absent</span>
        </div>
      </div>
    </div>
  );
}
