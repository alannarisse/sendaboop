import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { colors, fonts, spacing, borderRadius, shadows, gradients, commonStyles } from '@/lib/theme';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

function HeartIcon({ size = 48, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Svg>
  );
}

function RequiredLabel({ text }: { text: string }) {
  return (
    <Text style={styles.fieldLabel}>
      {text}<Text style={commonStyles.requiredAsterisk}>*</Text>
    </Text>
  );
}

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string; comments?: string }>({});

  const validateForm = () => {
    const newErrors: { name?: string; email?: string; comments?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!comments.trim()) {
      newErrors.comments = 'Please enter a message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, comments }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.replace('/');
  };

  if (submitted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.heartWrapper}>
            <HeartIcon size={56} color={colors.primary} />
          </View>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successText}>
            Thank you for reaching out. I'll get back to you as soon as possible.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.homeButtonWrapper,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.replace('/')}
          >
            <LinearGradient
              colors={gradients.buttonPrimary.colors}
              start={gradients.buttonPrimary.start}
              end={gradients.buttonPrimary.end}
              style={styles.homeButton}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    );
  }

  const isFormValid = name.trim() && email.trim() && comments.trim();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Get in Touch</Text>
      <Text style={styles.introParagraph}>Questions? Thoughts? Comments? Send me an email.</Text>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>YOUR INFO</Text>
        <View style={styles.inputWrapper}>
          <RequiredLabel text="Your name" />
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Enter your name"
            placeholderTextColor={colors.text.lighter}
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <View style={styles.inputWrapper}>
          <RequiredLabel text="Your email" />
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="your@email.com"
            placeholderTextColor={colors.text.lighter}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>YOUR MESSAGE</Text>
        <View style={styles.inputWrapper}>
          <RequiredLabel text="Message" />
          <TextInput
            style={[styles.input, styles.textArea, errors.comments && styles.inputError]}
            value={comments}
            onChangeText={(text) => {
              setComments(text);
              setErrors((prev) => ({ ...prev, comments: undefined }));
            }}
            placeholder="What would you like to say?"
            placeholderTextColor={colors.text.lighter}
            multiline
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
        </View>
        {errors.comments && <Text style={styles.errorText}>{errors.comments}</Text>}
      </View>

      {apiError && (
        <View style={styles.apiErrorContainer}>
          <Text style={styles.apiErrorText}>{apiError}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={handleCancel}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.sendButtonWrapper,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !isFormValid}
        >
          <LinearGradient
            colors={isFormValid ? gradients.buttonPrimary.colors : gradients.buttonDisabled.colors}
            start={gradients.buttonPrimary.start}
            end={gradients.buttonPrimary.end}
            style={styles.sendButton}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  content: {
    padding: spacing['3xl'],
    paddingBottom: spacing['10xl'],
  },
  pageTitle: {
    fontFamily: fonts.family.serifBold,
    fontSize: fonts.size['3xl'],
    color: colors.text.dark,
    marginBottom: spacing['5xl'],
    textAlign: 'center',
  },
  introParagraph: {
    fontFamily: fonts.family.serifRegular,
    fontSize: fonts.size.lg,
    color: colors.text.dark,
    marginBottom: spacing['5xl'],
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    marginBottom: spacing['2xl'],
    ...shadows.card,
  },
  sectionLabel: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.sansBold,
    color: colors.text.lighter,
    letterSpacing: fonts.letterSpacing.wide,
    marginBottom: spacing.xl,
    textTransform: 'uppercase',
  },
  fieldLabel: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sansBold,
    color: colors.text.medium,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.xl,
    fontSize: fonts.size.md,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.dark,
  },
  inputError: {
    borderColor: colors.border.error,
    borderWidth: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.xl,
  },
  errorText: {
    fontFamily: fonts.family.sansRegular,
    color: colors.primary,
    fontSize: fonts.size.sm,
    marginTop: -4,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.xl,
    marginTop: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  cancelButton: {
    backgroundColor: colors.button.cancel,
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing['6xl'],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontFamily: fonts.family.sansBold,
    fontSize: fonts.size.md,
    color: colors.text.light,
  },
  sendButtonWrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.button,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  sendButton: {
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing['7xl'],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: 90,
  },
  sendButtonText: {
    fontFamily: fonts.family.sansBold,
    fontSize: fonts.size.md,
    color: colors.white,
  },
  apiErrorContainer: {
    backgroundColor: colors.background.error,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.errorLight,
    padding: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  apiErrorText: {
    fontFamily: fonts.family.sansRegular,
    color: colors.primaryDark,
    fontSize: fonts.size.base,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['6xl'],
  },
  heartWrapper: {
    marginBottom: spacing['3xl'],
  },
  successTitle: {
    fontFamily: fonts.family.serifBold,
    fontSize: fonts.size['4xl'],
    color: colors.text.dark,
    marginBottom: spacing.xl,
  },
  successText: {
    fontFamily: fonts.family.sansRegular,
    fontSize: fonts.size.lg,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: spacing['6xl'],
  },
  homeButtonWrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.buttonPrimary,
  },
  homeButton: {
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing['7xl'],
    borderRadius: borderRadius.lg,
  },
  homeButtonText: {
    fontFamily: fonts.family.sansBold,
    fontSize: fonts.size.lg,
    color: colors.white,
  },
});
