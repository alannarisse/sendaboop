import { test, expect } from './fixtures';

const preferenceKey = 'sendaboop:language:v1';

test.describe('Korean device language', () => {
  test.use({ locale: 'ko-KR' });

  test('automatically translates the main form, navigation, and validation', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
    await expect(page.getByText('귀여운 부프를 보내세요!', { exact: true })).toBeVisible();
    await expect(page.getByText('소개', { exact: true })).toBeVisible();
    await expect(page.getByTestId('sender-name-input')).toHaveAttribute('placeholder', '이름을 입력하세요');
    await page.getByTestId('sender-name-input').fill('민지');
    await page.getByTestId('sender-email-input').fill('not-an-email');
    await page.getByTestId('recipient-name-input').fill('Alex');
    await page.getByTestId('recipient-email-input').fill('alex@example.com');
    await page.locator('[data-testid^="animal-"]').first().click();
    await page.getByTestId('send-button').click();
    await expect(page.getByTestId('sender-email-error')).toHaveText('올바른 이메일 주소를 입력해 주세요');
    const screenshot = testInfo.outputPath('korean-main.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    await testInfo.attach('Korean main form', { path: screenshot, contentType: 'image/png' });
  });

  test('changing language preserves drafts and an explicit English choice survives navigation and reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('sender-name-input')).toHaveAttribute('placeholder', '이름을 입력하세요');
    await page.getByTestId('sender-name-input').fill('민지');
    await page.getByTestId('message-input').fill('Hello! 안녕!');
    await page.getByTestId('language-toggle').click();
    await expect(page.getByText('Send A Boop!', { exact: true })).toBeVisible();
    await expect(page.getByTestId('message-input')).toHaveValue('Hello! 안녕!');
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), preferenceKey)).toBe('en');
    await page.getByText('Contact', { exact: true }).click();
    await expect(page.getByText('Get in Touch', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.getByTestId('home-link').click();
    await expect(page.getByTestId('message-input').filter({ visible: true })).toHaveValue('Hello! 안녕!');
    await page.getByTestId('language-toggle').click();
    await expect(page.getByText('귀여운 부프를 보내세요!', { exact: true }).filter({ visible: true })).toBeVisible();
  });

  test('sending includes Korean locale without translating names or the personal message', async ({ page }) => {
    let payload: Record<string, unknown> | undefined;
    await page.route('**/api/send-boop', async (route) => {
      payload = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { success: true, pendingVerification: true } });
    });
    await page.goto('/');
    await expect(page.getByTestId('sender-name-input')).toHaveAttribute('placeholder', '이름을 입력하세요');
    await page.getByTestId('sender-name-input').fill('민지');
    await page.getByTestId('sender-email-input').fill('minji@example.com');
    await page.getByTestId('recipient-name-input').fill('Alex');
    await page.getByTestId('recipient-email-input').fill('alex@example.com');
    await page.getByTestId('message-input').fill('My own words. 안녕!');
    await page.locator('[data-testid^="animal-"]').first().click();
    await page.getByTestId('send-button').click();
    await expect(page.getByText('이메일을 확인해 주세요!', { exact: true })).toBeVisible();
    await expect(page.getByTestId('send-another-button')).toBeInViewport();
    expect(payload).toMatchObject({ locale: 'ko', clientPlatform: 'web', senderName: '민지', recipientName: 'Alex', message: 'My own words. 안녕!' });
    await expect(page.getByText('Alex님에게 부프를 보내려면 이메일의 확인 링크를 눌러 주세요. 링크는 24시간 동안 유효합니다.', { exact: true })).toBeVisible();
  });

  test('contact validation, server errors, and confirmation are localized', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText('문의하기', { exact: true })).toBeVisible();
    await page.getByPlaceholder('이름을 입력하세요').fill('민지');
    await page.getByPlaceholder('your@email.com').fill('invalid');
    await page.getByPlaceholder('어떤 이야기를 전하고 싶으신가요?').fill('안녕하세요!');
    await page.getByText('보내기', { exact: true }).click();
    await expect(page.getByText('올바른 이메일 주소를 입력해 주세요', { exact: true })).toBeVisible();
    await page.getByPlaceholder('your@email.com').fill('minji@example.com');
    await page.route('**/api/contact', (route) => route.fulfill({ status: 500, json: { error: 'Failed to send message' } }));
    await page.getByText('보내기', { exact: true }).click();
    await expect(page.getByText('메시지를 보내지 못했습니다', { exact: true })).toBeVisible();
    await page.unroute('**/api/contact');
    await page.route('**/api/contact', (route) => route.fulfill({ status: 200, json: { success: true } }));
    await page.getByText('보내기', { exact: true }).click();
    await expect(page.getByText('메시지를 보냈어요!', { exact: true })).toBeVisible();
  });

  test('draft save failures and leave confirmation are localized', async ({ page }) => {
    await page.addInitScript(() => {
      const save = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === 'sendaboop:form-drafts:v1') throw new Error('Storage unavailable');
        return save.call(this, key, value);
      };
    });
    await page.goto('/contact');
    await expect(page.getByText('문의하기', { exact: true })).toBeVisible();
    await page.getByPlaceholder('이름을 입력하세요').fill('민지');
    await expect(page.getByText('이 기기에 내용을 저장하지 못했습니다. 입력한 내용을 잃지 않도록 앱을 열어 두세요.', { exact: true })).toBeVisible();
    const dialog = page.waitForEvent('dialog');
    const click = page.getByText('소개', { exact: true }).click();
    const confirmation = await dialog;
    expect(confirmation.message()).toContain('그래도 나가시겠어요?');
    await confirmation.dismiss();
    await click;
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByPlaceholder('이름을 입력하세요')).toHaveValue('민지');
  });
});

test('a Korean verification email language hint works in an English browser', async ({ page }) => {
  await page.route('**/api/verify-boop/**', (route) => route.fulfill({ status: 400, json: { success: false, error: 'Token expired' } }));
  await page.goto('/app-verify?token=test&lang=ko');
  await expect(page.getByText('확인 링크가 만료되었습니다. 부프를 다시 보내 주세요.', { exact: true })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
});

test.describe('Unsupported device language', () => {
  test.use({ locale: 'fr-FR' });
  test('falls back to English and can save a Korean preference', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Send A Boop!', { exact: true })).toBeVisible();
    await page.getByTestId('language-toggle').click();
    await expect(page.getByText('귀여운 부프를 보내세요!', { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), preferenceKey)).toBe('ko');
    await page.reload();
    await expect(page.getByText('귀여운 부프를 보내세요!', { exact: true })).toBeVisible();
    await page.getByText('소개', { exact: true }).click();
    await expect(page.getByText('개인정보 처리방침', { exact: true })).toBeVisible();
  });
});
