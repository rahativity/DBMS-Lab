'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PayrollByDepartment } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function PayrollStackedBar({ data }: { data: PayrollByDepartment[] }) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          opacity={0.4}
          vertical={false}
        />
        <XAxis
          dataKey="departmentName"
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
          tickFormatter={(val) => `$${val / 1000}k`}
        />
        <Tooltip
          formatter={(value: any, name: any) => [
            formatCurrency(Number(value)),
            name === 'basicTotal' ? 'Basic Salary' : 'Bonus Package',
          ]}
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
            <span className="text-xs font-semibold text-[var(--foreground)]">
              {val === 'basicTotal' ? 'Basic Salary' : 'Bonus Allocation'}
            </span>
          )}
        />
        <Bar
          dataKey="basicTotal"
          stackId="a"
          fill="var(--chart-1)"
          animationDuration={900}
        />
        <Bar
          dataKey="bonusTotal"
          stackId="a"
          fill="var(--chart-3)"
          radius={[6, 6, 0, 0]}
          animationDuration={900}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
