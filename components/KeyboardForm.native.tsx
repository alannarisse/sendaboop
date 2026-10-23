import { type ScrollViewProps } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

export { KeyboardProvider as KeyboardFormProvider } from 'react-native-keyboard-controller';

export function KeyboardForm(props: ScrollViewProps) {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={62}
        extraKeyboardSpace={62}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        {...props}
      />
      <KeyboardToolbar doneText="Done" />
    </>
  );
}
