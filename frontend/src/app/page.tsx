'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Building2,
  Banknote,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { api } from '@/lib/api';
import {
  DashboardSummary,
  StatusDistribution,
  HeadcountByDepartment,
  PayrollByDepartment,
  DailyTrend,
  TopEarner,
} from '@/types';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { Sparkline } from '@/components/charts/custom-svg/sparkline';
import { GaugeChart } from '@/components/charts/custom-svg/gauge-chart';
import { ChartCard } from '@/components/charts/chart-card';
import { AttendanceDonut } from '@/components/charts/attendance-donut';
import { HeadcountHorizontalBar } from '@/components/charts/headcount-horizontal-bar';
import { PayrollStackedBar } from '@/components/charts/payroll-stacked-bar';
import { DailyTrendStackedArea } from '@/components/charts/daily-trend-stacked-area';
import { TopEarnersBar } from '@/components/charts/top-earners-bar';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);
  const [statusDist, setStatusDist] = React.useState<StatusDistribution[]>([]);
  const [headcount, setHeadcount] = React.useState<HeadcountByDepartment[]>([]);
  const [payroll, setPayroll] = React.useState<PayrollByDepartment[]>([]);
  const [dailyTrend, setDailyTrend] = React.useState<DailyTrend[]>([]);
  const [topEarners, setTopEarners] = React.useState<TopEarner[]>([]);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sumRes, distRes, headRes, payRes, trendRes, earnersRes] =
          await Promise.allSettled([
            api.dashboard.getSummary(),
            api.analytics.getStatusDistribution(),
            api.analytics.getHeadcountByDepartment(),
            api.analytics.getPayrollByDepartment(),
            api.analytics.getDailyTrend(),
            api.analytics.getTopEarners(10),
          ]);

        if (sumRes.status === 'fulfilled') setSummary(sumRes.value);
        if (distRes.status === 'fulfilled') setStatusDist(distRes.value);
        if (headRes.status === 'fulfilled') setHeadcount(headRes.value);
        if (payRes.status === 'fulfilled') setPayroll(payRes.value);
        if (trendRes.status === 'fulfilled') setDailyTrend(trendRes.value);
        if (earnersRes.status === 'fulfilled') setTopEarners(earnersRes.value);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const kpis = [
    {
      title: 'Total Workforce',
      value: summary?.totalEmployees ?? 0,
      formatter: formatNumber,
      sparkline: summary?.sparklines?.employees || [],
      icon: Users,
      badge: 'Active Staff',
      color: 'var(--chart-1)',
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40',
    },
    {
      title: 'Active Departments',
      value: summary?.totalDepartments ?? 0,
      formatter: formatNumber,
      sparkline: summary?.sparklines?.departments || [],
      icon: Building2,
      badge: 'Organizational Units',
      color: 'var(--chart-2)',
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40',
    },
    {
      title: 'Monthly Payroll',
      value: summary?.totalPayroll ?? 0,
      formatter: formatCurrency,
      sparkline: summary?.sparklines?.payroll || [],
      icon: Banknote,
      badge: 'Disbursed',
      color: 'var(--chart-3)',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40',
    },
    {
      title: 'Average Salary',
      value: summary?.averageSalary ?? 0,
      formatter: formatCurrency,
      sparkline: summary?.sparklines?.averageSalary || [],
      icon: DollarSign,
      badge: 'Per Employee',
      color: 'var(--chart-5)',
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/40',
    },
    {
      title: 'Attendance Rate',
      value: summary?.overallAttendanceRate ?? 0,
      formatter: formatPercent,
      sparkline: summary?.sparklines?.attendanceRate || [],
      icon: CalendarCheck,
      badge: 'Target 90%+',
      color: 'var(--chart-7)',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-teal-900/10 border border-blue-500/15 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Workforce Intelligence
            </span>
          </div>
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Executive Operations Overview
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Live telemetry and workforce resource allocation across all registered divisions.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>Operational Capacity 100%</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-sm p-4.5 shadow-2xs hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${kpi.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-1.5">
                {loading ? (
                  <Skeleton className="h-8 w-28 rounded-lg" />
                ) : (
                  <div className="text-2xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
                    <AnimatedNumber
                      value={kpi.value}
                      formatter={kpi.formatter}
                    />
                  </div>
                )}
                <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5 font-medium">
                  {kpi.badge}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[var(--border)]/60">
                <Sparkline data={kpi.sparkline} height={32} color={kpi.color} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Primary Analytics Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Attendance Status Breakdown"
          loading={loading}
          data={statusDist}
          ariaLabel="Attendance Status Distribution Donut Chart"
          className="rounded-2xl"
        >
          <AttendanceDonut data={statusDist} />
        </ChartCard>

        <ChartCard
          title="Overall Attendance Rate"
          loading={loading}
          data={[{ rate: summary?.overallAttendanceRate ?? 0 }]}
          ariaLabel="Overall Attendance Rate Radial Gauge"
          className="rounded-2xl"
        >
          <GaugeChart value={summary?.overallAttendanceRate ?? 0} />
        </ChartCard>

        <ChartCard
          title="Daily Attendance Trend"
          loading={loading}
          data={dailyTrend}
          ariaLabel="Daily Attendance Trend Stacked Area Chart"
          className="rounded-2xl"
        >
          <DailyTrendStackedArea data={dailyTrend} />
        </ChartCard>
      </div>

      {/* Secondary Analytics Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Department Headcount Distribution"
          loading={loading}
          data={headcount}
          ariaLabel="Department Headcount Horizontal Bar Chart"
          className="rounded-2xl"
        >
          <HeadcountHorizontalBar data={headcount} />
        </ChartCard>

        <ChartCard
          title="Department Payroll Allocation"
          loading={loading}
          data={payroll}
          ariaLabel="Department Payroll Stacked Bar Chart"
          className="rounded-2xl"
        >
          <PayrollStackedBar data={payroll} />
        </ChartCard>

        <ChartCard
          title="Top Earners Leaderboard"
          loading={loading}
          data={topEarners}
          ariaLabel="Top Earners Horizontal Bar Chart"
          className="rounded-2xl"
        >
          <TopEarnersBar data={topEarners} />
        </ChartCard>
      </div>
    </div>
  );
}
