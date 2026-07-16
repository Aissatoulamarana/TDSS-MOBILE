/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const BrandColors = {
  navy: '#0B3551',
  navyDark: '#09283D',
  orange: '#E9781A',
  amber: '#F5A623',
  steel: '#3C4A50',
  mist: '#EEF5F7',
  cream: '#FFF7ED',
  white: '#FFFFFF',
} as const;

export const BrandGradient = [BrandColors.orange, BrandColors.navy] as const;

export const Colors = {
  light: {
    text: BrandColors.navyDark,
    background: '#ffffff',
    backgroundElement: BrandColors.mist,
    backgroundSelected: '#D9E9EE',
    textSecondary: BrandColors.steel,
  },
  dark: {
    text: '#ffffff',
    background: BrandColors.navyDark,
    backgroundElement: '#12384F',
    backgroundSelected: '#1D4A62',
    textSecondary: '#C5D2D7',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
