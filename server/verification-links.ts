// Only iOS-originated requests use the path registered for Universal Links.
// This is a routing preference, not authentication or proof of the client type.
export function createVerificationUrl(appUrl: string, token: string, clientPlatform?: string): string {
  const path = clientPlatform === 'ios' ? '/app-verify' : '/verify';
  return `${appUrl.replace(/\/+$/, '')}${path}?token=${encodeURIComponent(token)}`;
}
