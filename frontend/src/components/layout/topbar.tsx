'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { RefreshCw, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const titles: Record<string, { label: string; section: string }> = {
  '/employees': { label: 'Employees', section: 'Workforce' },
  '/departments': { label: 'Departments', section: 'Workforce' },
  '/salaries': { label: 'Salaries', section: 'Finance & Records' },
  '/attendance': { label: 'Attendance', section: 'Finance & Records' },
};

export function Topbar() {
  const pathname = usePathname();
  const current = titles[pathname] || { label: 'HR Portal', section: 'Dashboard' };
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const currentDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
          <span>NexusHR</span>
          <ChevronRight className="w-3 h-3 text-[var(--muted-foreground)]/50" />
          <span>{current.section}</span>
          <ChevronRight className="w-3 h-3 text-[var(--muted-foreground)]/50" />
          <span className="text-[var(--foreground)] font-medium">{current.label}</span>
        </div>
        <h1 className="text-base font-bold tracking-tight text-[var(--foreground)] mt-0.5">
          {current.label}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Date Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted-foreground)] font-medium shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#4b7273] dark:text-[#86b9b1]" />
          <span>{currentDate}</span>
        </div>

        {/* Refresh button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className="h-8 w-8 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          title="Refresh Data"
          aria-label="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#86b9b1]' : ''}`} />
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
