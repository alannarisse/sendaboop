import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Primary palette
  primary: '#f87171',
  primaryLight: '#f8a4a4',
  primaryLighter: '#fcd5ce',
  primaryDark: '#dc2626',

  // Background colors
  background: {
    gradient: ['#fff5f5', '#ffeef2', '#fff0f3'] as const,
    card: 'rgba(255, 255, 255, 0.85)',
    input: '#ffffff',
    nav: 'rgba(255, 245, 245, 0.95)',
    error: 'rgba(254, 242, 242, 0.9)',
  },

  // Text colors
  text: {
    dark: '#1f2937',
    medium: '#4b5563',
    light: '#6b7280',
    lighter: '#9ca3af',
    placeholder: '#a1a3a4',
  },

  // Border colors
  border: {
    light: '#e5e7eb',
    error: '#f87171',
    errorLight: '#fecaca',
    nav: 'rgba(0, 0, 0, 0.05)',
  },

  // Button colors
  button: {
    gradient: ['#fcd5ce', '#f8a4a4', '#f87171'] as const,
    gradientAlt: ['#f9beb4', '#f8a4a4', '#f87171'] as const,
    disabled: ['#aeb1b6', '#a0a2a5'] as const,
    cancel: 'rgba(255, 255, 255, 0.85)',
  },

  // Misc
  white: '#ffffff',
  transparent: 'transparent',
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const fonts = {
  // Font families
  family: {
    serifRegular: 'Quattrocento-Regular',
    serifBold: 'Quattrocento-Bold',
    sansRegular: 'QuattrocentoSans-Regular',
    sansBold: 'QuattrocentoSans-Bold',
    sansItalic: 'QuattrocentoSans-Italic',
    sansBoldItalic: 'QuattrocentoSans-BoldItalic',
  },

  // Font sizes
  size: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 15,
    lg: 16,
    xl: 17,
    '2xl': 18,
    '3xl': 26,
    '4xl': 28,
    '5xl': 32,
  },

  // Line heights
  lineHeight: {
    tight: 18,
    base: 22,
    relaxed: 24,
  },

  // Letter spacing
  letterSpacing: {
    normal: 0,
    wide: 1,
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  '2xl': 14,
  '3xl': 16,
  '4xl': 18,
  '5xl': 20,
  '6xl': 24,
  '7xl': 28,
  '8xl': 32,
  '9xl': 40,
  '10xl': 48,
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 14,
  '2xl': 16,
  '3xl': 20,
  full: 9999,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    shadowColor: '#8c8a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonPrimary: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  selection: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
} as const;

// =============================================================================
// COMMON STYLES
// =============================================================================

export const commonStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  scrollContent: {
    paddingBottom: spacing['9xl'],
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Cards
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    ...shadows.card,
  },

  // Typography
  pageTitle: {
    fontFamily: fonts.family.serifBold,
    fontSize: fonts.size['3xl'],
    color: colors.text.dark,
    marginBottom: spacing['5xl'],
    textAlign: 'center',
  } as TextStyle,
  sectionTitle: {
    fontFamily: fonts.family.serifBold,
    fontSize: fonts.size['2xl'],
    color: colors.text.dark,
    marginBottom: spacing.lg,
  } as TextStyle,
  sectionLabel: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.sansBold,
    color: colors.text.lighter,
    letterSpacing: fonts.letterSpacing.wide,
    marginBottom: spacing.xl,
    textTransform: 'uppercase',
  } as TextStyle,
  paragraph: {
    fontFamily: fonts.family.sansRegular,
    fontSize: fonts.size.md,
    color: colors.text.medium,
    lineHeight: fonts.lineHeight.relaxed,
    marginBottom: spacing.lg,
  } as TextStyle,
  link: {
    color: colors.primary,
    fontFamily: fonts.family.sansBold,
  } as TextStyle,

  // Form elements
  fieldLabel: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sansBold,
    color: colors.text.medium,
    marginBottom: spacing.sm,
  } as TextStyle,
  requiredAsterisk: {
    color: colors.primary,
    fontFamily: fonts.family.sansBold,
  } as TextStyle,
  input: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.xl,
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.dark,
  } as TextStyle,
  inputError: {
    borderColor: colors.border.error,
    borderWidth: 2,
  } as ViewStyle,
  inputWrapper: {
    marginBottom: spacing.md,
  } as ViewStyle,
  errorText: {
    fontFamily: fonts.family.sansRegular,
    color: colors.primary,
    fontSize: fonts.size.base,
    marginTop: -4,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  } as TextStyle,

  // Buttons
  buttonWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.button,
  } as ViewStyle,
  buttonPrimaryWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.buttonPrimary,
  } as ViewStyle,
  button: {
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing['6xl'],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  buttonText: {
    fontFamily: fonts.family.sansBold,
    color: colors.white,
    fontSize: fonts.size.xl,
  } as TextStyle,
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,

  // Error container
  errorContainer: {
    marginHorizontal: spacing['3xl'],
    marginTop: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.background.error,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.errorLight,
  } as ViewStyle,
  apiError: {
    fontFamily: fonts.family.sansRegular,
    color: colors.primaryDark,
    textAlign: 'center',
    fontSize: fonts.size.base,
  } as TextStyle,

  // Ko-fi button
  kofiButton: {
    alignItems: 'center',
    marginTop: spacing.md,
  } as ViewStyle,
  kofiButtonPressed: {
    opacity: 0.8,
  } as ViewStyle,
  kofiImage: {
    width: 180,
    height: 36,
  } as ViewStyle,
});

// =============================================================================
// GRADIENT CONFIGURATIONS
// =============================================================================

export const gradients = {
  background: {
    colors: colors.background.gradient,
  },
  buttonPrimary: {
    colors: colors.button.gradient,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  buttonPrimaryAlt: {
    colors: colors.button.gradientAlt,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  buttonDisabled: {
    colors: colors.button.disabled,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;
