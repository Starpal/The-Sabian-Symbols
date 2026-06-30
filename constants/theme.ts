// Colori base
const BASE = {
  white: "rgb(255, 255, 255)",
  accent: "rgb(200, 185, 240)",
  bg: "rgb(12, 12, 26)",
  bgSheet: "rgb(19, 19, 42)",
  error: "rgb(224, 138, 138)"
} as const;

// Funzione per aggiungere opacity a un colore rgb
const withAlpha = (rgb: string, opacity: number): string => {
  // rgb(255, 255, 255) → rgba(255, 255, 255, 0.85)
  return rgb.replace("rgb", "rgba").replace(")", `, ${opacity})`);
};

export const colors = {
  // Background
  bg: BASE.bg,
  bgSheet: BASE.bgSheet,
  error: BASE.error,

  // Testi - usando white con diverse opacità
  textPrimary: withAlpha(BASE.white, 0.9),
  textSecondary: withAlpha(BASE.white, 0.55),
  placeholder: withAlpha(BASE.white, 0.45),
  textMuted: withAlpha(BASE.white, 0.25),
  textDisabled: withAlpha(BASE.white, 0.2),
  optional: withAlpha(BASE.white, 0.3),

  // Accent
  accent: withAlpha(BASE.accent, 0.85),
  accentText: withAlpha(BASE.accent, 0.97),
  accentBorder: withAlpha(BASE.accent, 0.35),
  accentMuted: withAlpha(BASE.accent, 0.65),

  // Divider
  divider: withAlpha(BASE.white, 0.06),
  dividerLight: withAlpha(BASE.white, 0.1),

  // Border
  borderColor: withAlpha(BASE.white, 0.8),
} as const;

export const fonts = {
  serif: "CormorantGaramond_400Regular",
  serifItalic: "CormorantGaramond_400Regular_Italic",
  serifLight: "CormorantGaramond_300Light",
  serifLightItalic: "CormorantGaramond_300Light_Italic",
  serifMedium: "CormorantGaramond_500Medium",
  serifMediumBold: "CormorantGaramond_600SemiBold",
  sans: "Inter_300Light",
  sansRegular: "Inter_400Regular",
} as const;
