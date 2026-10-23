import { test, expect } from './fixtures';

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

for (const [error, message] of [
  ['Token expired', 'This verification link has expired. Please try sending your boop again.'],
  ['Token already used', 'This boop has already been sent! Check your email for confirmation.'],
  ['Invalid token', 'This verification link is invalid. Please try sending your boop again.'],
]) {
  test(`app verification fallback handles ${error}`, async ({ page }) => {
    await page.route('**/api/verify-boop/**', (route) => route.fulfill({ status: 400, json: { success: false, error } }));
    await page.goto('/app-verify?token=test-token');
    await expect(page.getByTestId('verify-error')).toBeVisible();
    await expect(page.getByText(message, { exact: true })).toBeVisible();
  });
}

test('app verification with no token shows an error without calling the API', async ({ page }) => {
  await page.goto('/app-verify');
  await expect(page.getByText('No verification token was provided. Please use the link from your email.', { exact: true })).toBeVisible();
});
