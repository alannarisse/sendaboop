import { ScrollView, type ScrollViewProps } from 'react-native';
import { type PropsWithChildren } from 'react';

export function KeyboardFormProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

// Keep the website's normal browser scrolling and keyboard behavior.
export function KeyboardForm(props: ScrollViewProps) {
  return <ScrollView keyboardShouldPersistTaps="handled" {...props} />;
}
