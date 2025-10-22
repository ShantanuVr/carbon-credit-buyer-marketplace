import { test, expect } from '@playwright/test'

test.describe('Buyer Marketplace', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    
    await expect(page).toHaveTitle(/Carbon Market/)
    await expect(page.locator('h1')).toContainText('Carbon Credit Marketplace')
  })

  test('should navigate to projects page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Browse Projects')
    
    await expect(page).toHaveURL('/projects')
    await expect(page.locator('h1')).toContainText('Carbon Credit Projects')
  })

  test('should show login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.locator('h2')).toContainText('Sign in to your account')
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('should login with demo credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'buyer@buyerco.local')
    await page.fill('input[name="password"]', 'Buyer@123')
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL('/buyer/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should access buyer dashboard when logged in', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'buyer@buyerco.local')
    await page.fill('input[name="password"]', 'Buyer@123')
    await page.click('button[type="submit"]')
    
    await expect(page).toHaveURL('/buyer/dashboard')
    
    // Check dashboard elements
    await expect(page.locator('text=Your Holdings')).toBeVisible()
    await expect(page.locator('text=Recent Activity')).toBeVisible()
  })

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'buyer@buyerco.local')
    await page.fill('input[name="password"]', 'Buyer@123')
    await page.click('button[type="submit"]')
    
    await page.click('text=View Cart')
    await expect(page).toHaveURL('/buyer/cart')
    await expect(page.locator('h1')).toContainText('Shopping Cart')
  })

  test('should navigate to certificates page', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'buyer@buyerco.local')
    await page.fill('input[name="password"]', 'Buyer@123')
    await page.click('button[type="submit"]')
    
    await page.click('text=Certificates')
    await expect(page).toHaveURL('/buyer/certificates')
    await expect(page.locator('h1')).toContainText('Retirement Certificates')
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[name="email"]', 'buyer@buyerco.local')
    await page.fill('input[name="password"]', 'Buyer@123')
    await page.click('button[type="submit"]')
    
    // Logout
    await page.click('text=Logout')
    
    // Should redirect to home page
    await expect(page).toHaveURL('/')
    await expect(page.locator('text=Login')).toBeVisible()
  })
})
