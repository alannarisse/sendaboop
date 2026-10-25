import { ko } from './ko';
export type Language = 'en' | 'ko';
export type Translate = (message: string, values?: Record<string, string | number>) => string;
export function translate(language: Language, message: string, values: Record<string, string | number> = {}) {
  const text = language === 'ko' ? ko[message] || message : message;
  return text.replace(/\{(\w+)\}/g, (match, key: string) => Object.hasOwn(values, key) ? String(values[key]) : match);
}
