import { expect, test } from '@playwright/test';

test.describe('Logged-in checkout', () => {
  test('Sara can sign in and complete checkout', async ({ page }) => {
    await page.goto('/account/login');
    await page.getByLabel('Email').fill('sara@shopstream.test');
    await page.getByLabel('Password').fill('shopper123');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL('/');
    // Pre-seeded cart is added via API helpers in a real spec.

    await page.goto('/checkout/address');
    await page.getByLabel('Full name').fill('Sara Khan');
    await page.getByLabel('Street address').fill('123 Market St');
    await page.getByLabel('City').fill('San Francisco');
    await page.getByLabel('State / region').fill('CA');
    await page.getByLabel('Postal code').fill('94103');
    await page.getByRole('button', { name: 'Continue to shipping' }).click();

    await page.getByLabel('Standard', { exact: false }).check();
    await page.getByRole('button', { name: 'Continue to payment' }).click();

    await page.getByLabel('Payment token').fill('tok_test_4242');
    await page.getByRole('button', { name: 'Review order' }).click();

    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page).toHaveURL(/\/orders\//);
  });
});
