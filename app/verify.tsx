import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { getDogById } from '@/lib/dogs';
import { verifyBoop, VerifyBoopResponse } from '@/lib/api';
import { colors, fonts, spacing, borderRadius, shadows, gradients } from '@/lib/theme';

type VerifyState = 'loading' | 'success' | 'error';

function HeartIcon({ size = 56, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Svg>
  );
}

function ErrorIcon({ size = 56, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </Svg>
  );
}

export default function VerifyScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [state, setState] = useState<VerifyState>('loading');
  const [result, setResult] = useState<VerifyBoopResponse | null>(null);

  useEffect(() => {
    if (!token) {
      setState('error');
      setResult({ success: false, error: 'No token provided' });
      return;
    }

    verifyBoop(token)
      .then((res) => {
        setResult(res);
        setState(res.success ? 'success' : 'error');
      })
      .catch((err) => {
        setState('error');
        setResult({ success: false, error: err.message });
      });
  }, [token]);

  const dog = result?.dogId ? getDogById(result.dogId) : null;

  const getErrorMessage = (error?: string) => {
    switch (error) {
      case 'Token expired':
        return 'This verification link has expired. Please try sending your boop again.';
      case 'Token already used':
        return 'This boop has already been sent! Check your email for confirmation.';
      case 'Invalid token':
        return 'This verification link is invalid. Please try sending your boop again.';
      case 'No token provided':
        return 'No verification token was provided. Please use the link from your email.';
      default:
        return 'Something went wrong. Please try again.';
    }
  };

  return (
    <View style={styles.container}>
      {state === 'loading' && (
        <View style={styles.content}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Verifying your boop...</Text>
        </View>
      )}

      {state === 'success' && (
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <HeartIcon size={56} color={colors.primary} />
          </View>
          <Text style={styles.title}>Boop Sent!</Text>
          <Text style={styles.subtitle}>
            {result?.recipientName
              ? `${result.recipientName} is going to love this!`
              : 'Your boop is on its way!'}
          </Text>

          {dog && (
            <View style={styles.imageContainer}>
              <Image source={dog.image} style={styles.dogImage} />
            </View>
          )}

          <Text style={styles.description}>
            We've sent a cute doggo to brighten their day. They'll receive an email with your
            message and this adorable pup!
          </Text>

          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={gradients.buttonPrimary.colors}
              start={gradients.buttonPrimary.start}
              end={gradients.buttonPrimary.end}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Send Another Boop</Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}

      {state === 'error' && (
        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <ErrorIcon size={56} color={colors.primary} />
          </View>
          <Text style={styles.title}>Oops!</Text>
          <Text style={styles.errorMessage}>{getErrorMessage(result?.error)}</Text>

          <Pressable
            onPress={() => router.replace('/')}
            style={({ pressed }) => [styles.buttonWrapper, pressed && styles.buttonPressed]}
          >
            <LinearGradient
              colors={gradients.buttonPrimary.colors}
              start={gradients.buttonPrimary.start}
              end={gradients.buttonPrimary.end}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {result?.error === 'Token already used' ? 'Send Another Boop' : 'Try Again'}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['6xl'],
  },
  iconWrapper: {
    marginBottom: spacing['3xl'],
  },
  loadingText: {
    marginTop: spacing['3xl'],
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.light,
  },
  title: {
    fontSize: fonts.size['5xl'],
    fontFamily: fonts.family.serifBold,
    color: colors.text.dark,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: spacing['6xl'],
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: borderRadius['3xl'],
    overflow: 'hidden',
    marginBottom: spacing['6xl'],
    ...shadows.image,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  dogImage: {
    width: '100%',
    height: '100%',
  },
  description: {
    fontSize: fonts.size.md,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.light,
    textAlign: 'center',
    marginBottom: spacing['8xl'],
    lineHeight: fonts.lineHeight.relaxed,
    paddingHorizontal: spacing['3xl'],
  },
  errorMessage: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.medium,
    textAlign: 'center',
    marginBottom: spacing['8xl'],
    lineHeight: fonts.lineHeight.relaxed,
    paddingHorizontal: spacing['3xl'],
  },
  buttonWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.buttonPrimary,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  button: {
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing['8xl'],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: fonts.family.sansBold,
    color: colors.white,
    fontSize: fonts.size.xl,
  },
});
