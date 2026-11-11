'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Building2,
  Banknote,
  CalendarCheck,
  FileSpreadsheet,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface NavGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/analytics', label: 'Analytics', icon: BarChart3, badge: 'Live' },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { href: '/employees', label: 'Employees', icon: Users },
      { href: '/departments', label: 'Departments', icon: Building2 },
    ],
  },
  {
    label: 'Finance & Records',
    items: [
      { href: '/salaries', label: 'Salaries', icon: Banknote },
      { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
      { href: '/report', label: 'Report', icon: FileSpreadsheet },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex flex-col w-16 md:w-60 border-r border-[var(--border)] bg-[var(--card)]/90 backdrop-blur-md transition-all duration-200">
      {/* Brand Header */}
      <div className="flex items-center h-16 px-4 border-b border-[var(--border)] justify-center md:justify-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-xs shadow-blue-500/20">
          HR
        </div>
        <div className="hidden md:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[var(--foreground)]">
              CoreHR
            </span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
              Pro
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="text-[11px] text-[var(--muted-foreground)]">System Online</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <h4 className="hidden md:block px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]/70 mb-1.5">
              {group.label}
            </h4>
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/60',
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/40 -z-10 shadow-2xs"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-[var(--muted-foreground)]',
                    )}
                  />
                  <span className="hidden md:inline truncate">{item.label}</span>
                  {item.badge && (
                    <span className="hidden md:inline-block ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-[var(--muted)]/40 hover:bg-[var(--muted)] transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            AU
          </div>
          <div className="hidden md:flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-[var(--foreground)] truncate">
              Admin User
            </span>
            <span className="text-[10px] text-[var(--muted-foreground)] truncate flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Executive Access
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
