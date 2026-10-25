import { useLocalization } from '@/lib/localization';
import { Text, StyleSheet } from 'react-native';
import { useDrafts } from '@/lib/form-drafts';
import { colors, fonts, spacing } from '@/lib/theme';

export function DraftNotice() {
  const { t } = useLocalization();
  const { warning } = useDrafts();
  if (!warning) return null;
  return <Text accessibilityRole="alert" style={styles.notice}>
    {t(warning)}
  </Text>;
}
const styles = StyleSheet.create({
  notice: { fontFamily: fonts.family.sansRegular, color: colors.text.dark, padding: spacing.xl, textAlign: 'center' },
});
