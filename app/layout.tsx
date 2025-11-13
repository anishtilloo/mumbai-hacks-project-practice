// global imports
import type { Metadata } from 'next';

// locap imports
import './app.css';
import { Toaster } from '@/components/ui/sonner';
import { mona, pixel } from '@/providers/fonts';
import { GSAPProvider } from '@/providers/gsap-provider';
import { QueryProvider } from '@/providers/query-provider';
import LenisSmoothScroll from '@/components/layout-components/lenis-smooth-scroll';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Slopscore.ai  |  Practice build',
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
          `${mona.variable} ${pixel.variable} mx-auto max-w-[1920px] bg-black selection:bg-arancia selection:text-white`
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
