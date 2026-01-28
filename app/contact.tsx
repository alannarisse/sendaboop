import { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

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
          <Text style={styles.successEmoji}>✉️</Text>
          <Text style={styles.successTitle}>Message Sent!</Text>
          <Text style={styles.successText}>
            Thank you for reaching out. I'll get back to you as soon as possible.
          </Text>
          <Pressable style={styles.homeButton} onPress={() => router.replace('/')}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Contact Me About Send a Boop</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="Your name"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.comments && styles.inputError]}
            value={comments}
            onChangeText={(text) => {
              setComments(text);
              setErrors((prev) => ({ ...prev, comments: undefined }));
            }}
            placeholder="What would you like to say?"
            multiline
            numberOfLines={6}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{comments.length}/500</Text>
          {errors.comments && <Text style={styles.errorText}>{errors.comments}</Text>}
        </View>

        {apiError && (
          <View style={styles.apiErrorContainer}>
            <Text style={styles.apiErrorText}>{apiError}</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <Pressable style={styles.cancelButton} onPress={handleCancel} disabled={isLoading}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  pageTitle: {
    fontFamily: 'Quattrocento-Bold',
    fontSize: 24,
    color: '#1f2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  errorText: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 16,
    color: '#4b5563',
  },
  sendButton: {
    backgroundColor: '#f472b6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f9a8d4',
  },
  sendButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 16,
    color: 'white',
  },
  apiErrorContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
    padding: 12,
    marginBottom: 16,
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
  successEmoji: {
    fontSize: 64,
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
  homeButton: {
    backgroundColor: '#f472b6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  homeButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    fontSize: 16,
    color: 'white',
  },
});
