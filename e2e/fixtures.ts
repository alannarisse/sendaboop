import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ apiIsolation: void }>({
  apiIsolation: [async ({ context }, use) => {
    const unexpected: string[] = [];
    // Page-level mocks in each test take precedence. Nothing may reach the real API.
    await context.route('**/api/**', async (route) => {
      unexpected.push(`${route.request().method()} ${new URL(route.request().url()).pathname}`);
      await route.fulfill({ status: 501, json: { error: 'This API request needs a test fixture' } });
    });
    await use();
    expect(unexpected, 'All API requests must be mocked; no real emails should be sent').toEqual([]);
  }, { auto: true }],
});
export { expect };
