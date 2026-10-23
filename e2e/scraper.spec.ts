import { test, expect } from './fixtures';

const pages = [
  { path: '/', ready: 'sender-name-input' },
  { path: '/about', text: 'Privacy Policy' },
  { path: '/contact', placeholder: 'What would you like to say?' },
  { path: '/success?recipientName=Test&animalUid=1&pending=true&senderEmail=sender@example.com', ready: 'success-screen' },
  { path: '/verify?token=inventory', ready: 'verify-success' },
  { path: '/app-verify?token=inventory', ready: 'verify-success' },
];

test('all public routes load and produce a URL inventory', async ({ page, baseURL }, testInfo) => {
  await page.route('**/api/verify-boop/**', (route) => route.fulfill({
    status: 200, json: { success: true, recipientName: 'Test', animalUid: 1 },
  }));
  const inventory = [];
  for (const route of pages) {
    const response = await page.goto(route.path);
    expect(response?.status(), route.path).toBe(200);
    if (route.ready) await expect(page.getByTestId(route.ready)).toBeVisible();
    if (route.text) await expect(page.getByText(route.text, { exact: true })).toBeVisible();
    if (route.placeholder) await expect(page.getByPlaceholder(route.placeholder)).toBeVisible();
    const links = await page.locator('a[href]').evaluateAll((elements) => elements.map((element) => (element as HTMLAnchorElement).href));
    inventory.push({ path: route.path, title: await page.title(), links, formFields: await page.locator('input:visible,textarea:visible').count() });
  }
  expect(inventory).toHaveLength(pages.length);
  expect(inventory.find((entry) => entry.path === '/')?.formFields).toBe(5);
  expect(inventory.find((entry) => entry.path === '/contact')?.formFields).toBe(3);
  await testInfo.attach('route-inventory.json', {
    body: JSON.stringify({ baseURL, routes: inventory }, null, 2), contentType: 'application/json',
  });
});

test('the home page renders animal photos and the social preview asset is available', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByTestId('sender-name-input')).toBeVisible();
  const photos = page.locator('[data-testid^="animal-"] img');
  await expect(photos).toHaveCount(12);
  await expect.poll(() => photos.evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  const preview = await request.get('/images/og-image.png');
  expect(preview.status()).toBe(200);
  expect(preview.headers()['content-type']).toContain('image/png');
});

test('Apple association exposes only the app verification path', async ({ request }) => {
  const response = await request.get('/.well-known/apple-app-site-association');
  expect(response.status()).toBe(200);
  const association = await response.json();
  expect(association.applinks.details).toEqual([
    { appID: '6ZV8WRZJBG.com.sendaboop.app', paths: ['/app-verify'] },
  ]);
});
