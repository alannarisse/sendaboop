import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { getDogById } from '@/lib/dogs';
import { colors, fonts, spacing, borderRadius, shadows, gradients, commonStyles } from '@/lib/theme';

function HeartIcon({ size = 48, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Svg>
  );
}

function EmailIcon({ size = 56, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </Svg>
  );
}

export default function SuccessScreen() {
  const { recipientName, dogId, pending, senderEmail } = useLocalSearchParams<{
    recipientName: string;
    dogId: string;
    pending?: string;
    senderEmail?: string;
  }>();

  const isPending = pending === 'true';
  const dog = dogId ? getDogById(dogId) : null;

  const handleSendAnother = () => {
    router.replace('/');
  };

  // Pending verification state
  if (isPending) {
    return (
      <View style={styles.container} testID="success-screen">
        <View style={styles.content}>
          <View style={styles.heartWrapper}>
            <EmailIcon size={56} color={colors.primary} />
          </View>
          <Text style={styles.title}>Check Your Email!</Text>
          <Text style={styles.subtitle}>
            We've sent a verification email to{'\n'}
            <Text style={styles.emailHighlight}>{senderEmail}</Text>
          </Text>

          {dog && (
            <View style={styles.imageContainer}>
              <Image source={dog.image} style={styles.dogImage} />
            </View>
          )}

          <Text style={styles.description}>
            Click the link in the email to send your boop to {recipientName}.
            The link expires in 24 hours.
          </Text>

          <Pressable
            onPress={handleSendAnother}
            testID="send-another-button"
            style={({ pressed }) => [
              styles.buttonWrapper,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={gradients.buttonPrimaryAlt.colors}
              start={gradients.buttonPrimaryAlt.start}
              end={gradients.buttonPrimaryAlt.end}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Send Another Boop</Text>
            </LinearGradient>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Made with love by Alanna Risse</Text>
          </View>
        </View>
      </View>
    );
  }

  // Confirmed state (after verification)
  return (
    <View style={styles.container} testID="success-screen">
      <View style={styles.content}>
        <View style={styles.heartWrapper}>
          <HeartIcon size={56} color={colors.primary} />
        </View>
        <Text style={styles.title}>Boop Sent!</Text>
        <Text style={styles.subtitle}>
          {recipientName ? `${recipientName} is going to love this!` : 'Your boop is on its way!'}
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
          onPress={handleSendAnother}
          testID="send-another-button"
          style={({ pressed }) => [
            styles.buttonWrapper,
            pressed && styles.buttonPressed,
          ]}
        >
          <LinearGradient
            colors={gradients.buttonPrimaryAlt.colors}
            start={gradients.buttonPrimaryAlt.start}
            end={gradients.buttonPrimaryAlt.end}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Send Another Boop</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with love by Alanna Risse</Text>
          <Text style={styles.footerText}>
            Appreciate this app?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => Linking.openURL('https://ko-fi.com/alannarisse')}
            >
              Leave a tip at Ko-fi!
            </Text>
          </Text>
          <Pressable
            onPress={() => Linking.openURL('https://ko-fi.com/alannarisse')}
            style={({ pressed }) => [
              styles.kofiButton,
              pressed && styles.kofiButtonPressed,
            ]}
          >
            <Image
              source={require('@/assets/images/general/support_me_on_kofi_beige.png')}
              style={styles.kofiImage}
              alt={'Support me on Ko-fi'}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </View>
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
  heartWrapper: {
    marginBottom: spacing['3xl'],
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
  emailHighlight: {
    fontFamily: fonts.family.sansBold,
    color: colors.primary,
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
  footer: {
    marginTop: spacing['8xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.lighter,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  footerLink: {
    fontFamily: fonts.family.sansBold,
    color: colors.primary,
  },
  kofiButton: {
    marginTop: spacing.xl,
  },
  kofiButtonPressed: {
    opacity: 0.8,
  },
  kofiImage: {
    width: 180,
    height: 36,
  },
});
