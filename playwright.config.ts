import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:8082',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'], browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'npx expo start --web --port 8082',
    url: 'http://127.0.0.1:8082',
    // Keep the suite separate from the developer's Expo session and API settings.
    reuseExistingServer: false,
    env: { EXPO_PUBLIC_API_URL: 'http://127.0.0.1:3102' },
    timeout: 120000,
  },
});
