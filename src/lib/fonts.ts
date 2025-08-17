// This file is used to load and manage fonts for the application
import { Inter, Orbitron, Rajdhani } from "next/font/google";

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-rajdhani',
});

export const fonts = {
  inter,
  orbitron,
  rajdhani,
};
