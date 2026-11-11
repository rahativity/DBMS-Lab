import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Shell } from '@/components/layout/shell';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexusHR • Workforce Intelligence',
  description: 'Enterprise HR Management & Workforce Intelligence Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased selection:bg-[var(--foreground)] selection:text-[var(--background)]"
      >
        <ThemeProvider>
          <Shell>{children}</Shell>
        </ThemeProvider>
      </body>
    </html>
  );
}
