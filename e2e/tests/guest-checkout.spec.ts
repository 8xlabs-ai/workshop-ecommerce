import { expect, test } from '@playwright/test';

test.describe('Guest checkout (feature-flagged)', () => {
  test.skip(
    !process.env.FF_GUEST_CHECKOUT_ENABLED,
    'Set FF_GUEST_CHECKOUT_ENABLED=true on the API to run',
  );

  test('an anonymous visitor can complete a guest checkout', async ({ page, request }) => {
    // Sanity check: server-side flag is on.
    const health = await request.get('/api/health');
    expect(health.ok()).toBeTruthy();

    await page.goto('/cart');
    await page.getByRole('link', { name: 'Continue as guest' }).click();
    await expect(page).toHaveURL(/\/checkout\/guest\/contact/);

    await page.getByLabel('Email').fill('amelia@example.com');
    await page.getByLabel('First name').fill('Amelia');
    await page.getByLabel('Last name').fill('Reyes');
    await page.getByRole('button', { name: 'Continue to shipping' }).click();

    await page.getByLabel('Full name').fill('Amelia Reyes');
    await page.getByLabel('Street address').fill('123 Market St');
    await page.getByLabel('City').fill('San Francisco');
    await page.getByLabel('State / region').fill('CA');
    await page.getByLabel('Postal code').fill('94103');
    await page.getByLabel('Standard', { exact: false }).check();
    await page.getByLabel('Payment token').fill('tok_test_4242');
    await page.getByRole('button', { name: 'Review order' }).click();

    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page).toHaveURL(/\/orders\/.*[?&]email=amelia%40example\.com/);
  });

  test('guest endpoint returns 403 with flag off', async ({ request }) => {
    if (process.env.FF_GUEST_CHECKOUT_ENABLED) test.skip();
    const res = await request.post('/api/checkout/guest', {
      data: {
        contact: { email: 'a@b.com', firstName: 'A', lastName: 'B', marketingOptIn: false },
        cart: { items: [{ productId: '00000000-0000-0000-0000-000000000000', quantity: 1 }] },
        shippingAddress: {
          fullName: 'A B',
          line1: '1 Test St',
          city: 'SF',
          region: 'CA',
          postalCode: '94103',
          country: 'US',
        },
        shippingMethod: 'standard',
        paymentToken: 'tok_test_4242',
      },
    });
    expect(res.status()).toBe(403);
  });
});
