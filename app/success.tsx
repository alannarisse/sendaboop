import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router, useLocalSearchParams } from 'expo-router';
import { getDogById } from '@/lib/dogs';

function HeartIcon({ size = 48, color = '#f87171' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Svg>
  );
}

export default function SuccessScreen() {
  const { recipientName, dogId } = useLocalSearchParams<{
    recipientName: string;
    dogId: string;
  }>();

  const dog = dogId ? getDogById(dogId) : null;

  const handleSendAnother = () => {
    router.replace('/');
  };

  return (
    <View style={styles.container} testID="success-screen">
      <View style={styles.content}>
        <View style={styles.heartWrapper}>
          <HeartIcon size={56} color="#f87171" />
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
            colors={['#f9beb4', '#f8a4a4', '#f87171']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
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
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  heartWrapper: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quattrocento-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#f87171',
  },
  dogImage: {
    width: '100%',
    height: '100%',
  },
  description: {
    fontSize: 15,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  buttonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#f87171',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    color: 'white',
    fontSize: 17,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 6,
  },
  footerLink: {
    fontFamily: 'QuattrocentoSans-Bold',
    color: '#f87171',
  },
  kofiButton: {
    marginTop: 12,
  },
  kofiButtonPressed: {
    opacity: 0.8,
  },
  kofiImage: {
    width: 180,
    height: 36,
  },
});
