export function getDeviceLanguage(): string {
  if (typeof window !== 'undefined') {
    const hint = new URLSearchParams(window.location.search).get('lang');
    if (hint === 'en' || hint === 'ko') return hint;
  }
  return typeof navigator === 'undefined' ? 'en' : navigator.languages?.[0] || navigator.language || 'en';
}
