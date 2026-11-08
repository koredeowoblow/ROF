import { test, expect } from '@playwright/test'

test.describe('ROF RAGE E2E Purchase and Fulfillment Flows', () => {
  test('Customer Purchase Flow: Browse -> Select Size -> Bag -> Checkout -> Confirmation', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/')
    await expect(page).toHaveTitle(/ROF RAGE/)

    // 2. Navigate to Shop
    await page.click('text=Shop the collection')
    await expect(page).toHaveURL(/\/shop/)
    await expect(page.locator('h1')).toContainText('collection')

    // 3. Open first product (Destined Cards Tee)
    await page.click('text=Destined Cards Tee')
    await expect(page).toHaveURL(/\/product\//)

    // 4. Select Size L and Add to Bag
    await page.click('button:has-text("L")')
    await page.click('button:has-text("Add to Bag")')

    // 5. Verify Bag Drawer opens
    await expect(page.locator('text=Your Bag')).toBeVisible()
    await page.click('button:has-text("Proceed to Checkout")')
    await expect(page).toHaveURL(/\/checkout/)

    // 6. Fill Checkout coordinates
    await page.fill('input[placeholder*="Babatunde"]', 'Adebayo Adeleke')
    await page.fill('input[type="tel"]', '+234 803 111 2233')
    await page.fill('input[type="email"]', 'adebayo.adeleke@gmail.com')
    await page.fill('input[placeholder*="House number"]', '18 Admiralty Way')
    await page.fill('input[placeholder*="Lekki"]', 'Lekki Phase 1')

    // 7. Submit Order
    await page.click('button:has-text("Place Order")')

    // 8. Verify Order Confirmation Screen
    await expect(page).toHaveURL(/\/order\/ROF-/)
    await expect(page.locator('text=Order Received')).toBeVisible()
    await expect(page.locator('text=Official Reference')).toBeVisible()
  })

  test('Order Tracking Flow: Check Status Timeline', async ({ page }) => {
    await page.goto('/track')
    await expect(page.locator('h1')).toContainText('Track an order')

    // Use seeded demo order
    await page.fill('input[placeholder*="ROF-849102"]', 'ROF-849102')
    await page.fill('input[placeholder*="chidi.okafor"]', 'chidi.okafor@gmail.com')
    await page.click('button:has-text("Locate Order")')

    // Verify timeline presence
    await expect(page.locator('text=Current Status')).toBeVisible()
    await expect(page.locator('text=Order Received')).toBeVisible()
  })

  test('Admin Fulfillment Flow: Ledger -> Status Transition', async ({ page }) => {
    await page.goto('/admin')

    // If redirected to login, authenticate
    if (page.url().includes('/admin/login')) {
      await page.fill('input[type="password"]', 'admin')
      await page.click('button:has-text("Sign In")')
      await expect(page).toHaveURL(/\/admin/)
    }

    // Navigate to Orders
    await page.click('a[href="/admin/orders"]')
    await expect(page).toHaveURL(/\/admin\/orders/)

    // Verify Orders Table
    await expect(page.locator('h1')).toContainText('Orders')
  })
})
