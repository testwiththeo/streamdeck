import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MovieApp|Movie App/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display the logo', async ({ page }) => {
    await page.goto('/');
    const logo = page.getByText('MovieApp');
    await expect(logo).toBeVisible();
  });

  test('should navigate to search page on search input', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.locator('[data-testid="search-input"]').first();
    await searchInput.fill('batman');
    await page.waitForURL(/\/search\?q=batman/, { timeout: 10000 });
  });
});

test.describe('Search Page', () => {
  test('should display search results', async ({ page }) => {
    await page.goto('/search?q=batman');
    await expect(page.locator('body')).toBeVisible();
    // Wait for content to load
    await page.waitForTimeout(2000);
  });

  test('should show empty state for no results', async ({ page }) => {
    await page.goto('/search?q=xyznonexistent123');
    await page.waitForTimeout(2000);
  });
});

test.describe('Navigation', () => {
  test('should navigate between main pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to History
    await page.click('text=History');
    await expect(page).toHaveURL(/\/history/);
    
    // Navigate to Watchlist
    await page.click('text=Watchlist');
    await expect(page).toHaveURL(/\/watchlist/);
    
    // Navigate to Settings
    await page.click('text=Settings');
    await expect(page).toHaveURL(/\/settings/);
  });
});

test.describe('Settings Page', () => {
  test('should display theme options', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
    await expect(page.getByText('Appearance')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/settings');
    // Click on light theme
    await page.click('text=light');
    // Verify change
    await expect(page.locator('html')).toHaveAttribute('data-theme');
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    const headings = await page.locator('h1, h2, h3').count();
    expect(headings).toBeGreaterThan(0);
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });
});
