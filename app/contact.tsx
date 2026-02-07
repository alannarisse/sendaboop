import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

function HeartIcon({ size = 48, color = '#f87171' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </Svg>
  );
}

function RequiredLabel({ text }: { text: string }) {
  return (
    <Text style={styles.fieldLabel}>
      {text}<Text style={styles.requiredAsterisk}>*</Text>
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
            <HeartIcon size={56} color="#f87171" />
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
              colors={['#fcd5ce', '#f8a4a4', '#f87171']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
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
            placeholderTextColor="#9ca3af"
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
            placeholderTextColor="#9ca3af"
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
            placeholderTextColor="#9ca3af"
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
            colors={isFormValid ? ['#fcd5ce', '#f8a4a4', '#f87171'] : ['#aeb1b6', '#a0a2a5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendButton}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
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
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  pageTitle: {
    fontFamily: 'Quattrocento-Bold',
    fontSize: 26,
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
    introParagraph: {
    fontFamily: 'Quattrocento',
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'QuattrocentoSans-Bold',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'QuattrocentoSans-Bold',
    color: '#4b5563',
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: '#f87171',
    fontFamily: 'QuattrocentoSans-Bold',
  },
  inputWrapper: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#f87171',
    borderWidth: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#f87171',
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonPressed: {
    opacity: 0.7,
  },
  cancelButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 15,
    color: '#6b7280',
  },
  sendButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8c8a8a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  sendButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 90,
  },
  sendButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 15,
    color: 'white',
  },
  apiErrorContainer: {
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    marginBottom: 14,
  },
  apiErrorText: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#dc2626',
    fontSize: 14,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heartWrapper: {
    marginBottom: 16,
  },
  successTitle: {
    fontFamily: 'Quattrocento-Bold',
    fontSize: 28,
    color: '#1f2937',
    marginBottom: 12,
  },
  successText: {
    fontFamily: 'QuattrocentoSans-Regular',
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  homeButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#f87171',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  homeButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  homeButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 16,
    color: 'white',
  },
});
