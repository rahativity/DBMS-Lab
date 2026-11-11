'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { StatusDistribution } from '@/types';

const statusColorMap: Record<string, string> = {
  Present: 'var(--status-present)',
  Absent: 'var(--status-absent)',
  Leave: 'var(--status-leave)',
};

export function AttendanceDonut({ data }: { data: StatusDistribution[] }) {
  if (!data || data.length === 0) return null;

  const totalLogs = data.reduce((acc, curr) => acc + (curr.count || 0), 0);

  return (
    <div className="relative w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="46%"
            innerRadius={62}
            outerRadius={88}
            paddingAngle={4}
            cornerRadius={5}
            stroke="var(--card)"
            strokeWidth={3}
            animationDuration={900}
          >
            {data.map((entry, index) => {
              const fill =
                statusColorMap[entry.status] ||
                `var(--chart-${(index % 7) + 1})`;
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`${value} logs`, 'Count']}
            contentStyle={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              borderRadius: '0.75rem',
              color: 'var(--foreground)',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(val: string) => (
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {val}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Centered Summary Text in Donut Aperture */}
      <div className="absolute inset-0 top-0 bottom-8 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
          {totalLogs}
        </span>
        <span className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">
          Total Logs
        </span>
      </div>
    </div>
  );
}
