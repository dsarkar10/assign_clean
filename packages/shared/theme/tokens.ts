export const colors = {
  bg: '#000000',
  bgCard: '#1A1A1C',
  bgCardElevated: '#232326',
  glassFill: 'rgba(255,255,255,0.10)',
  glassBorder: 'rgba(255,255,255,0.14)',
  glassHighlight: 'rgba(255,255,255,0.20)',
  scrimGradient: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.95)'] as const,

  textPrimary: '#F7F5F2',
  textSecondary: '#A8A5A0',
  textMuted: '#6B6864',

  pillActive: '#F7F5F2',
  pillActiveText: '#000000',
  pillInactive: 'rgba(255,255,255,0.08)',
  pillInactiveText: '#A8A5A0',

  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  accent: '#9333EA',
} as const;

export const typography = {
  fontFamily: {
    display: 'Manrope_300Light',
    displayBold: 'Manrope_700Bold',
    body: 'Manrope_400Regular',
    bodyMedium: 'Manrope_600SemiBold',
    mono: 'JetBrainsMono_500Medium',
  },
  size: {
    xs: 12,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 26,
    xxl: 34,
  },
  lineHeight: { tight: 1.1, normal: 1.35, relaxed: 1.6 },
  letterSpacing: { display: -0.5, tight: -0.2, normal: 0 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export const radius  = { sm: 14, md: 20, lg: 28, pill: 999 } as const;
