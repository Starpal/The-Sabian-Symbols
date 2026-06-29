export const colors = {
  bg: '#0c0c1a',
  bgSheet: '#13132a',
  borderColor: 'rgba(255,255,255,0.8)',
  textPrimary: 'rgba(255,255,255,0.9)',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.25)',
  textDisabled: 'rgba(255,255,255,0.2)',
  accent: 'rgba(200,185,240,0.85)',
  accentBorder: 'rgba(180,160,220,0.35)',
  accentMuted: 'rgba(200,185,240,0.6)',
  divider: 'rgba(255,255,255,0.06)',
  dividerLight: 'rgba(255,255,255,0.1)',
} as const;

export const fonts = {
  serif: 'CormorantGaramond_400Regular',
  serifLight: 'CormorantGaramond_300Light',
  serifItalic: 'CormorantGaramond_400Regular_Italic',
  serifLightItalic: 'CormorantGaramond_300Light_Italic',
  serifMedium: 'CormorantGaramond_500Medium',
  sans: 'Inter_300Light',
  sansRegular: 'Inter_400Regular',
} as const;
