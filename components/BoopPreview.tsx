import { View, Image, Text, StyleSheet } from 'react-native';
import { Dog } from '@/lib/dogs';

interface BoopPreviewProps {
  dog: Dog;
  message: string;
  senderName: string;
  recipientName: string;
}

export function BoopPreview({ dog, message, senderName, recipientName }: BoopPreviewProps) {
  return (
    <View style={styles.container} testID="boop-preview">
      <Text style={styles.title}>Preview:</Text>
      <View style={styles.card}>
        <Image source={dog.image} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.greeting}>
            Hey {recipientName || 'friend'}! 👋
          </Text>
          {message ? (
            <Text style={styles.message}>"{message}"</Text>
          ) : (
            <Text style={styles.messagePlaceholder}>Your message will appear here...</Text>
          )}
          <Text style={styles.signature}>
            — {senderName || 'Someone'} sent you a boop!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fdf2f8',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  content: {
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  messagePlaceholder: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  signature: {
    fontSize: 14,
    color: '#f472b6',
    fontWeight: '500',
  },
});
