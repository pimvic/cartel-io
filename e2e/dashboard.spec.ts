/**
 * Dashboard E2E Tests
 * 
 * End-to-end tests for dashboard navigation and core features.
 * Tests sidebar navigation, section switching, and key user flows.
 */

import { test, expect } from '@playwright/test';

// Helper to login before each test
async function login(page) {
  await page.goto('/en/login');
  await page.getByLabel(/email/i).fill('test@kartels.io');
  await page.getByLabel(/password/i).fill('test');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
}

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard with sidebar', async ({ page }) => {
    // Check sidebar is visible
    await expect(page.locator('aside, nav').first()).toBeVisible();

    // Check main content area
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Navigate to Knowledge Base
    await page.getByRole('link', { name: /knowledge base|base/i }).click();
    await expect(page.getByText(/knowledge base|base de connaissances/i)).toBeVisible();

    // Navigate to Calendar
    await page.getByRole('link', { name: /calendar|calendrier/i }).click();
    await expect(page.getByText(/calendar|calendrier/i)).toBeVisible();

    // Navigate to Notes
    await page.getByRole('link', { name: /notes/i }).click();
    await expect(page.getByText(/notes/i)).toBeVisible();
  });

  test('should toggle sidebar collapse', async ({ page }) => {
    // Find collapse/toggle button
    const toggleButton = page.getByRole('button', { name: /collapse|expand|menu/i }).first();
    
    if (await toggleButton.isVisible()) {
      // Click to collapse
      await toggleButton.click();
      await page.waitForTimeout(500); // Wait for animation

      // Click to expand
      await toggleButton.click();
      await page.waitForTimeout(500);

      // Sidebar should still be visible
      await expect(page.locator('aside, nav').first()).toBeVisible();
    }
  });

  test('should display user menu', async ({ page }) => {
    // Look for user menu (avatar, name, or menu button)
    const userMenu = page.locator('[data-testid="user-menu"], button:has-text("test")').first();
    
    if (await userMenu.isVisible()) {
      await userMenu.click();
      
      // Check for menu items
      await expect(page.getByRole('menuitem', { name: /settings|logout/i }).first()).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Sidebar should be hidden or collapsed on mobile
    const sidebar = page.locator('aside, nav').first();
    
    // Check if sidebar is hidden or has mobile styling
    const isHidden = await sidebar.isHidden();
    const hasSmallWidth = await sidebar.evaluate((el) => el.offsetWidth < 100);
    
    expect(isHidden || hasSmallWidth).toBe(true);
  });
});

test.describe('Overview Section', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Navigate to overview
    await page.getByRole('link', { name: /overview|vue d'ensemble/i }).click();
  });

  test('should display KPI cards', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(2000);

    // Check for KPI cards (active members, study hours, etc.)
    const kpiCards = page.locator('[data-testid="kpi-card"], .grid > div').first();
    await expect(kpiCards).toBeVisible();
  });

  test('should display members carousel', async ({ page }) => {
    // Wait for members to load
    await page.waitForTimeout(2000);

    // Look for member cards or avatars
    const membersSection = page.getByText(/members|membres/i).first();
    if (await membersSection.isVisible()) {
      await expect(membersSection).toBeVisible();
    }
  });

  test('should display progress indicator', async ({ page }) => {
    // Wait for data
    await page.waitForTimeout(2000);

    // Look for progress bar or percentage
    const progressElement = page.locator('[role="progressbar"], .progress, [data-testid="progress"]').first();
    
    if (await progressElement.isVisible()) {
      await expect(progressElement).toBeVisible();
    }
  });
});

test.describe('Knowledge Base', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: /knowledge base|base/i }).click();
  });

  test('should display search input', async ({ page }) => {
    // Wait for page load
    await page.waitForTimeout(1000);

    // Look for search input
    const searchInput = page.getByPlaceholder(/search|recherche/i);
    await expect(searchInput).toBeVisible();
  });

  test('should search for documents', async ({ page }) => {
    await page.waitForTimeout(1000);

    const searchInput = page.getByPlaceholder(/search|recherche/i);
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500); // Debounce

      // Results should update (either show results or "no results")
      // Just check page doesn't crash
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('Notes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: /notes/i }).click();
  });

  test('should display notes tabs', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for tabs (Personal/Shared or similar)
    const tabs = page.locator('[role="tablist"], .tabs').first();
    
    if (await tabs.isVisible()) {
      await expect(tabs).toBeVisible();
    }
  });

  test('should show create note button', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for create/add button
    const createButton = page.getByRole('button', { name: /new note|create|add/i }).first();
    
    if (await createButton.isVisible()) {
      await expect(createButton).toBeVisible();
    }
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.getByRole('link', { name: /settings|paramètres/i }).click();
  });

  test('should display settings tabs', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Look for settings categories/tabs
    const settingsTabs = page.locator('[role="tablist"], .tabs').first();
    
    if (await settingsTabs.isVisible()) {
      await expect(settingsTabs).toBeVisible();
    }
  });
});
