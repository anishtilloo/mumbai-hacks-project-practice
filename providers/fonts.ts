import { Mona_Sans, Pixelify_Sans } from 'next/font/google';

export const mona = Mona_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mona',
});

export const pixel = Pixelify_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});
