import { useLocalization } from '@/lib/localization';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts, spacing, borderRadius, shadows, commonStyles } from '@/lib/theme';

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

function RequiredLabel({ text }: { text: string }) {
  return (
    <Text style={styles.fieldLabel}>
      {text}<Text style={commonStyles.requiredAsterisk}>*</Text>
    </Text>
  );
}

export function BoopForm({ formData, errors, onChangeField }: BoopFormProps) {
  const { t } = useLocalization();
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.disclaimer}>{t("Emails are used to deliver your boop. Unsent drafts stay on this device.")}</Text>
        <Text style={styles.sectionLabel}>{t("FROM YOU")}</Text>
        <View style={styles.inputWrapper}>
          <RequiredLabel text={t("Your name")} />
          <TextInput
            style={[styles.input, errors.senderName && styles.inputError]}
            value={formData.senderName}
            onChangeText={(text) => onChangeField('senderName', text)}
            placeholder={t("Enter your name")}
            placeholderTextColor={colors.text.placeholder}
            testID="sender-name-input"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {errors.senderName && (
          <Text style={styles.errorText} testID="sender-name-error">
            {t(errors.senderName)}
          </Text>
        )}
        <View style={styles.inputWrapper}>
          <RequiredLabel text={t("Your email")} />
          <TextInput
            style={[styles.input, errors.senderEmail && styles.inputError]}
            value={formData.senderEmail}
            onChangeText={(text) => onChangeField('senderEmail', text)}
            placeholder="your@email.com"
            placeholderTextColor={colors.text.placeholder}
            testID="sender-email-input"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.senderEmail && (
          <Text style={styles.errorText} testID="sender-email-error">
            {t(errors.senderEmail)}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t("TO YOUR FRIEND")}</Text>
        <View style={styles.inputWrapper}>
          <RequiredLabel text={t("Friend's name")} />
          <TextInput
            style={[styles.input, errors.recipientName && styles.inputError]}
            value={formData.recipientName}
            onChangeText={(text) => onChangeField('recipientName', text)}
            placeholder={t("Enter their name")}
            placeholderTextColor={colors.text.placeholder}
            testID="recipient-name-input"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        {errors.recipientName && (
          <Text style={styles.errorText} testID="recipient-name-error">
            {t(errors.recipientName)}
          </Text>
        )}
        <View style={styles.inputWrapper}>
          <RequiredLabel text={t("Friend's email")} />
          <TextInput
            style={[styles.input, errors.recipientEmail && styles.inputError]}
            value={formData.recipientEmail}
            onChangeText={(text) => onChangeField('recipientEmail', text)}
            placeholder="friend@email.com"
            placeholderTextColor={colors.text.placeholder}
            testID="recipient-email-input"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.recipientEmail && (
          <Text style={styles.errorText} testID="recipient-email-error">
            {t(errors.recipientEmail)}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>{t("YOUR MESSAGE")}</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.fieldLabel}>{t("Message (optional)")}</Text>
          <TextInput
            style={[styles.input, styles.messageInput, errors.message && styles.inputError]}
            value={formData.message}
            onChangeText={(text) => onChangeField('message', text)}
            placeholder={t("Write something nice...")}
            placeholderTextColor={colors.text.placeholder}
            testID="message-input"
            multiline
            numberOfLines={4}
            maxLength={280}
          />
        </View>
        {errors.message && (
          <Text style={styles.errorText} testID="message-error">
            {t(errors.message)}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing['3xl'],
    paddingTop: spacing['5xl'],
    gap: spacing['3xl'],
  },
  card: {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius['2xl'],
    padding: spacing['3xl'],
    ...shadows.card,
  },
  sectionLabel: {
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sansBold,
    color: colors.text.dark,
    letterSpacing: fonts.letterSpacing.wide,
    marginBottom: spacing.xl,
    textTransform: 'uppercase',
  },
  disclaimer: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sansBold,
    color: colors.text.dark,
    letterSpacing: fonts.letterSpacing.wide,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    fontSize: fonts.size.base,
    fontFamily: fonts.family.sansBold,
    color: colors.text.medium,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.xl,
    fontSize: fonts.size.lg,
    fontFamily: fonts.family.sansRegular,
    color: colors.text.dark,
  },
  inputError: {
    borderColor: colors.border.error,
    borderWidth: 2,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.xl,
  },
  errorText: {
    fontFamily: fonts.family.sansRegular,
    color: colors.primary,
    fontSize: fonts.size.base,
    marginTop: -4,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
});
