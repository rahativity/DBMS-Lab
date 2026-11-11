'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DailyTrend } from '@/types';

export function DailyTrendStackedArea({ data }: { data: DailyTrend[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.5}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(d: string) => d.slice(5)}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <Tooltip
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
          height={32}
          iconType="circle"
          formatter={(val: string) => (
            <span className="text-xs font-semibold text-[var(--foreground)] capitalize">
              {val}
            </span>
          )}
        />
        <Area
          type="monotone"
          dataKey="present"
          name="Present"
          stackId="1"
          stroke="var(--status-present)"
          strokeWidth={2}
          fill="url(#gradient-present)"
          fillOpacity={1}
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="leave"
          name="Leave"
          stackId="1"
          stroke="var(--status-leave)"
          strokeWidth={2}
          fill="url(#gradient-leave)"
          fillOpacity={1}
          animationDuration={900}
        />
        <Area
          type="monotone"
          dataKey="absent"
          name="Absent"
          stackId="1"
          stroke="var(--status-absent)"
          strokeWidth={2}
          fill="url(#gradient-absent)"
          fillOpacity={1}
          animationDuration={900}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
