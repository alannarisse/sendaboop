import { getLocales } from 'expo-localization';
export function getDeviceLanguage(): string {
  return getLocales()[0]?.languageCode || 'en';
}
