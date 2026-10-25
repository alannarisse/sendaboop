import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceLanguage } from './device-language';
import { translate, type Language, type Translate } from './translations';
export type { Language, Translate } from './translations';

export const LANGUAGE_STORAGE_KEY = 'sendaboop:language:v1';
const LocalizationContext = createContext<{
  language: Language; t: Translate; setLanguage: (language: Language) => void; preferenceWarning: boolean;
} | null>(null);
const detect = (): Language => getDeviceLanguage().toLowerCase().split(/[-_]/)[0] === 'ko' ? 'ko' : 'en';

export function LocalizationProvider({ children }: PropsWithChildren) {
  // Render English on the server and first client render to avoid hydration mismatch.
  const [language, setCurrentLanguage] = useState<Language>('en');
  const [preferenceWarning, setPreferenceWarning] = useState(false);
  const manual = useRef(false);
  const revision = useRef(0);
  const queue = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    const version = revision.current;
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((saved) => {
      if (!active || revision.current !== version) return;
      manual.current = saved === 'en' || saved === 'ko';
      setCurrentLanguage(manual.current ? saved as Language : detect());
    }).catch(() => { if (active && revision.current === version) setCurrentLanguage(detect()); });
    const updateDeviceLanguage = () => { if (!manual.current) setCurrentLanguage(detect()); };
    const subscription = AppState.addEventListener('change', (state) => { if (state === 'active') updateDeviceLanguage(); });
    if (Platform.OS === 'web') window.addEventListener('languagechange', updateDeviceLanguage);
    return () => {
      active = false;
      subscription.remove();
      if (Platform.OS === 'web') window.removeEventListener('languagechange', updateDeviceLanguage);
    };
  }, []);
  const setLanguage = useCallback((next: Language) => {
    const version = ++revision.current;
    manual.current = true;
    setCurrentLanguage(next);
    queue.current = queue.current.then(async () => {
      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, next);
        if (revision.current === version) setPreferenceWarning(false);
      } catch { if (revision.current === version) setPreferenceWarning(true); }
    });
  }, []);
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.lang = language;
      document.title = translate(language, 'Send a Boop - Cute Dog Emails to Your Friends');
    }
  }, [language]);
  const t = useCallback<Translate>((message, values) => translate(language, message, values), [language]);
  const value = useMemo(() => ({ language, t, setLanguage, preferenceWarning }), [language, t, setLanguage, preferenceWarning]);
  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}
export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) throw new Error('useLocalization requires LocalizationProvider');
  return context;
}
