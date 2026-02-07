import { View, Text, TextInput, StyleSheet } from 'react-native';

export interface BoopFormData {
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

export interface FormErrors {
  senderName?: string;
  senderEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  message?: string;
}

interface BoopFormProps {
  formData: BoopFormData;
  errors: FormErrors;
  onChangeField: (field: keyof BoopFormData, value: string) => void;
}

export function BoopForm({ formData, errors, onChangeField }: BoopFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.disclaimer}>I won't save, share, sell, or use these emails!</Text>
        <Text style={styles.sectionLabel}>FROM YOU</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors.senderName && styles.inputError]}
            value={formData.senderName}
            onChangeText={(text) => onChangeField('senderName', text)}
            placeholder="Your name"
            placeholderTextColor="#a1a3a4"
            testID="sender-name-input"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {errors.senderName && (
          <Text style={styles.errorText} testID="sender-name-error">
            {errors.senderName}
          </Text>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors.senderEmail && styles.inputError]}
            value={formData.senderEmail}
            onChangeText={(text) => onChangeField('senderEmail', text)}
            placeholder="Your email"
            placeholderTextColor="#a1a3a4"
            testID="sender-email-input"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.senderEmail && (
          <Text style={styles.errorText} testID="sender-email-error">
            {errors.senderEmail}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>TO YOUR FRIEND</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors.recipientName && styles.inputError]}
            value={formData.recipientName}
            onChangeText={(text) => onChangeField('recipientName', text)}
            placeholder="Friend's name"
            placeholderTextColor="#a1a3a4"
            testID="recipient-name-input"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {errors.recipientName && (
          <Text style={styles.errorText} testID="recipient-name-error">
            {errors.recipientName}
          </Text>
        )}
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, errors.recipientEmail && styles.inputError]}
            value={formData.recipientEmail}
            onChangeText={(text) => onChangeField('recipientEmail', text)}
            placeholder="Friend's email"
            placeholderTextColor="#a1a3a4"
            testID="recipient-email-input"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.recipientEmail && (
          <Text style={styles.errorText} testID="recipient-email-error">
            {errors.recipientEmail}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>YOUR MESSAGE</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[styles.input, styles.messageInput, errors.message && styles.inputError]}
            value={formData.message}
            onChangeText={(text) => onChangeField('message', text)}
            placeholder="Write something nice..."
            placeholderTextColor="#a1a3a4"
            testID="message-input"
            multiline
            numberOfLines={4}
            maxLength={280}
          />
        </View>
        {errors.message && (
          <Text style={styles.errorText} testID="message-error">
            {errors.message}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'QuattrocentoSans-Bold',
    color: '#34373a',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
    disclaimer: {
    fontSize: 14,
    fontFamily: 'QuattrocentoSans-Bold',
    color: '#34373a',
    letterSpacing: 1,
    marginBottom: 12,
    textTransform: 'none',
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
    fontSize: 16,
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#34373a',
  },
  inputError: {
    borderColor: '#f87171',
    borderWidth: 2,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorText: {
    fontFamily: 'QuattrocentoSans-Regular',
    color: '#f87171',
    fontSize: 14,
    marginTop: -4,
    marginBottom: 8,
    marginLeft: 4,
  },
});
