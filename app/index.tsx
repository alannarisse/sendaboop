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
import { Header } from '@/components/Header';
import { Tooltip } from '@/components/Tooltip';
import { Dog } from '@/lib/dogs';
import { sendBoop } from '@/lib/api';
import { colors, fonts, spacing, borderRadius, shadows, gradients, commonStyles } from '@/lib/theme';

function PaperPlaneIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill={colors.white}>
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
          pending: 'true',
          senderEmail: formData.senderEmail,
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
      <Header />
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
        <Tooltip
          text="There's some missing info. Make sure you've selected a dog and filled out the name and email fields. Once the form is filled out correctly, this button will be clickable."
          visible={!isFormValid && !isLoading}
        >
          <Pressable
            onPress={handleSendBoop}
            disabled={isLoading || !isFormValid}
            testID="send-button"
            style={({ pressed }) => [
              styles.sendButtonWrapper,
              pressed && isFormValid && styles.sendButtonPressed,
            ]}
          >
            <LinearGradient
              colors={isFormValid ? gradients.buttonPrimary.colors : gradients.buttonDisabled.colors}
              start={gradients.buttonPrimary.start}
              end={gradients.buttonPrimary.end}
              style={styles.sendButton}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <View style={styles.sendButtonContent}>
                  <PaperPlaneIcon />
                  <Text style={styles.sendButtonText}>Send Dog Photo</Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        </Tooltip>
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
    paddingBottom: spacing['9xl'],
  },
  errorContainer: {
    marginHorizontal: spacing['3xl'],
    marginTop: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.background.error,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.errorLight,
  },
  apiError: {
    fontFamily: fonts.family.sansRegular,
    color: colors.primaryDark,
    textAlign: 'center',
    fontSize: fonts.size.base,
  },
  buttonContainer: {
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['6xl'],
    paddingBottom: spacing['3xl'],
  },
  sendButtonWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.button,
  },
  sendButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  sendButton: {
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing['6xl'],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  sendButtonText: {
    fontFamily: fonts.family.sansBold,
    color: colors.white,
    fontSize: fonts.size.xl,
  },
});
