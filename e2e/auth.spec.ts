/**
 * Authentication E2E Tests
 * 
 * End-to-end tests for authentication flows.
 * Tests login, signup, and logout functionality across browsers.
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/en/login');
  });

  test('should display login page correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Kartels/i);

    // Check for login form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should toggle between login and signup', async ({ page }) => {
    // Check login mode is default
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Toggle to signup
    await page.getByText(/sign up/i).click();

    // Check signup form appears
    await expect(page.getByLabel(/first name/i)).toBeVisible();
    await expect(page.getByLabel(/last name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();

    // Toggle back to login
    await page.getByText(/already have an account/i).click();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for HTML5 validation
    const emailInput = page.getByLabel(/email/i);
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Check for error message (toast or alert)
    await expect(page.getByText(/invalid/i)).toBeVisible({ timeout: 5000 });
  });

  test('should login with test credentials', async ({ page }) => {
    // Fill in test credentials
    await page.getByLabel(/email/i).fill('test@kartels.io');
    await page.getByLabel(/password/i).fill('test');

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Check dashboard is loaded
    await expect(page.getByText(/overview|dashboard/i)).toBeVisible({ timeout: 5000 });
  });

  test('should display Google login button', async ({ page }) => {
    const googleButton = page.getByRole('button', { name: /google/i });
    await expect(googleButton).toBeVisible();
  });

  test('should switch language', async ({ page }) => {
    // Check current language is English
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();

    // Switch to French
    await page.getByRole('button', { name: /language|langue/i }).click();
    await page.getByText(/français/i).click();

    // Check URL changed to /fr
    await expect(page).toHaveURL(/\/fr\/login/);

    // Check French text appears
    await expect(page.getByRole('button', { name: /se connecter/i })).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/en/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/en\/login/, { timeout: 5000 });
  });

  test('should allow access to protected route after login', async ({ page }) => {
    // Login first
    await page.goto('/en/login');
    await page.getByLabel(/email/i).fill('test@kartels.io');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Try to navigate to another protected page
    await page.goto('/en/notes');

    // Should stay on protected page (not redirect to login)
    await expect(page).toHaveURL(/\/notes/);
  });
});

test.describe('Logout', () => {
  test('should logout and redirect to login page', async ({ page }) => {
    // Login first
    await page.goto('/en/login');
    await page.getByLabel(/email/i).fill('test@kartels.io');
    await page.getByLabel(/password/i).fill('test');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Wait for dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Click logout (look for user menu or logout button)
    await page.getByRole('button', { name: /logout|sign out/i }).click();

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });

    // Try to access dashboard again
    await page.goto('/en/dashboard');

    // Should redirect back to login
    await expect(page).toHaveURL(/\/login/);
  });
});
