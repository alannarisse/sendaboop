import { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { DogSelector } from '@/components/DogSelector';
import { BoopForm, BoopFormData, FormErrors } from '@/components/BoopForm';
import { BoopPreview } from '@/components/BoopPreview';
import { Dog } from '@/lib/dogs';
import { sendBoop } from '@/lib/api';

const initialFormData: BoopFormData = {
  senderName: '',
  senderEmail: '',
  recipientName: '',
  recipientEmail: '',
  message: '',
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SendBoopScreen() {
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  const [formData, setFormData] = useState<BoopFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSelectDog = useCallback((dog: Dog) => {
    setSelectedDog(dog);
    setApiError(null);
  }, []);

  const handleChangeField = useCallback((field: keyof BoopFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Your name is required';
    }
    if (!formData.senderEmail.trim()) {
      newErrors.senderEmail = 'Your email is required';
    } else if (!isValidEmail(formData.senderEmail)) {
      newErrors.senderEmail = 'Please enter a valid email';
    }
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient's name is required";
    }
    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient's email is required";
    } else if (!isValidEmail(formData.recipientEmail)) {
      newErrors.recipientEmail = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSendBoop = useCallback(async () => {
    if (!selectedDog) {
      setApiError('Please select a dog first!');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    try {
      await sendBoop({
        dog: selectedDog,
        ...formData,
      });

      router.push({
        pathname: '/success',
        params: {
          recipientName: formData.recipientName,
          dogId: selectedDog.id,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send boop';
      setApiError(message);
      if (Platform.OS !== 'web') {
        Alert.alert('Oops!', message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedDog, formData, validateForm]);

  const isFormValid = selectedDog && formData.senderName && formData.senderEmail &&
    formData.recipientName && formData.recipientEmail;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <DogSelector selectedDogId={selectedDog?.id ?? null} onSelectDog={handleSelectDog} />

      <BoopForm
        formData={formData}
        errors={errors}
        onChangeField={handleChangeField}
      />

      {selectedDog && (
        <BoopPreview
          dog={selectedDog}
          message={formData.message}
          senderName={formData.senderName}
          recipientName={formData.recipientName}
        />
      )}

      {apiError && (
        <View style={styles.errorContainer}>
          <Text style={styles.apiError} testID="api-error">{apiError}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.sendButton, !isFormValid && styles.sendButtonDisabled]}
          onPress={handleSendBoop}
          disabled={isLoading || !isFormValid}
          testID="send-button"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.sendButtonText}>Send Boop! 🐾</Text>
          )}
        </Pressable>
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
    paddingBottom: 40,
  },
  errorContainer: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  apiError: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
  },
  buttonContainer: {
    padding: 16,
  },
  sendButton: {
    backgroundColor: '#f472b6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000000a2',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
  },
  sendButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    color: 'white',
    fontSize: 18,
  },
});
