import { useLocalization } from '@/lib/localization';
import { type ComponentProps } from 'react';
import { Pressable, type ScrollViewProps } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

export { KeyboardProvider as KeyboardFormProvider } from 'react-native-keyboard-controller';

type ToolbarButtonProps = ComponentProps<NonNullable<ComponentProps<typeof KeyboardToolbar>['button']>>;
function LocalizedToolbarButton({ children, onPress, disabled, accessibilityLabel, accessibilityHint, testID, style }: ToolbarButtonProps) {
  const { t } = useLocalization();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={t(accessibilityLabel)}
      accessibilityHint={t(accessibilityHint)}
      testID={testID}
      style={[{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      {children}
    </Pressable>
  );
}

export function KeyboardForm(props: ScrollViewProps) {
  const { t } = useLocalization();
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={62}
        extraKeyboardSpace={62}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        {...props}
      />
      <KeyboardToolbar doneText={t("Done")} button={LocalizedToolbarButton} />
    </>
  );
}
