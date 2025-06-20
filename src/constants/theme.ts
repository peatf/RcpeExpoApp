/**
 * @file theme.ts
 * @description Theme constants and design system for RCPE app based on mockup
 */

export const colors = {
  bg: '#fafaf2',
  base1: '#e1e1d7',
  base2: '#afafa7',
  base3: '#7c7d76',
  base4: '#4b4c47',
  base5: '#323230',
  base6: '#191917',
  accent: '#005FF7',
  accentGlow: 'rgba(0, 95, 247, 0.15)',
  accentSecondary: '#c7d2fe',
  textPrimary: '#323230',
  textSecondary: '#7c7d76',
};

export const fonts = {
  body: 'Inter', // Will need to be loaded
  mono: 'IBM Plex Mono', // Will need to be loaded
  display: 'Syne', // Will need to be loaded
  // Fallback to system fonts
  bodyFallback: 'System',
  monoFallback: 'Courier New',
  displayFallback: 'System',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const typography = {
  displayLarge: {
    fontFamily: fonts.display,
    fontSize: 72,
    fontWeight: '800' as const,
    lineHeight: 80,
    letterSpacing: -0.02,
  },
  displayMedium: {
    fontFamily: fonts.display,
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.01,
  },
  headingLarge: {
    fontFamily: fonts.display,
    fontSize: 20, // Adjusted from 24px to better reflect h2 usage
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  headingMedium: {
    fontFamily: fonts.display,
    fontSize: 18, // Adjusted from 20px
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  labelLarge: {
    fontFamily: fonts.mono, // Changed to mono
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
    textTransform: 'uppercase' as const, // Added textTransform
  },
  labelSmall: {
    fontFamily: fonts.mono, // Changed to mono
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const theme = {
  colors,
  fonts,
  spacing,
  borderRadius,
  shadows,
  typography,
};