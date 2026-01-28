import { View, Text, Image, Pressable, StyleSheet, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getDogById } from '@/lib/dogs';

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
        <Text style={styles.emoji}>🎉</Text>
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

        <Pressable style={styles.button} onPress={handleSendAnother} testID="send-another-button">
          <Text style={styles.buttonText}>Send Another Boop 🐕</Text>
        </Pressable>
        <View style={styles.footer}>
          <Text style={styles.footerText}>© Alanna Risse 2026</Text>
          <Text style={styles.footerText}>
            Appreciate this app?{' '}
            <Text
              style={styles.footerLink}
              onPress={() => Linking.openURL('https://ko-fi.com/alannarisse')}
            >
              Please leave me a tip at Ko-fi!
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf2f8',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Quattrocento-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  dogImage: {
    width: '100%',
    height: '100%',
  },
  description: {
    fontSize: 14,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#f472b6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#f472b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    color: 'white',
    fontSize: 18,
  },
  footer: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerLink: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#f472b6',
    textDecorationLine: 'underline',
  }
});
