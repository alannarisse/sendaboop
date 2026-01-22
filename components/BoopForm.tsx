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
      <Text style={styles.sectionTitle}>From:</Text>
      <View style={styles.fieldGroup}>
        <View style={styles.field}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={[styles.input, errors.senderName && styles.inputError]}
            value={formData.senderName}
            onChangeText={(text) => onChangeField('senderName', text)}
            placeholder="Your name"
            testID="sender-name-input"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.senderName && (
            <Text style={styles.errorText} testID="sender-name-error">
              {errors.senderName}
            </Text>
          )}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Your Email</Text>
          <TextInput
            style={[styles.input, errors.senderEmail && styles.inputError]}
            value={formData.senderEmail}
            onChangeText={(text) => onChangeField('senderEmail', text)}
            placeholder="your@email.com"
            testID="sender-email-input"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.senderEmail && (
            <Text style={styles.errorText} testID="sender-email-error">
              {errors.senderEmail}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>To:</Text>
      <View style={styles.fieldGroup}>
        <View style={styles.field}>
          <Text style={styles.label}>Recipient Name</Text>
          <TextInput
            style={[styles.input, errors.recipientName && styles.inputError]}
            value={formData.recipientName}
            onChangeText={(text) => onChangeField('recipientName', text)}
            placeholder="Friend's name"
            testID="recipient-name-input"
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.recipientName && (
            <Text style={styles.errorText} testID="recipient-name-error">
              {errors.recipientName}
            </Text>
          )}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Recipient Email</Text>
          <TextInput
            style={[styles.input, errors.recipientEmail && styles.inputError]}
            value={formData.recipientEmail}
            onChangeText={(text) => onChangeField('recipientEmail', text)}
            placeholder="friend@email.com"
            testID="recipient-email-input"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.recipientEmail && (
            <Text style={styles.errorText} testID="recipient-email-error">
              {errors.recipientEmail}
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Message:</Text>
      <View style={styles.field}>
        <TextInput
          style={[styles.input, styles.messageInput, errors.message && styles.inputError]}
          value={formData.message}
          onChangeText={(text) => onChangeField('message', text)}
          placeholder="Write a cute message to go with your boop..."
          testID="message-input"
          multiline
          numberOfLines={3}
          maxLength={280}
        />
        <Text style={styles.charCount}>{formData.message.length}/280</Text>
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
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 8,
  },
  fieldGroup: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  charCount: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});
