import { test, expect } from './fixtures';

const storageKey = 'sendaboop:form-drafts:v1';
async function stored(page: import('@playwright/test').Page) {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key) || 'null'), storageKey);
}
async function fillBoop(page: import('@playwright/test').Page) {
  await page.getByTestId('sender-name-input').filter({ visible: true }).fill('Sender');
  await page.getByTestId('sender-email-input').filter({ visible: true }).fill('sender@example.com');
  await page.getByTestId('recipient-name-input').filter({ visible: true }).fill('Friend');
  await page.getByTestId('recipient-email-input').filter({ visible: true }).fill('friend@example.com');
  await page.getByTestId('message-input').filter({ visible: true }).fill('Keep this boop');
  const animal = page.locator('[data-testid^="animal-"]:visible').first();
  const id = await animal.getAttribute('data-testid');
  await animal.click();
  return id!;
}
async function fillContact(page: import('@playwright/test').Page) {
  await page.getByPlaceholder('Enter your name').filter({ visible: true }).fill('Contact Sender');
  await page.getByPlaceholder('your@email.com').filter({ visible: true }).fill('contact@example.com');
  await page.getByPlaceholder('What would you like to say?').filter({ visible: true }).fill('Keep this contact message');
}

test('boop draft and selected animal survive navigation and a restart', async ({ page }) => {
  await page.goto('/');
  const animalId = await fillBoop(page);
  await page.getByText('About', { exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await page.getByTestId('home-link').filter({ visible: true }).click();
  await expect(page.getByTestId('message-input').filter({ visible: true })).toHaveValue('Keep this boop');
  await page.reload();
  await expect(page.getByTestId('sender-name-input').filter({ visible: true })).toHaveValue('Sender');
  await expect(page.getByTestId('recipient-email-input').filter({ visible: true })).toHaveValue('friend@example.com');
  await expect(page.getByTestId('message-input').filter({ visible: true })).toHaveValue('Keep this boop');
  await expect(page.getByTestId(animalId).filter({ visible: true })).toHaveCSS('border-color', 'rgb(248, 113, 113)');
});

test('Cancel preserves contact draft and a successful contact send clears only that draft', async ({ page }) => {
  await page.goto('/');
  await fillBoop(page);
  await page.getByText('Contact', { exact: true }).click();
  await fillContact(page);
  await page.getByText('Cancel', { exact: true }).filter({ visible: true }).click();
  await expect(page.getByTestId('message-input').filter({ visible: true })).toHaveValue('Keep this boop');
  await page.getByText('Contact', { exact: true }).click();
  await expect(page.getByPlaceholder('What would you like to say?').filter({ visible: true })).toHaveValue('Keep this contact message');
  await page.reload();
  await expect(page.getByPlaceholder('Enter your name').filter({ visible: true })).toHaveValue('Contact Sender');
  await page.route('**/api/contact', (route) => route.fulfill({ status: 500, json: { error: 'Contact failed' } }));
  await page.getByText('Send', { exact: true }).filter({ visible: true }).click();
  await expect(page.getByText('Contact failed', { exact: true })).toBeVisible();
  await expect(page.getByPlaceholder('What would you like to say?').filter({ visible: true })).toHaveValue('Keep this contact message');
  await page.unroute('**/api/contact');
  await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: { success: true } }));
  await page.getByText('Send', { exact: true }).filter({ visible: true }).click();
  await expect(page.getByText('Message Sent!', { exact: true })).toBeVisible();
  await expect.poll(async () => (await stored(page))?.contact.comments).toBe('');
  await page.reload();
  await expect(page.getByPlaceholder('What would you like to say?').filter({ visible: true })).toHaveValue('');
  await page.getByTestId('home-link').filter({ visible: true }).click();
  await expect(page.getByTestId('message-input').filter({ visible: true })).toHaveValue('Keep this boop');
});

test('failed boop sends retain the draft; successful sends clear it', async ({ page }) => {
  await page.goto('/');
  await fillBoop(page);
  await page.route('**/api/send-boop', (route) => route.fulfill({ status: 500, json: { error: 'Test delivery failure' } }));
  await page.getByTestId('send-button').filter({ visible: true }).click();
  await expect(page.getByTestId('api-error').filter({ visible: true })).toHaveText('Test delivery failure');
  await page.reload();
  await expect(page.getByTestId('message-input').filter({ visible: true })).toHaveValue('Keep this boop');
  await page.unroute('**/api/send-boop');
  await page.route('**/api/send-boop', (route) => route.fulfill({ status: 200, json: { success: true, pendingVerification: true } }));
  await page.getByTestId('send-button').filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/success\?/);
  await expect.poll(() => stored(page)).toBeNull();
  await page.getByTestId('home-link').filter({ visible: true }).click();
  await expect(page.getByTestId('sender-name-input').filter({ visible: true })).toHaveValue('');
});

test('failed storage warns before navigation and lets the user stay', async ({ page }) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new Error('Storage unavailable');
      return original.call(this, name, value);
    };
  }, storageKey);
  await page.goto('/contact');
  await fillContact(page);
  await expect(page.getByText('Your draft could not be saved on this device.', { exact: false })).toBeVisible();
  page.once('dialog', (dialog) => dialog.dismiss());
  await page.getByText('Cancel', { exact: true }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('Leaving may cause you to lose');
    await dialog.dismiss();
  });
  await page.getByText('About', { exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByPlaceholder('What would you like to say?').filter({ visible: true })).toHaveValue('Keep this contact message');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByText('About', { exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByText('Contact', { exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByPlaceholder('What would you like to say?').filter({ visible: true })).toHaveValue('Keep this contact message');
});

test('boop-back links preserve the recipient in an existing draft', async ({ page }) => {
  await page.goto('/');
  await fillBoop(page);
  await page.goto('/?to=other@example.com&toName=SomeoneElse');
  await expect(page.getByTestId('recipient-email-input')).toHaveValue('friend@example.com');
  await expect(page.getByTestId('recipient-name-input')).toHaveValue('Friend');
});

test('a late send response does not erase newer edits', async ({ page }) => {
  let finish: (() => Promise<void>) | undefined;
  await page.route('**/api/contact', (route) => new Promise<void>((resolve) => {
    finish = async () => { await route.fulfill({ status: 200, json: { success: true } }); resolve(); };
  }));
  await page.goto('/contact');
  await fillContact(page);
  await page.getByText('Send', { exact: true }).filter({ visible: true }).click();
  await expect.poll(() => Boolean(finish)).toBe(true);
  await page.getByPlaceholder('What would you like to say?').filter({ visible: true }).fill('A new draft after sending');
  await finish!();
  await expect(page.getByText('Message Sent!', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByPlaceholder('What would you like to say?').filter({ visible: true })).toHaveValue('A new draft after sending');
});
