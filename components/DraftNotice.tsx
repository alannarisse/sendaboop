import { Text, StyleSheet } from 'react-native';
import { useDrafts } from '@/lib/form-drafts';
import { colors, fonts, spacing } from '@/lib/theme';

export function DraftNotice({ sent = false }: { sent?: boolean }) {
  const { warning, atRisk } = useDrafts();
  if (sent && !warning) return null;
  return <Text accessibilityRole={warning ? 'alert' : undefined} style={styles.notice}>
    {warning || (atRisk ? 'Saving your draft…' : 'Your unsent draft is saved on this device until your message is sent.')}
  </Text>;
}
const styles = StyleSheet.create({
  notice: { fontFamily: fonts.family.sansRegular, color: colors.text.dark, padding: spacing.xl, textAlign: 'center' },
});
