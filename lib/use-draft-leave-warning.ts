import { useCallback } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect, useNavigation, usePreventRemove } from '@react-navigation/native';
import { useDrafts } from './form-drafts';

export function useDraftLeaveWarning(hasContent: boolean) {
  const navigation = useNavigation();
  const { atRisk, confirmLeave } = useDrafts();
  useFocusEffect(useCallback(() => {
    if (Platform.OS !== 'android' || !atRisk || !hasContent) return;
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.canGoBack()) return false;
      void confirmLeave().then((leave) => { if (leave) BackHandler.exitApp(); });
      return true;
    });
    return () => listener.remove();
  }, [atRisk, hasContent, navigation, confirmLeave]));
  usePreventRemove(atRisk && hasContent, ({ data }) => {
    void confirmLeave().then((leave) => {
      if (leave) navigation.dispatch(data.action);
    });
  });
}
