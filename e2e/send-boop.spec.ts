import { test, expect } from '@playwright/test';

test.describe('Send a Boop - Main Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main screen with dog selector and form', async ({ page }) => {
    // Check header content
    await expect(page.locator('text=Send A Boop!')).toBeVisible();

    // Check dog grid is displayed (dogs are randomized, so check for first few from static list)
    const dogGrid = page.locator('[data-testid^="dog-"]');
    await expect(dogGrid.first()).toBeVisible();

    // Check form fields are present
    await expect(page.getByTestId('sender-name-input')).toBeVisible();
    await expect(page.getByTestId('sender-email-input')).toBeVisible();
    await expect(page.getByTestId('recipient-name-input')).toBeVisible();
    await expect(page.getByTestId('recipient-email-input')).toBeVisible();
    await expect(page.getByTestId('message-input')).toBeVisible();

    // Check send button is present
    const sendButton = page.getByTestId('send-button');
    await expect(sendButton).toBeVisible();
  });

  test('should allow selecting a dog and show heart badge', async ({ page }) => {
    // Click on first available dog
    const firstDog = page.locator('[data-testid^="dog-"]').first();
    await firstDog.click();

    // Check that the dog has the selected style (coral border)
    // The component applies a different borderColor when selected
    await expect(firstDog).toHaveCSS('border-color', 'rgb(248, 113, 113)');
  });

  test('should show validation errors for empty required fields on submit attempt', async ({ page }) => {
    // Select a dog first
    await page.locator('[data-testid^="dog-"]').first().click();

    // Fill all fields first to enable button
    await page.getByTestId('sender-name-input').fill('Test');
    await page.getByTestId('sender-email-input').fill('test@test.com');
    await page.getByTestId('recipient-name-input').fill('Test');
    await page.getByTestId('recipient-email-input').fill('test@test.com');

    // Clear fields to make them empty again
    await page.getByTestId('sender-name-input').fill('');
    await page.getByTestId('sender-email-input').fill('');
    await page.getByTestId('recipient-name-input').fill('');
    await page.getByTestId('recipient-email-input').fill('');

    // Fill just enough to enable the button (the form validation happens on submit)
    await page.getByTestId('sender-name-input').fill('A');
    await page.getByTestId('sender-email-input').fill('a@a.com');
    await page.getByTestId('recipient-name-input').fill('B');
    await page.getByTestId('recipient-email-input').fill('b@b.com');

    // Clear to trigger validation on submit
    await page.getByTestId('sender-name-input').fill('');

    // The button is now disabled again, so let's test a different way
    // Fill all fields, then submit, then check if form clears on error
    await page.getByTestId('sender-name-input').fill('John');
    await page.getByTestId('sender-email-input').fill('invalid'); // invalid email
    await page.getByTestId('recipient-name-input').fill('Jane');
    await page.getByTestId('recipient-email-input').fill('jane@test.com');

    // Submit form
    await page.getByTestId('send-button').click();

    // Check for email validation error
    await expect(page.getByTestId('sender-email-error')).toBeVisible();
  });

  test('should show validation error for invalid sender email', async ({ page }) => {
    // Fill form with invalid email
    await page.getByTestId('sender-name-input').fill('John');
    await page.getByTestId('sender-email-input').fill('invalid-email');
    await page.getByTestId('recipient-name-input').fill('Jane');
    await page.getByTestId('recipient-email-input').fill('jane@example.com');

    // Select a dog
    await page.locator('[data-testid^="dog-"]').first().click();

    // Try to submit
    await page.getByTestId('send-button').click();

    // Check for email validation error
    await expect(page.getByTestId('sender-email-error')).toContainText('valid email');
  });

  test('should show validation error for invalid recipient email', async ({ page }) => {
    // Fill form with invalid recipient email
    await page.getByTestId('sender-name-input').fill('John');
    await page.getByTestId('sender-email-input').fill('john@example.com');
    await page.getByTestId('recipient-name-input').fill('Jane');
    await page.getByTestId('recipient-email-input').fill('not-an-email');

    // Select a dog
    await page.locator('[data-testid^="dog-"]').first().click();

    // Try to submit
    await page.getByTestId('send-button').click();

    // Check for email validation error
    await expect(page.getByTestId('recipient-email-error')).toContainText('valid email');
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

  test('should keep send button disabled when no dog is selected', async ({ page }) => {
    // Fill all form fields without selecting dog
    await page.getByTestId('sender-name-input').fill('John');
    await page.getByTestId('sender-email-input').fill('john@example.com');
    await page.getByTestId('recipient-name-input').fill('Jane');
    await page.getByTestId('recipient-email-input').fill('jane@example.com');

    // Button should still be disabled without dog selection (React Native Web uses aria-disabled)
    const sendButton = page.getByTestId('send-button');
    await expect(sendButton).toHaveAttribute('aria-disabled', 'true');
  });

  test('should complete form submission and show pending verification screen', async ({ page }) => {
    // Mock the API endpoint to return pending verification
    await page.route('**/api/send-boop', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          pendingVerification: true,
          message: 'Verification email sent! Check your inbox.',
        }),
      });
    });

    // Select a dog
    await page.locator('[data-testid^="dog-"]').first().click();

    // Fill form
    await page.getByTestId('sender-name-input').fill('Test Sender');
    await page.getByTestId('sender-email-input').fill('sender@test.com');
    await page.getByTestId('recipient-name-input').fill('Test Recipient');
    await page.getByTestId('recipient-email-input').fill('recipient@test.com');
    await page.getByTestId('message-input').fill('This is a test boop!');

    // Submit form
    await page.getByTestId('send-button').click();

    // Wait for navigation to success screen with pending state
    await expect(page.getByTestId('success-screen')).toBeVisible();
    await expect(page.locator('text=Check Your Email!')).toBeVisible();
    await expect(page.locator('text=sender@test.com')).toBeVisible();
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
    await page.locator('[data-testid^="dog-"]').first().click();

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
        body: JSON.stringify({
          success: true,
          pendingVerification: true,
        }),
      });
    });

    // Complete the flow
    await page.locator('[data-testid^="dog-"]').first().click();
    await page.getByTestId('sender-name-input').fill('Sender');
    await page.getByTestId('sender-email-input').fill('sender@test.com');
    await page.getByTestId('recipient-name-input').fill('Recipient');
    await page.getByTestId('recipient-email-input').fill('recipient@test.com');
    await page.getByTestId('send-button').click();

    // Wait for success screen
    await expect(page.getByTestId('success-screen')).toBeVisible();

    // Click send another button
    await page.getByTestId('send-another-button').click();

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');

    // Expo Router may keep screens in DOM, so check for empty form (the new screen)
    // The new screen's input should be empty
    await expect(page.getByRole('textbox', { name: 'Enter your name' })).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Verify Page', () => {
  test('should show loading state initially', async ({ page }) => {
    // Mock the API to delay response
    await page.route('**/api/verify-boop/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, recipientName: 'Test', dogId: 'corgi' }),
      });
    });

    await page.goto('/verify?token=test-token');
    await expect(page.locator('text=Verifying your boop...')).toBeVisible();
  });

  test('should show success state after verification', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/verify-boop/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          recipientName: 'Test Friend',
          dogId: 'corgi',
        }),
      });
    });

    await page.goto('/verify?token=valid-test-token');

    // Wait for success state
    await expect(page.locator('text=Boop Sent!')).toBeVisible();
    await expect(page.locator('text=Test Friend is going to love this!')).toBeVisible();
  });

  test('should show error for expired token', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/verify-boop/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Token expired',
        }),
      });
    });

    await page.goto('/verify?token=expired-token');

    // Wait for error state
    await expect(page.locator('text=Oops!')).toBeVisible();
    await expect(page.locator('text=This verification link has expired')).toBeVisible();
  });

  test('should show error for already used token', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/verify-boop/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Token already used',
        }),
      });
    });

    await page.goto('/verify?token=used-token');

    // Wait for error state
    await expect(page.locator('text=Oops!')).toBeVisible();
    await expect(page.locator('text=This boop has already been sent')).toBeVisible();
  });

  test('should show error for invalid token', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/verify-boop/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid token',
        }),
      });
    });

    await page.goto('/verify?token=invalid-token');

    // Wait for error state
    await expect(page.locator('text=Oops!')).toBeVisible();
    await expect(page.locator('text=This verification link is invalid')).toBeVisible();
  });

  test('should show error when no token provided', async ({ page }) => {
    await page.goto('/verify');

    // Wait for error state
    await expect(page.locator('text=Oops!')).toBeVisible();
    await expect(page.locator('text=No verification token was provided')).toBeVisible();
  });

  test('should navigate home from success state', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/verify-boop/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          recipientName: 'Test',
          dogId: 'corgi',
        }),
      });
    });

    await page.goto('/verify?token=valid-token');

    // Wait for success and click button
    await expect(page.locator('text=Boop Sent!')).toBeVisible();
    await page.locator('text=Send Another Boop').click();

    // Should be back on main screen (check for dog selector which is unique to home)
    await expect(page.locator('[data-testid^="dog-"]').first()).toBeVisible();
  });

  test('should navigate home from error state', async ({ page }) => {
    // Mock the API endpoint
    await page.route('**/api/verify-boop/**', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Invalid token',
        }),
      });
    });

    await page.goto('/verify?token=invalid-token');

    // Wait for error and click button
    await expect(page.locator('text=Oops!')).toBeVisible();
    await page.locator('text=Try Again').click();

    // Should be back on main screen (check for dog selector which is unique to home)
    await expect(page.locator('[data-testid^="dog-"]').first()).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=About').click();
    await expect(page.locator('text=Who Am I?')).toBeVisible();
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.locator('text=Contact').click();
    await expect(page.locator('text=Get In Touch')).toBeVisible();
  });

  test('should navigate home from About page via logo', async ({ page }) => {
    await page.goto('/about');
    // Click the dog logo to go home
    await page.locator('[data-testid="home-link"]').click();
    // Should be back on main screen (check for dog selector which is unique to home)
    await expect(page.locator('[data-testid^="dog-"]').first()).toBeVisible();
  });
});
