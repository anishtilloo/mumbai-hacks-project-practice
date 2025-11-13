// global imports
import type { Metadata } from 'next';

// locap imports
import './app.css';
import { Toaster } from '@/components/ui/sonner';
import { mona } from '@/providers/fonts';
import { GSAPProvider } from '@/providers/gsap-provider';
import { QueryProvider } from '@/providers/query-provider';
import LenisSmoothScroll from '@/components/layout-components/lenis-smooth-scroll';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'SlopScore.ai | Practice',
  description: 'bla bla bla',
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hide-scrollbar">
      <body
        className={cn(
          `${mona.variable} mx-auto max-w-[1920px] bg-black selection:bg-white selection:text-black`
        )}
      >
        <GSAPProvider>
          <LenisSmoothScroll>
            <QueryProvider>
              {children}
              <Toaster expand />
            </QueryProvider>
          </LenisSmoothScroll>
        </GSAPProvider>
      </body>
    </html>
  );
}
