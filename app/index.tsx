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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { router } from 'expo-router';
import { DogSelector } from '@/components/DogSelector';
import { BoopForm, BoopFormData, FormErrors } from '@/components/BoopForm';
import { Dog } from '@/lib/dogs';
import { sendBoop } from '@/lib/api';

function PaperPlaneIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="white">
      <Path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </Svg>
  );
}

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

      {apiError && (
        <View style={styles.errorContainer}>
          <Text style={styles.apiError} testID="api-error">{apiError}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleSendBoop}
          disabled={isLoading || !isFormValid}
          testID="send-button"
          style={({ pressed }) => [
            styles.sendButtonWrapper,
            pressed && styles.sendButtonPressed,
          ]}
        >
          <LinearGradient
            colors={isFormValid ? ['#fcd5ce', '#f8a4a4', '#f87171'] : ['#aeb1b6', '#a0a2a5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sendButton}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={styles.sendButtonContent}>
                <PaperPlaneIcon />
                <Text style={styles.sendButtonText}>Send Dog Photo</Text>
              </View>
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
    paddingBottom: 40,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
    borderRadius: 12,
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
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sendButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#8c8a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  sendButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sendButtonText: {
    fontFamily: 'QuattrocentoSans-Bold',
    color: 'white',
    fontSize: 17,
  },
});
