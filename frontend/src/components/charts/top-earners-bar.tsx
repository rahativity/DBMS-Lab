'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TopEarner } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function TopEarnersBar({ data }: { data: TopEarner[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          horizontal={false}
        />
        <XAxis
          type="number"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <YAxis
          dataKey="employeeName"
          type="category"
          stroke="transparent"
          width={90}
          tick={{ fill: 'var(--foreground)', fontSize: 11 }}
        />
        <Tooltip
          formatter={(value: any) => [formatCurrency(Number(value)), 'Total Package']}
          contentStyle={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            borderRadius: '0.75rem',
            color: 'var(--foreground)',
            fontSize: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Bar
          dataKey="totalCompensation"
          radius={[0, 6, 6, 0]}
          animationDuration={900}
        >
          {data.map((_, index) => {
            const fill =
              index === 0
                ? 'var(--chart-1)'
                : index === 1
                ? 'var(--chart-2)'
                : index === 2
                ? 'var(--chart-3)'
                : 'var(--chart-4)';
            return <Cell key={`cell-${index}`} fill={fill} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
