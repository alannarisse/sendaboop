import { test, expect } from './fixtures';

test('contact form submits while the message field has focus', async ({ page }) => {
  let submitted: unknown;
  await page.route('**/api/contact', async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
  await page.goto('/contact');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByText('Get in Touch', { exact: true })).toBeVisible();
  await page.getByPlaceholder('Enter your name').fill('Test Sender');
  await page.getByPlaceholder('your@email.com').fill('sender@example.com');
  await page.getByPlaceholder('What would you like to say?').fill('A friendly test message');
  await expect(page.getByPlaceholder('What would you like to say?')).toBeFocused();
  await page.getByText('Send', { exact: true }).click();
  await expect(page.getByText('Message Sent!', { exact: true })).toBeVisible();
  expect(submitted).toEqual({
    name: 'Test Sender', email: 'sender@example.com', comments: 'A friendly test message',
  });
});

for (const [email, message] of [
  ['not-an-email', 'Please enter a valid email'],
  ['   ', 'Email is required'],
]) {
  test(`contact validation rejects ${email.trim() || 'blank'} email without sending`, async ({ page }) => {
    await page.goto('/contact');
    await page.getByPlaceholder('Enter your name').fill('Test Sender');
    await page.getByPlaceholder('your@email.com').fill(email);
    await page.getByPlaceholder('What would you like to say?').fill('A message');
    if (!email.trim()) {
      await expect(page.locator('[aria-disabled="true"]').filter({ has: page.getByText('Send', { exact: true }) })).toHaveAttribute('aria-disabled', 'true');
    } else {
      await page.getByText('Send', { exact: true }).click();
      await expect(page.getByText(message, { exact: true })).toBeVisible();
    }
  });
}

test('contact message is limited to 500 characters', async ({ page }) => {
  await page.goto('/contact');
  const message = page.getByPlaceholder('What would you like to say?');
  await message.fill('x'.repeat(520));
  await expect(message).toHaveValue('x'.repeat(500));
});

test('Send remains reachable in a narrow viewport with the contact message focused', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 420 });
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: { success: true } }));
  await page.goto('/contact');
  await page.getByPlaceholder('Enter your name').fill('Sender');
  await page.getByPlaceholder('your@email.com').fill('sender@example.com');
  await page.getByPlaceholder('What would you like to say?').fill('A message on a small screen');
  const send = page.getByText('Send', { exact: true });
  await send.scrollIntoViewIfNeeded();
  await expect(send).toBeInViewport();
  await send.click();
  await expect(page.getByText('Message Sent!', { exact: true })).toBeVisible();
});
