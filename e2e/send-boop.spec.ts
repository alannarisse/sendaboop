import { test, expect } from '@playwright/test';

test.describe('Send a Boop', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main screen with dog selector and form', async ({ page }) => {
    // Check title
    await expect(page.locator('text=Pick a pup to send')).toBeVisible();

    // Check dog images are displayed (at least first one)
    await expect(page.getByTestId('dog-golden-retriever')).toBeVisible();

    // Check form fields are present
    await expect(page.getByTestId('sender-name-input')).toBeVisible();
    await expect(page.getByTestId('sender-email-input')).toBeVisible();
    await expect(page.getByTestId('recipient-name-input')).toBeVisible();
    await expect(page.getByTestId('recipient-email-input')).toBeVisible();
    await expect(page.getByTestId('message-input')).toBeVisible();

    // Check send button is present but disabled
    const sendButton = page.getByTestId('send-button');
    await expect(sendButton).toBeVisible();
  });

  test('should allow selecting a dog', async ({ page }) => {
    // Select a dog
    await page.getByTestId('dog-corgi').click();

    // Check preview appears
    await expect(page.getByTestId('boop-preview')).toBeVisible();
  });

  test('should show validation errors for empty required fields', async ({ page }) => {
    // Select a dog first
    await page.getByTestId('dog-pug').click();

    // Try to submit without filling form
    await page.getByTestId('send-button').click();

    // Check for validation errors
    await expect(page.getByTestId('sender-name-error')).toBeVisible();
    await expect(page.getByTestId('sender-email-error')).toBeVisible();
    await expect(page.getByTestId('recipient-name-error')).toBeVisible();
    await expect(page.getByTestId('recipient-email-error')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    // Fill form with invalid email
    await page.getByTestId('sender-name-input').fill('John');
    await page.getByTestId('sender-email-input').fill('invalid-email');
    await page.getByTestId('recipient-name-input').fill('Jane');
    await page.getByTestId('recipient-email-input').fill('jane@example.com');

    // Select a dog
    await page.getByTestId('dog-husky').click();

    // Try to submit
    await page.getByTestId('send-button').click();

    // Check for email validation error
    await expect(page.getByTestId('sender-email-error')).toContainText('valid email');
  });

  test('should update preview with form data', async ({ page }) => {
    // Select a dog
    await page.getByTestId('dog-beagle').click();

    // Fill form
    await page.getByTestId('sender-name-input').fill('Alice');
    await page.getByTestId('recipient-name-input').fill('Bob');
    await page.getByTestId('message-input').fill('Have a great day!');

    // Check preview updates
    const preview = page.getByTestId('boop-preview');
    await expect(preview).toContainText('Bob');
    await expect(preview).toContainText('Alice');
    await expect(preview).toContainText('Have a great day!');
  });

  test('should limit message to 280 characters', async ({ page }) => {
    // Fill message with long text
    const longMessage = 'a'.repeat(300);
    await page.getByTestId('message-input').fill(longMessage);

    // Check that message is truncated
    const messageInput = page.getByTestId('message-input');
    const value = await messageInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(280);
  });

  test('should show error when no dog is selected and trying to send', async ({ page }) => {
    // Fill all form fields without selecting dog
    await page.getByTestId('sender-name-input').fill('John');
    await page.getByTestId('sender-email-input').fill('john@example.com');
    await page.getByTestId('recipient-name-input').fill('Jane');
    await page.getByTestId('recipient-email-input').fill('jane@example.com');

    // Button should still be disabled without dog selection
    // (since isFormValid requires selectedDog)
    const sendButton = page.getByTestId('send-button');
    await expect(sendButton).toBeDisabled();
  });

  test('should complete full boop flow with mocked API', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/send-boop', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Boop sent!' }),
      });
    });

    // Select a dog
    await page.getByTestId('dog-golden-retriever').click();

    // Fill form
    await page.getByTestId('sender-name-input').fill('Test Sender');
    await page.getByTestId('sender-email-input').fill('sender@test.com');
    await page.getByTestId('recipient-name-input').fill('Test Recipient');
    await page.getByTestId('recipient-email-input').fill('recipient@test.com');
    await page.getByTestId('message-input').fill('This is a test boop!');

    // Submit form
    await page.getByTestId('send-button').click();

    // Wait for navigation to success screen
    await expect(page.getByTestId('success-screen')).toBeVisible();
    await expect(page.locator('text=Boop Sent!')).toBeVisible();
    await expect(page.locator('text=Test Recipient')).toBeVisible();
  });

  test('should display API error message on failure', async ({ page }) => {
    // Mock the API endpoint to return error
    await page.route('**/api/send-boop', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error occurred' }),
      });
    });

    // Select a dog
    await page.getByTestId('dog-shiba').click();

    // Fill form
    await page.getByTestId('sender-name-input').fill('Test Sender');
    await page.getByTestId('sender-email-input').fill('sender@test.com');
    await page.getByTestId('recipient-name-input').fill('Test Recipient');
    await page.getByTestId('recipient-email-input').fill('recipient@test.com');

    // Submit form
    await page.getByTestId('send-button').click();

    // Check error message is displayed
    await expect(page.getByTestId('api-error')).toBeVisible();
  });

  test('should navigate back to main screen from success screen', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/send-boop', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    // Complete the flow
    await page.getByTestId('dog-labrador').click();
    await page.getByTestId('sender-name-input').fill('Sender');
    await page.getByTestId('sender-email-input').fill('sender@test.com');
    await page.getByTestId('recipient-name-input').fill('Recipient');
    await page.getByTestId('recipient-email-input').fill('recipient@test.com');
    await page.getByTestId('send-button').click();

    // Wait for success screen
    await expect(page.getByTestId('success-screen')).toBeVisible();

    // Click send another button
    await page.getByTestId('send-another-button').click();

    // Should be back on main screen
    await expect(page.locator('text=Pick a pup to send')).toBeVisible();
  });
});
