import { test, expect } from '@playwright/test';

test('app verification links work in a browser when the native app cannot open', async ({ page }) => {
  let verificationRequests = 0;
  await page.route('**/api/verify-boop/**', async (route) => {
    verificationRequests++;
    expect(new URL(route.request().url()).pathname).toBe('/api/verify-boop/fallback-token');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, recipientName: 'Test Friend', animalUid: 1 }),
    });
  });
  await page.goto('/app-verify?token=fallback-token');
  await expect(page.getByTestId('verify-success')).toBeVisible();
  await expect(page.getByText('Test Friend is going to love this!')).toBeVisible();
  expect(verificationRequests).toBe(1);
});
